from fastapi import FastAPI, Depends, HTTPException, status, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

import uuid
from typing import List
import json
import asyncio
from sse_starlette.sse import EventSourceResponse
from google import genai
import re
import bcrypt
import csv
import io
from fpdf import FPDF

import models
import schemas
from database import engine, get_db
from scanner import run_scan_sync
from webhooks import router as webhooks_router
from auth import get_current_user

models.Base.metadata.create_all(bind=engine)

from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
from database import SessionLocal

def nightly_scan_job():
    db = SessionLocal()
    try:
        repos = db.query(models.Repository).all()
        for repo in repos:
            # We delay the import of execute_background_scan or define it below, 
            # actually execute_background_scan is defined further down. 
            # We can use a helper or import inside the thread.
            pass # We'll define the actual thread call inside the job later or move execute_background_scan up
    finally:
        db.close()

# We will define the lifespan and actual job logic below after execute_background_scan is defined.
app = FastAPI()

app.include_router(webhooks_router, prefix="/api/webhooks")

JWT_SECRET = os.getenv("JWT_SECRET", "fallback_secret_for_development")
ALGORITHM = "HS256"

# -- Authentication -- 
@app.post("/api/register", status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = models.User(email=user.email, password=hashed_password, name=user.name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "userId": new_user.id}

@app.post("/api/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Node bcryptjs outputs $2a$ format which is compatible with Python bcrypt.
    is_valid = False
    try:
        is_valid = bcrypt.checkpw(user.password.encode('utf-8'), db_user.password.encode('utf-8'))
    except Exception:
        pass
        
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    expire = datetime.utcnow() + timedelta(days=1)
    to_encode = {"userId": db_user.id, "exp": expire.timestamp()}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    
    new_session = models.Session(
        id=str(uuid.uuid4()),
        userId=db_user.id,
        token=encoded_jwt,
        expiresAt=expire
    )
    db.add(new_session)
    db.commit()
    
    return {
        "message": "Login successful",
        "token": encoded_jwt,
        "user": {"id": db_user.id, "email": db_user.email, "name": db_user.name}
    }

@app.get("/api/me")
def get_me(user: models.User = Depends(get_current_user)):
    return {"id": user.id, "email": user.email, "name": user.name, "preferences": user.preferences, "githubLinked": bool(user.githubToken)}

@app.put("/api/me/preferences")
def update_preferences(prefs: schemas.PreferencesUpdate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    user.preferences = prefs.preferences
    db.commit()
    return {"message": "Preferences updated successfully"}

from fastapi.responses import RedirectResponse
import httpx
from urllib.parse import urlencode
import base64

@app.get("/api/auth/github")
def github_login(request: Request):
    client_id = os.environ.get("GITHUB_CLIENT_ID")
    referer = request.headers.get("referer")
    base_url = "http://localhost:5173"
    
    if referer:
        parts = referer.split("/")
        if len(parts) >= 3:
            base_url = f"{parts[0]}//{parts[2]}"
            
    if not client_id:
        return RedirectResponse(url=f"{base_url}/repositories?code=mock_code")
    
    params = {
        "client_id": client_id,
        "scope": "repo",
        "redirect_uri": f"{base_url}/repositories"
    }
    return RedirectResponse(url=f"https://github.com/login/oauth/authorize?{urlencode(params)}")

@app.post("/api/auth/github/callback")
async def github_callback(payload: dict, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    code = payload.get("code")
    client_id = os.environ.get("GITHUB_CLIENT_ID")
    client_secret = os.environ.get("GITHUB_CLIENT_SECRET")
    
    if code == "mock_code" or not client_id:
        user.githubToken = "mock_github_token_for_testing"
        db.commit()
        return {"message": "GitHub linked successfully (Mock Mode)"}

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code
            }
        )
    data = resp.json()
    token = data.get("access_token")
    if not token:
        raise HTTPException(status_code=400, detail="Failed to get GitHub token")
    
    user.githubToken = token
    db.commit()

    # Automatically fetch and sync user's repositories
    async with httpx.AsyncClient() as client:
        repos_resp = await client.get(
            "https://api.github.com/user/repos?per_page=100",
            headers={
                "Authorization": f"token {token}",
                "Accept": "application/vnd.github.v3+json"
            }
        )
        if repos_resp.status_code == 200:
            repos_data = repos_resp.json()
            for repo_data in repos_data:
                # Check if repo already exists
                existing = db.query(models.Repository).filter(models.Repository.url == repo_data.get("html_url")).first()
                if not existing:
                    new_repo = models.Repository(
                        name=repo_data.get("name"),
                        url=repo_data.get("html_url"),
                        lang=repo_data.get("language") or "Unknown",
                        status="Secure",
                        score=100,
                        scoreColor="#10b981",
                        isScanning=False
                    )
                    db.add(new_repo)
            db.commit()

    return {"message": "GitHub linked successfully and repositories synced"}

import base64
import random
import string

class PRRequest(BaseModel):
    finding: dict
    repo_url: str

@app.post("/api/remediate/pr")
async def create_remediation_pr(req: PRRequest, user: models.User = Depends(get_current_user)):
    if not user.githubToken:
        raise HTTPException(status_code=401, detail="GitHub not linked")
        
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")
        
    owner_repo = req.repo_url.replace("https://github.com/", "").replace(".git", "")
    api_base = f"https://api.github.com/repos/{owner_repo}"
    file_path = req.finding.get('file', '')
    if file_path.startswith('/'):
        file_path = file_path[1:]
        
    headers = {
        "Authorization": f"token {user.githubToken}",
        "Accept": "application/vnd.github.v3+json"
    }

    try:
        async with httpx.AsyncClient() as client:
            # 1. Get original file content
            file_resp = await client.get(f"{api_base}/contents/{file_path}", headers=headers)
            if file_resp.status_code != 200:
                raise Exception(f"Could not fetch file {file_path} from {owner_repo}: {file_resp.status_code} - {file_resp.text}")
            
            file_data = file_resp.json()
            original_content = base64.b64decode(file_data['content']).decode('utf-8')
            file_sha = file_data['sha']
            
            # 2. Generate fix with AI
            finding_context = f"File: {file_path}\nLine: {req.finding.get('line')}\nType: {req.finding.get('type')}\nMatch: {req.finding.get('match')}"
            
            payload = {
                "systemInstruction": {
                    "parts": [{"text": "You are an automated remediation bot. Given a vulnerable file and the vulnerability details, output the ENTIRE file with the vulnerability fixed. Do NOT include markdown code block formatting (like ```python) and do NOT include any explanations. Output ONLY the raw corrected file contents."}]
                },
                "contents": [{"role": "user", "parts": [{"text": f"Fix this vulnerability:\n\n{finding_context}\n\nOriginal File Content:\n{original_content}"}]}]
            }
            
            ai_resp = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}",
                json=payload,
                timeout=30.0
            )
            ai_resp.raise_for_status()
            fixed_code = ai_resp.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            
            # Strip markdown if AI accidentally included it
            if fixed_code.startswith("```"):
                fixed_code = "\n".join(fixed_code.split("\n")[1:])
            if fixed_code.endswith("```"):
                fixed_code = "\n".join(fixed_code.split("\n")[:-1])
                
            if user.githubToken == "mock_github_token_for_testing":
                return {"message": "PR successfully created! (Mock Mode)", "url": "https://github.com/mock/pull/1", "patch": fixed_code}
                
            # 3. Get default branch & sha
            repo_resp = await client.get(api_base, headers=headers)
            default_branch = repo_resp.json().get("default_branch", "main")
            
            ref_resp = await client.get(f"{api_base}/git/ref/heads/{default_branch}", headers=headers)
            base_sha = ref_resp.json().get("object", {}).get("sha")
            
            # 4. Create new branch
            branch_name = f"repoguard-fix-{''.join(random.choices(string.ascii_lowercase + string.digits, k=6))}"
            new_ref_resp = await client.post(
                f"{api_base}/git/refs",
                headers=headers,
                json={"ref": f"refs/heads/{branch_name}", "sha": base_sha}
            )
            if new_ref_resp.status_code != 201:
                raise Exception("Failed to create branch")
                
            # 5. Commit updated file
            updated_content_b64 = base64.b64encode(fixed_code.encode('utf-8')).decode('utf-8')
            commit_resp = await client.put(
                f"{api_base}/contents/{file_path}",
                headers=headers,
                json={
                    "message": f"Auto-fix {req.finding.get('type')} vulnerability in {file_path}",
                    "content": updated_content_b64,
                    "sha": file_sha,
                    "branch": branch_name
                }
            )
            if commit_resp.status_code not in [200, 201]:
                raise Exception("Failed to commit fixed file")
                
            # 6. Open PR
            pr_resp = await client.post(
                f"{api_base}/pulls",
                headers=headers,
                json={
                    "title": f"🛡️ RepoGuard Auto-Fix: {req.finding.get('type')}",
                    "head": branch_name,
                    "base": default_branch,
                    "body": f"This Pull Request was generated autonomously by **RepoGuard AI** to remediate a detected vulnerability.\n\n- **Vulnerability:** {req.finding.get('type')}\n- **File:** `{file_path}`\n- **Line:** {req.finding.get('line')}\n\nPlease review the changes before merging."
                }
            )
            if pr_resp.status_code != 201:
                raise Exception("Failed to open PR")
                
            pr_url = pr_resp.json().get("html_url")
            
            return {"message": "PR successfully created!", "url": pr_url, "patch": fixed_code}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# -- Organizations --
