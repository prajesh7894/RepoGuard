import subprocess
import json
import os

def bandit_scan(repo_path: str):
    findings = []
    try:
        result = subprocess.run(
            ['bandit', '-r', repo_path, '-f', 'json'],
            capture_output=True,
            text=True
        )
        
        output = result.stdout
        if output:
            data = json.loads(output)
            for res in data.get('results', []):
                findings.append({
                    'file': os.path.relpath(res['filename'], repo_path).replace('\\', '/'),
                    'line': res['line_number'],
                    'match': res['issue_text'],
                    'type': res['test_name'],
                    'severity': res['issue_severity'].upper()
                })
    except Exception as e:
        print(f"Bandit scan failed (ensure bandit is installed): {e}")
    return findings
