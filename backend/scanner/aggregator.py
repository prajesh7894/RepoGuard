def aggregate_findings(findings):
    critical = 0
    high = 0
    secrets = 0

    for finding in findings:
        severity = finding.get('severity', 'LOW').upper()
        if severity == 'CRITICAL':
            critical += 1
        elif severity == 'HIGH':
            high += 1
            
        if finding.get('type') == 'Hardcoded Secret':
            secrets += 1

    score = max(0, 100 - (critical * 10) - (high * 5))
    
    return {
        'critical': critical,
        'high': high,
        'secrets': secrets,
        'findings': findings,
        'score': score
    }
