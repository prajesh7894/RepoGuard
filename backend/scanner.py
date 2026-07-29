import os
import shutil
import re
import tempfile
from git import Repo
import time

SECRET_PATTERNS = [
    r'AKIA[0-9A-Z]{16}',
    r'(?i)github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}',
    r'(?i)bearer\s+[a-zA-Z0-9\-\._~+/]+=*',
    r'(?i)password\s*=\s*[\'"][^\'"]+[\'"]',
]

def run_scan_sync(url: str):
    temp_dir = tempfile.mkdtemp(prefix="repoguard_scan_")
    
    findings = []
    critical = 0
    high = 0
    secrets = 0

    try:
        # Simulate network clone time or actually clone
        if url.startswith("http"):
            Repo.clone_from(url, temp_dir)
        else:
            time.sleep(2) # Fake delay for local tests

        for root, dirs, files in os.walk(temp_dir):
            if '.git' in dirs:
                dirs.remove('.git') # don't visit .git directories
            
            for file in files:
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = f.readlines()
                        for i, line in enumerate(lines):
                            for pattern in SECRET_PATTERNS:
                                if re.search(pattern, line):
                                    findings.append({
                                        'file': os.path.relpath(filepath, temp_dir).replace('\\', '/'),
                                        'line': i + 1,
                                        'match': line.strip()[:100],
                                        'type': 'Hardcoded Secret',
                                        'severity': 'Critical'
                                    })
                                    critical += 1
                                    secrets += 1
                except Exception:
                    pass

        score = max(0, 100 - (critical * 10) - (high * 5))
        return {
            'critical': critical,
            'high': high,
            'secrets': secrets,
            'findings': findings,
            'score': score
        }
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
