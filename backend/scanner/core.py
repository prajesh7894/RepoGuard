import os
import shutil
import tempfile
from git import Repo
import time

from .plugins.regex import regex_scan
from .plugins.sca import sca_scan
from .plugins.bandit import bandit_scan
from .plugins.secrets import secrets_scan
from .aggregator import aggregate_findings

def run_scan_sync(url: str, custom_rules: list = None):
    temp_dir = tempfile.mkdtemp(prefix="repoguard_scan_")
    
    try:
        if url.startswith("http"):
            Repo.clone_from(url, temp_dir)
        else:
            time.sleep(2) # Fake delay for local tests

        # Run plugins
        findings = []
        findings.extend(regex_scan(temp_dir, custom_rules=custom_rules))
        findings.extend(sca_scan(temp_dir))
        findings.extend(bandit_scan(temp_dir))
        findings.extend(secrets_scan(temp_dir))

        # Aggregate and score
        return aggregate_findings(findings)
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
