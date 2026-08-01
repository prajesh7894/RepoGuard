import os
import math
import re

def shannon_entropy(data: str) -> float:
    """Calculates the Shannon entropy of a string."""
    if not data:
        return 0
    entropy = 0
    for x in set(data):
        p_x = float(data.count(x)) / len(data)
        entropy += - p_x * math.log2(p_x)
    return entropy

def secrets_scan(repo_path: str):
    """
    Scans files for high-entropy strings (e.g., base64 or hex encoded tokens) 
    that might be un-patterned secrets.
    """
    findings = []
    # Regex to find words that look like base64 or hex strings (length > 20)
    # We look for long contiguous alphanumeric blocks that could be keys.
    token_pattern = re.compile(r'\b[a-zA-Z0-9_\-\+]{20,128}\b')

    for root, dirs, files in os.walk(repo_path):
        if '.git' in dirs:
            dirs.remove('.git')
        
        for file in files:
            filepath = os.path.join(root, file)
            # Skip common non-code / binary file extensions to avoid false positives
            if file.endswith(('.png', '.jpg', '.jpeg', '.gif', '.pdf', '.zip', '.tar', '.gz', '.min.js', '.min.css', 'package-lock.json')):
                continue

            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    lines = f.readlines()
                    for i, line in enumerate(lines):
                        matches = token_pattern.findall(line)
                        for match in matches:
                            entropy = shannon_entropy(match)
                            # Strings > 20 chars with entropy > 4.5 are often randomly generated keys
                            if entropy > 4.5:
                                findings.append({
                                    'file': os.path.relpath(filepath, repo_path).replace('\\', '/'),
                                    'line': i + 1,
                                    'match': f"{match[:10]}... (Entropy: {entropy:.2f})",
                                    'type': 'High Entropy String (Potential Secret)',
                                    'severity': 'HIGH'
                                })
            except Exception:
                pass
    return findings
