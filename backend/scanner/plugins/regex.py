import os
import re

SECRET_PATTERNS = [
    r'AKIA[0-9A-Z]{16}',
    r'(?i)github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}',
    r'(?i)bearer\s+[a-zA-Z0-9\-\._~+/]+=*',
    r'(?i)password\s*=\s*[\'"][^\'"]+[\'"]',
]

def regex_scan(repo_path: str):
    findings = []
    for root, dirs, files in os.walk(repo_path):
        if '.git' in dirs:
            dirs.remove('.git')
        
        for file in files:
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    lines = f.readlines()
                    for i, line in enumerate(lines):
                        for pattern in SECRET_PATTERNS:
                            if re.search(pattern, line):
                                findings.append({
                                    'file': os.path.relpath(filepath, repo_path).replace('\\', '/'),
                                    'line': i + 1,
                                    'match': line.strip()[:100],
                                    'type': 'Hardcoded Secret',
                                    'severity': 'CRITICAL'
                                })
            except Exception:
                pass
    return findings
