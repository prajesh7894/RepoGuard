from fastapi import FastAPI, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jwt
import os
import uuid
from typing import List
import json
import asyncio
from sse_starlette.sse import EventSourceResponse
from google import genai
import re
import bcrypt

import models
import schemas
from database import engine, get_db
from scanner import run_scan_sync

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

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

# -- Repositories --
@app.get("/api/repos")
def get_repos(db: Session = Depends(get_db)):
    repos = db.query(models.Repository).order_by(models.Repository.updatedAt.desc()).all()
    result = []
    for repo in repos:
        latest_scan = db.query(models.Scan).filter(models.Scan.repoId == repo.id).order_by(models.Scan.createdAt.desc()).first()
        result.append({
            "id": repo.id,
            "name": repo.name,
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
def create_repo(repo: schemas.RepoCreate, db: Session = Depends(get_db)):
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
def get_scans(db: Session = Depends(get_db)):
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
            "createdAt": scan.createdAt,
            "repository": {"name": scan.repository.name if scan.repository else "Unknown"}
        })
    return result

from fastapi import BackgroundTasks
from database import SessionLocal

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
    finally:
        db.close()

@app.post("/api/scans")
def trigger_scan(payload: dict, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    repo_id = int(payload.get("repoId"))
    repo = db.query(models.Repository).filter(models.Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(status_code=400, detail="Repository not found")
    
    repo.isScanning = True
    db.commit()
    
    background_tasks.add_task(execute_background_scan, repo.id)
    return {"message": "Scan initiated", "repoId": repo.id}

@app.get("/api/scans/stream")
async def scan_stream(url: str, request: Request):
    if not url:
        raise HTTPException(status_code=400, detail="Repository URL required")

    async def event_generator():
        try:
            yield {"data": json.dumps({"type": "log", "message": "Initializing secure scanning environment..."})}
            await asyncio.sleep(1)
            
            yield {"data": json.dumps({"type": "log", "message": "Cloning repository..."})}
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, run_scan_sync, url)
            
            yield {"data": json.dumps({"type": "log", "message": "Analyzing code syntax & structures..."})}
            await asyncio.sleep(1)
            
            yield {"data": json.dumps({"type": "log", "message": "Searching for hardcoded secrets..."})}
            await asyncio.sleep(1)

            yield {"data": json.dumps({
                "type": "done",
                "findings": result['findings'],
                "score": result['score']
            })}
        except Exception as e:
            yield {"data": json.dumps({"type": "error", "message": str(e)})}
            
    return EventSourceResponse(event_generator())

# -- AI --
@app.post("/api/chat")
async def chat(req: schemas.ChatRequest):
    try:
        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        
        contents = []
        for msg in req.history:
            contents.append(genai.types.Content(
                role="user" if msg.role == "user" else "model",
                parts=[genai.types.Part.from_text(msg.text)]
            ))
        contents.append(genai.types.Content(
            role="user",
            parts=[genai.types.Part.from_text(req.message)]
        ))
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
            config=genai.types.GenerateContentConfig(
                system_instruction="You are a highly capable AI Security Assistant for RepoGuard. Your goal is to help users understand their vulnerabilities, recommend fixes, and provide secure coding practices."
            )
        )
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai-review")
async def ai_review(req: schemas.AIReviewRequest):
    try:
        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        
        prompt = f"""You are an expert Secure Code Reviewer. Analyze the following code snippet for logic flaws, injection vectors, and security vulnerabilities.
Return ONLY a valid JSON object with a single "vulns" array. Each object in the array must have:
- title: A short, descriptive title of the vulnerability.
- severity: "critical", "high", "medium", or "low".
- line: The approximate line number where the issue exists (number).
- description: A clear explanation of the vulnerability and its impact.
- recommendation: A short sentence on how to fix it.
- fixedCode: The complete, corrected version of the code snippet that resolves the issue.

Do NOT wrap the JSON in Markdown backticks or any other formatting. Output ONLY the raw JSON string.

Code to analyze:
```
{req.code}
```
"""
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        raw_text = response.text or "{}"
        raw_text = re.sub(r'^```json\s*', '', raw_text, flags=re.IGNORECASE)
        raw_text = re.sub(r'\s*```$', '', raw_text, flags=re.IGNORECASE).strip()
        
        return json.loads(raw_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