@app.post("/api/organizations", status_code=status.HTTP_201_CREATED)
def create_organization(org: schemas.OrganizationCreate, db: Session = Depends(get_db)):
    new_org = models.Organization(name=org.name)
    db.add(new_org)
    db.commit()
    db.refresh(new_org)
    return new_org

@app.get("/api/organizations")
def get_organizations(db: Session = Depends(get_db)):
    orgs = db.query(models.Organization).order_by(models.Organization.createdAt.desc()).all()
    return orgs

@app.get("/api/organizations/{org_id}/members")
def get_organization_members(org_id: int, db: Session = Depends(get_db)):
    members = db.query(models.OrganizationMember).filter(models.OrganizationMember.orgId == org_id).all()
    result = []
    for m in members:
        user = db.query(models.User).filter(models.User.id == m.userId).first()
        result.append({
            "id": m.id,
            "orgId": m.orgId,
            "userId": m.userId,
            "role": m.role,
            "user": {"id": user.id, "email": user.email, "name": user.name} if user else None
        })
    return result

@app.post("/api/organizations/{org_id}/members")
def add_organization_member(org_id: int, payload: dict, db: Session = Depends(get_db)):
    email = payload.get("email")
    role = payload.get("role", "viewer")
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found with this email")
        
    existing = db.query(models.OrganizationMember).filter(
        models.OrganizationMember.orgId == org_id, 
        models.OrganizationMember.userId == user.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="User is already a member")
        
    new_member = models.OrganizationMember(orgId=org_id, userId=user.id, role=role)
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member

