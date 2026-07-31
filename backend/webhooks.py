from fastapi import APIRouter, Request, HTTPException, BackgroundTasks, Depends
import hmac
import hashlib
import os
import json
from database import get_db, SessionLocal
from sqlalchemy.orm import Session
import models

from scanner import run_scan_sync

router = APIRouter()

GITHUB_WEBHOOK_SECRET = os.getenv("GITHUB_WEBHOOK_SECRET", "supersecret")

def execute_webhook_scan(repo_url: str, repo_id: int):
    db = SessionLocal()
    try:
        repo = db.query(models.Repository).filter(models.Repository.id == repo_id).first()
        if not repo:
            return
            
        result = run_scan_sync(repo_url)
        
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

@router.post("/github")
async def github_webhook(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    signature = request.headers.get("X-Hub-Signature-256")
    if not signature:
        raise HTTPException(status_code=403, detail="Missing signature")
        
    payload = await request.body()
    
    # Verify signature
    expected_signature = "sha256=" + hmac.new(
        GITHUB_WEBHOOK_SECRET.encode(), payload, hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected_signature):
        raise HTTPException(status_code=403, detail="Invalid signature")
        
    event = request.headers.get("X-GitHub-Event")
    if event in ["push", "pull_request"]:
        data = json.loads(payload)
        repo_url = data.get("repository", {}).get("clone_url")
        
        if repo_url:
            # Find the repo in our DB to attach the scan to
            repo = db.query(models.Repository).filter(models.Repository.url == repo_url).first()
            if repo:
                repo.isScanning = True
                db.commit()
                background_tasks.add_task(execute_webhook_scan, repo_url, repo.id)
                
    return {"message": "Webhook received"}
