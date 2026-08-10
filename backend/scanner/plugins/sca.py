import os
import json
import requests

def get_osv_vulnerabilities(package_name, version, ecosystem="npm"):
    url = "https://api.osv.dev/v1/query"
    payload = {
        "package": {
            "name": package_name,
            "ecosystem": ecosystem
        },
        "version": version
    }
    try:
        response = requests.post(url, json=payload, timeout=5)
        if response.status_code == 200:
            data = response.json()
            return data.get("vulns", [])
    except Exception as e:
        print(f"OSV API Error for {package_name}: {e}")
    return []

def sca_scan(repo_path: str):
    findings = []
    
    for root, dirs, files in os.walk(repo_path):
        if '.git' in dirs:
            dirs.remove('.git')
        
        if 'package.json' in files:
            filepath = os.path.join(root, 'package.json')
            rel_path = os.path.relpath(filepath, repo_path).replace('\\', '/')
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    data = json.loads(content)
                    
                    # Combine dependencies and devDependencies
                    deps = data.get("dependencies", {})
                    dev_deps = data.get("devDependencies", {})
                    all_deps = {**deps, **dev_deps}
                    
                    for pkg, ver in all_deps.items():
                        # Clean version string (e.g. ^1.2.3 -> 1.2.3)
                        # More complex semver parsing could be used, but this is a simple approximation
                        clean_ver = ver.replace('^', '').replace('~', '').replace('>', '').replace('=', '').strip()
                        
                        vulns = get_osv_vulnerabilities(pkg, clean_ver, "npm")
                        
                        for vuln in vulns:
                            cve_id = vuln.get("id", "Unknown CVE")
                            aliases = vuln.get("aliases", [])
                            if aliases:
                                cve_id += f" ({aliases[0]})"
                                
                            summary = vuln.get("summary", "Vulnerable Dependency")
                            
                            # Find approximate line number
                            line_num = 1
                            for i, line in enumerate(content.split('\n')):
                                if f'"{pkg}"' in line:
                                    line_num = i + 1
                                    break
                                    
                            findings.append({
                                'file': rel_path,
                                'line': line_num,
                                'match': f'"{pkg}": "{ver}"',
                                'type': f'SCA Vulnerability: {cve_id} - {summary}',
                                'severity': 'HIGH' # OSV doesn't always provide simple severity, default to HIGH
                            })
            except Exception as e:
                print(f"Error parsing {filepath}: {e}")
                
    return findings
