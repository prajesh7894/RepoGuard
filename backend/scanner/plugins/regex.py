import os
import re

SECRET_PATTERNS = [
    r'AKIA[0-9A-Z]{16}', # AWS Access Key
    r'(?i)github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}', # GitHub PAT
    r'(?i)bearer\s+[a-zA-Z0-9\-\._~+/]+=*', # Generic Bearer Token
    r'(?i)password\s*=\s*[\'"][^\'"]+[\'"]', # Password assignment
    r'sk_live_[0-9a-zA-Z]{24}', # Stripe Secret Key
    r'xox[baprs]-[0-9a-zA-Z]{10,48}', # Slack Token
    r'AIza[0-9A-Za-z-_]{35}', # Google API Key
    r'SK[0-9a-fA-F]{32}', # Twilio API Key
    r'-----BEGIN (RSA|OPENSSH|DSA|EC|PGP) PRIVATE KEY-----', # Private Keys
    # Database Connection Strings
    r'(?i)mongodb(?:\+srv)?:\/\/[^\s]+', # MongoDB URIs
    r'(?i)postgres(ql)?:\/\/[^\s]+', # PostgreSQL URIs
    r'(?i)mysql:\/\/[^\s]+', # MySQL URIs
    r'(?i)rediss?:\/\/[^\s]+', # Redis URIs
    r'(?i)amqps?:\/\/[^\s]+', # RabbitMQ/AMQP URIs
]

PYTHON_PATTERNS = [
    (r'(?i)(app\.run\s*\(.*debug\s*=\s*True|DEBUG\s*=\s*True)', 'Debug Mode Enabled (Info Leak)', 'HIGH'),
    (r'pickle\.(loads?)\s*\(', 'Insecure Deserialization (pickle)', 'CRITICAL'),
    (r'yaml\.load\s*\(\s*[^,]+(,\s*Loader\s*=\s*yaml\.Loader)?\s*\)', 'Insecure Deserialization (yaml)', 'CRITICAL'),
    (r'\beval\s*\(', 'Arbitrary Code Execution (eval)', 'HIGH'),
    (r'\bexec\s*\(', 'Arbitrary Code Execution (exec)', 'HIGH'),
    (r'(os\.system|subprocess\.(Popen|call|run))\s*\(\s*.*shell\s*=\s*True', 'Command Injection (shell=True)', 'CRITICAL'),
]

def regex_scan(repo_path: str, custom_rules: list = None):
    if custom_rules is None:
        custom_rules = []
        
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
                        
                        # Custom Rules
                        for rule in custom_rules:
                            if re.search(rule['pattern'], line):
                                findings.append({
                                    'file': os.path.relpath(filepath, repo_path).replace('\\', '/'),
                                    'line': i + 1,
                                    'match': line.strip()[:100],
                                    'type': rule['name'],
                                    'severity': rule['severity']
                                })
                        
                        if file.endswith('.py'):
                            for pattern, desc, severity in PYTHON_PATTERNS:
                                if re.search(pattern, line):
                                    findings.append({
                                        'file': os.path.relpath(filepath, repo_path).replace('\\', '/'),
                                        'line': i + 1,
                                        'match': line.strip()[:100],
                                        'type': desc,
                                        'severity': severity
                                    })
            except Exception:
                pass
    return findings