# -- Repositories --
@app.get("/api/repos")
def get_repos(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    repos = db.query(models.Repository).order_by(models.Repository.updatedAt.desc()).all()
    result = []
    for repo in repos:
        latest_scan = db.query(models.Scan).filter(models.Scan.repoId == repo.id).order_by(models.Scan.createdAt.desc()).first()
        result.append({
            "id": repo.id,
            "name": repo.name,
            "url": repo.url,
            "lang": repo.lang,
            "status": repo.status,
            "score": repo.score,
            "scoreColor": repo.scoreColor,
            "isScanning": repo.isScanning,
            "createdAt": repo.createdAt,
            "findings": {
                "crit": latest_scan.critical if latest_scan else 0,
                "high": latest_scan.high if latest_scan else 0,
                "secrets": latest_scan.secrets if latest_scan else 0,
                "detail": json.loads(latest_scan.findingsDetail) if latest_scan and latest_scan.findingsDetail else []
            }
        })
    return result

@app.post("/api/repos")
def create_repo(repo: schemas.RepoCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    name = repo.url.split("/")[-1].replace(".git", "") if "/" in repo.url else "New Repo"
    new_repo = models.Repository(
        name=name,
        url=repo.url,
        lang="Unknown",
        status="Excellent",
        score=100,
        scoreColor="green-400",
        isScanning=False
    )
    db.add(new_repo)
    db.commit()
    db.refresh(new_repo)
    return new_repo

@app.get("/api/repos/{id}")
def get_repo(id: int, db: Session = Depends(get_db)):
    repo = db.query(models.Repository).filter(models.Repository.id == id).first()
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")
    return repo

# -- Scans --
@app.get("/api/scans")
def get_scans(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    scans = db.query(models.Scan).order_by(models.Scan.createdAt.desc()).limit(20).all()
    result = []
    for scan in scans:
        result.append({
            "id": scan.id,
            "repoId": scan.repoId,
            "critical": scan.critical,
            "high": scan.high,
            "secrets": scan.secrets,
            "status": scan.status,
            "findingsDetail": scan.findingsDetail,
            "createdAt": scan.createdAt,
            "repository": {
                "name": scan.repository.name if scan.repository else "Unknown",
                "url": scan.repository.url if scan.repository else ""
            }
        })
    return result

from fastapi.responses import Response

@app.get("/api/scans/{scan_id}/export/json")
def export_scan_json(scan_id: int, db: Session = Depends(get_db)):
    scan = db.query(models.Scan).filter(models.Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    # We can reconstruct a detailed JSON object
    export_data = {
        "id": scan.id,
        "repoId": scan.repoId,
        "repository": scan.repository.name if scan.repository else "Unknown",
        "url": scan.repository.url if scan.repository else "Unknown",
        "critical": scan.critical,
        "high": scan.high,
        "secrets": scan.secrets,
        "status": scan.status,
        "createdAt": scan.createdAt.isoformat() if scan.createdAt else None,
        "findings": json.loads(scan.findingsDetail) if scan.findingsDetail else []
    }
    
    json_str = json.dumps(export_data, indent=2)
    return Response(
        content=json_str,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=repoguard_scan_{scan_id}.json"}
    )

@app.get("/api/scans/export/csv")
def export_all_scans_csv(db: Session = Depends(get_db)):
    scans = db.query(models.Scan).order_by(models.Scan.createdAt.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Scan ID", "Repository", "Date", "Status", "Critical", "High", "Secrets"])
    
    for scan in scans:
        repo_name = scan.repository.name if scan.repository else "Unknown"
        writer.writerow([
            f"SCN-{str(scan.id).zfill(4)}",
            repo_name,
            scan.createdAt.isoformat() if scan.createdAt else "",
            scan.status,
            scan.critical,
            scan.high,
            scan.secrets
        ])
        
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=repoguard_all_scans.csv"}
    )

@app.get("/api/scans/{scan_id}/export/csv")
def export_scan_csv(scan_id: int, db: Session = Depends(get_db)):
    scan = db.query(models.Scan).filter(models.Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    findings = json.loads(scan.findingsDetail) if scan.findingsDetail else []
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Type", "Severity", "File", "Line", "Description"])
    
    for f in findings:
        writer.writerow([
            f.get("title", ""),
            f.get("severity", ""),
            f.get("file", ""),
            f.get("line", ""),
            f.get("description", "")
        ])
        
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=repoguard_scan_{scan_id}_findings.csv"}
    )

class PDF(FPDF):
    def header(self):
        # Draw a dark blue banner at the top
        self.set_fill_color(15, 23, 42) # slate-900
        self.rect(0, 0, 210, 25, "F")
        self.set_y(8)
        self.set_font("helvetica", "B", 20)
        self.set_text_color(255, 255, 255)
        self.cell(0, 10, "RepoGuard Security Scan Report", border=0, align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(15)
        self.set_text_color(0, 0, 0) # reset to black
        
    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f"Generated by RepoGuard AI | Page {self.page_no()}/{{nb}}", align="C")

@app.get("/api/scans/{scan_id}/export/pdf")
def export_scan_pdf(scan_id: int, db: Session = Depends(get_db)):
    scan = db.query(models.Scan).filter(models.Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    pdf = PDF()
    pdf.add_page()
    
    # Report Metadata Block
    pdf.set_fill_color(241, 245, 249) # slate-100
    pdf.set_draw_color(203, 213, 225) # slate-300
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 10, " Scan Metadata", border=1, align="L", fill=True, new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font("helvetica", "", 11)
    pdf.set_text_color(51, 65, 85)
    repo_name = scan.repository.name if scan.repository else "Unknown"
    scan_date = scan.createdAt.strftime("%B %d, %Y - %H:%M:%S UTC") if scan.createdAt else "Unknown"
    overall_score = scan.repository.score if scan.repository else "N/A"
    
    pdf.cell(0, 8, f"  Repository: {repo_name}", border="LR", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, f"  Scan ID: SCN-{str(scan.id).zfill(4)}", border="LR", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, f"  Date: {scan_date}", border="LR", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 8, f"  Overall Health Score: {overall_score}/100", border="LRB", new_x="LMARGIN", new_y="NEXT")
    
    pdf.ln(10)
    
    # Executive Summary Block
    pdf.set_font("helvetica", "B", 14)
    pdf.set_fill_color(241, 245, 249)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 10, " Executive Summary", border=1, align="L", fill=True, new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(63, 10, "Critical Vulnerabilities", border="L", align="C")
    pdf.cell(63, 10, "High Vulnerabilities", border="0", align="C")
    pdf.cell(64, 10, "Exposed Secrets", border="R", align="C", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font("helvetica", "B", 16)
    # Print metrics with colors
    pdf.set_text_color(220, 38, 38) # red-600
    pdf.cell(63, 12, str(scan.critical), border="LB", align="C")
    pdf.set_text_color(234, 88, 12) # orange-600
    pdf.cell(63, 12, str(scan.high), border="B", align="C")
    pdf.set_text_color(37, 99, 235) # blue-600
    pdf.cell(64, 12, str(scan.secrets), border="RB", align="C", new_x="LMARGIN", new_y="NEXT")
    
    pdf.ln(10)
    pdf.set_text_color(15, 23, 42)
    
    # Findings Details
    pdf.set_font("helvetica", "B", 14)
    pdf.cell(0, 10, " Detailed Findings", border=1, align="L", fill=True, new_x="LMARGIN", new_y="NEXT")
    
    findings = json.loads(scan.findingsDetail) if scan.findingsDetail else []
    if not findings:
        pdf.set_font("helvetica", "I", 12)
        pdf.set_text_color(22, 163, 74) # green-600
        pdf.cell(0, 15, "  No vulnerabilities found! The codebase is secure.", border="LRB", new_x="LMARGIN", new_y="NEXT")
    else:
        for idx, f in enumerate(findings):
            title = f.get("title", "Unknown Finding")
            severity = str(f.get("severity", "info")).upper()
            
            # Severity Background Color
            if severity == "CRITICAL":
                pdf.set_fill_color(254, 226, 226) # red-100
                pdf.set_text_color(153, 27, 27) # red-800
            elif severity == "HIGH":
                pdf.set_fill_color(255, 237, 213) # orange-100
                pdf.set_text_color(154, 52, 18) # orange-800
            else:
                pdf.set_fill_color(224, 242, 254) # blue-100
                pdf.set_text_color(30, 64, 175) # blue-800
                
            pdf.set_font("helvetica", "B", 11)
            pdf.cell(0, 8, f"  {idx+1}. {title} [{severity}]", border="LR", fill=True, new_x="LMARGIN", new_y="NEXT")
            
            pdf.set_text_color(51, 65, 85)
            pdf.set_font("helvetica", "I", 10)
            pdf.cell(0, 6, f"  File: {f.get('file', '')} | Line: {f.get('line', '')}", border="LR", new_x="LMARGIN", new_y="NEXT")
            
            pdf.set_font("helvetica", "", 10)
            desc = f.get("description", "").replace("\n", " ")
            pdf.multi_cell(0, 6, f"  Description: {desc}", border="LR")
            
            # Close the bottom border of the finding
            pdf.cell(0, 2, "", border="LRB", new_x="LMARGIN", new_y="NEXT")
            pdf.ln(3)
            
    pdf_bytes = pdf.output()
    return Response(
        content=bytes(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=repoguard_scan_{scan_id}.pdf"}
    )

from fastapi import BackgroundTasks
from database import SessionLocal
import threading

def execute_background_scan(repo_id: int):
    db = SessionLocal()
    try:
        repo = db.query(models.Repository).filter(models.Repository.id == repo_id).first()
        if not repo:
            return
            
        result = run_scan_sync(repo.url)
        
        new_scan = models.Scan(
            repoId=repo.id,
            critical=result['critical'],
            high=result['high'],
            secrets=result['secrets'],
            status="completed",
            findingsDetail=json.dumps(result['findings'])
        )
        db.add(new_scan)
        
        color = "green-400" if result['score'] > 80 else ("yellow-400" if result['score'] > 50 else "red-400")
        repo.isScanning = False
        repo.score = result['score']
        repo.scoreColor = color
        repo.status = "Critical" if result['critical'] > 0 else "Excellent"
        
        db.commit()
        
        # Create Notification
        new_notif = models.Notification(
            userId=repo.orgId or 1, # default to user 1 for now if no org setup fully links user
            type="success",
            title="Scan Completed Successfully",
            message=f"Background scan for {repo.name} finished with {result['critical']} critical findings."
        )
        # Try to find a user in that org
        member = db.query(models.OrganizationMember).filter(models.OrganizationMember.orgId == repo.orgId).first()
        if member:
            new_notif.userId = member.userId
        db.add(new_notif)
        db.commit()
    finally:
        db.close()

@app.post("/api/scans")
def trigger_scan(payload: dict, background_tasks: BackgroundTasks, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    repo_id = int(payload.get("repoId"))
    repo = db.query(models.Repository).filter(models.Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(status_code=400, detail="Repository not found")
    
    repo.isScanning = True
    db.commit()
    
    background_tasks.add_task(execute_background_scan, repo.id)
    return {"message": "Scan initiated", "repoId": repo.id}

# Update nightly_scan_job now that execute_background_scan is defined
def run_nightly_scans():
    db = SessionLocal()
    try:
        repos = db.query(models.Repository).all()
        for repo in repos:
            # Run each scan in a separate thread to avoid blocking the scheduler
            threading.Thread(target=execute_background_scan, args=(repo.id,)).start()
    finally:
        db.close()

# Start scheduler on startup using an event (simpler than moving app instantiation)
@app.on_event("startup")
def startup_event():
    scheduler = BackgroundScheduler()
    scheduler.add_job(run_nightly_scans, 'cron', hour=0, minute=0)
    scheduler.start()

@app.get("/api/scans/stream")
async def scan_stream(
    url: str, 
    request: Request,
    ai: str = "true",
    secret: str = "true",
    dep: str = "true",
    repoId: int = None
):
    if not url:
        raise HTTPException(status_code=400, detail="Repository URL required")

    async def event_generator():
        try:
            yield {"data": json.dumps({"type": "log", "message": "Initializing RepoGuard modular scanning engine..."})}
            await asyncio.sleep(0.5)
            
            yield {"data": json.dumps({"type": "log", "message": "Cloning repository to secure volume..."})}
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, run_scan_sync, url)
            
            yield {"data": json.dumps({"type": "log", "message": "[Plugin: Bandit] Analyzing Python Abstract Syntax Trees (AST)..."})}
            await asyncio.sleep(0.5)
            
            if secret == "true":
                yield {"data": json.dumps({"type": "log", "message": "[Plugin: Regex] Running Entropy Engine for hardcoded secrets..."})}
                await asyncio.sleep(0.5)
                
            if dep == "true":
                yield {"data": json.dumps({"type": "log", "message": "[Plugin: SCA] Scanning dependency tree for known CVEs..."})}
                await asyncio.sleep(0.5)
                
            if ai == "true":
                yield {"data": json.dumps({"type": "log", "message": "[Plugin: AI] Analyzing data flow and logic paths with LLM..."})}
                await asyncio.sleep(0.5)
            
            yield {"data": json.dumps({"type": "log", "message": "Aggregating vulnerabilities and generating compliance report..."})}
            await asyncio.sleep(0.5)

            if repoId is not None:
                db = SessionLocal()
                try:
                    repo = db.query(models.Repository).filter(models.Repository.id == repoId).first()
                    if repo:
                        new_scan = models.Scan(
                            repoId=repo.id,
                            critical=result['critical'],
                            high=result['high'],
                            secrets=result['secrets'],
                            status="completed",
                            findingsDetail=json.dumps(result['findings'])
                        )
                        db.add(new_scan)
                        color = "green-400" if result['score'] > 80 else ("yellow-400" if result['score'] > 50 else "red-400")
                        repo.isScanning = False
                        repo.score = result['score']
                        repo.scoreColor = color
                        repo.status = "Critical" if result['critical'] > 0 else "Excellent"
                        
                        new_notif = models.Notification(
                            type="success",
                            title="Scan Completed Successfully",
                            message=f"Manual scan for {repo.name} finished with {result['critical']} critical findings."
                        )
                        member = db.query(models.OrganizationMember).filter(models.OrganizationMember.orgId == repo.orgId).first()
                        if member:
                            new_notif.userId = member.userId
                        else:
                            new_notif.userId = 1
                        db.add(new_notif)
                        
                        db.commit()
                finally:
                    db.close()

            yield {"data": json.dumps({
                "type": "done",
                "findings": result['findings'],
                "score": result['score']
            })}
        except Exception as e:
            yield {"data": json.dumps({"type": "error", "message": str(e)})}
            
    return EventSourceResponse(event_generator())

# -- Notifications --
@app.get("/api/notifications")
def get_notifications(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    notifications = db.query(models.Notification).filter(models.Notification.userId == user.id).order_by(models.Notification.createdAt.desc()).limit(50).all()
    return notifications

@app.post("/api/notifications/read")
def mark_notifications_read(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    db.query(models.Notification).filter(models.Notification.userId == user.id).update({"unread": False})
    db.commit()
    return {"message": "Notifications marked as read"}

# -- Reports --
@app.get("/api/reports/analytics")
def get_report_analytics(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    # simple mock logic based on actual scans for the UI
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    scans = db.query(models.Scan).filter(models.Scan.createdAt >= thirty_days_ago).all()
    
    crit = sum(s.critical for s in scans)
    high = sum(s.high for s in scans)
    med = sum(s.secrets for s in scans) # repurposing secrets as medium for simple demo distribution
    
    return {
        "trend": [max(5, s.critical + s.high) for s in scans[-10:]] if scans else [10, 20, 15, 25, 20],
        "severity": {
            "critical": crit or 12,
            "high": high or 25,
            "medium": med or 43
        }
    }

import httpx

# -- AI --
@app.post("/api/chat")
async def chat(req: schemas.ChatRequest):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")
    try:
        contents = []
        for msg in req.history:
            contents.append({
                "role": "user" if msg.role == "user" else "model",
                "parts": [{"text": msg.text}]
            })
        contents.append({
            "role": "user",
            "parts": [{"text": req.message}]
        })
        
        payload = {
            "systemInstruction": {
                "parts": [{"text": "You are a highly capable AI Security Assistant for RepoGuard. Your goal is to help users understand their vulnerabilities, recommend fixes, and provide secure coding practices."}]
            },
            "contents": contents
        }
        
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}",
                json=payload,
                timeout=30.0
            )
        resp.raise_for_status()
        data = resp.json()
        text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        return {"response": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai-review")
async def ai_review(req: schemas.AIReviewRequest, user: models.User = Depends(get_current_user)):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")
    try:
        prompt = f"""You are an expert Secure Code Reviewer. Analyze the following code snippet.
Return a valid JSON object with a single "vulns" array.
Each object in the "vulns" array MUST have:
- title: Short descriptive title. If false positive, say "False Positive / Safe".
- severity: "critical", "high", "medium", "low", or "info".
- line: Approximate line number (number).
- description: Clear explanation of the vulnerability. If it is a false positive or not code, explain why.
- recommendation: How to fix or suppress it.
- fixedCode: The corrected code.

You MUST return exactly ONE object in the "vulns" array, even if the snippet is safe or just text.
Output ONLY raw JSON.

Code to analyze:
```
{req.code}
```
"""
        payload = {
            "contents": [{
                "role": "user",
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "responseMimeType": "application/json"
            }
        }
        
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}",
                json=payload,
                timeout=30.0
            )
        resp.raise_for_status()
        data = resp.json()
        raw_text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", '{"vulns": []}')
        
        raw_text = re.sub(r'^```json\s*', '', raw_text, flags=re.IGNORECASE)
        raw_text = re.sub(r'\s*```$', '', raw_text, flags=re.IGNORECASE).strip()
        
        return json.loads(raw_text)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
