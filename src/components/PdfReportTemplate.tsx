import React from 'react';

export default function PdfReportTemplate({ repo }: { repo: any }) {
  if (!repo) return null;

  const findings = repo.findings?.detail || [];
  
  // Format dates robustly
  let dateObj = new Date();
  if (repo.createdAt) {
    const parsed = new Date(repo.createdAt.endsWith('Z') ? repo.createdAt : repo.createdAt + 'Z');
    if (!isNaN(parsed.getTime())) dateObj = parsed;
  }
  
  const scanDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div id="pdf-report-template" style={{ 
      width: '8.5in', // Standard letter width
      padding: '0.5in', 
      backgroundColor: '#ffffff', 
      color: '#1f2937', 
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>RepoGuard</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Automated Security Analysis Report</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Generated on:</p>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#374151' }}>{scanDate}</p>
        </div>
      </div>

      {/* REPO DETAILS */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Repository Overview</h2>
        <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <table style={{ width: '100%', textAlign: 'left', fontSize: '14px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 0', fontWeight: '600', color: '#4b5563', width: '150px' }}>Repository Name:</td>
                <td style={{ padding: '4px 0', color: '#111827' }}>{repo.name}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', fontWeight: '600', color: '#4b5563' }}>URL:</td>
                <td style={{ padding: '4px 0', color: '#111827' }}>{repo.url}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', fontWeight: '600', color: '#4b5563' }}>Primary Language:</td>
                <td style={{ padding: '4px 0', color: '#111827' }}>{repo.lang || 'Unknown'}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', fontWeight: '600', color: '#4b5563' }}>Security Status:</td>
                <td style={{ padding: '4px 0', color: repo.status === 'Critical' ? '#dc2626' : (repo.status === 'Warning' ? '#d97706' : '#16a34a'), fontWeight: 'bold' }}>{repo.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
        <div style={{ flex: 1, backgroundColor: '#f9fafb', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
          <h3 style={{ fontSize: '16px', color: '#4b5563', margin: '0 0 8px 0' }}>Overall Score</h3>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: repo.score > 80 ? '#16a34a' : (repo.score > 50 ? '#d97706' : '#dc2626') }}>
            {repo.score}/100
          </div>
        </div>
        
        <div style={{ flex: 2, display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, backgroundColor: '#fef2f2', padding: '20px', borderRadius: '8px', border: '1px solid #fca5a5', textAlign: 'center' }}>
            <h4 style={{ fontSize: '14px', color: '#991b1b', margin: '0 0 4px 0' }}>CRITICAL</h4>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>{repo.findings?.crit || 0}</div>
          </div>
          <div style={{ flex: 1, backgroundColor: '#fffbeb', padding: '20px', borderRadius: '8px', border: '1px solid #fcd34d', textAlign: 'center' }}>
            <h4 style={{ fontSize: '14px', color: '#92400e', margin: '0 0 4px 0' }}>HIGH</h4>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706' }}>{repo.findings?.high || 0}</div>
          </div>
          <div style={{ flex: 1, backgroundColor: '#fff7ed', padding: '20px', borderRadius: '8px', border: '1px solid #fdba74', textAlign: 'center' }}>
            <h4 style={{ fontSize: '14px', color: '#9a3412', margin: '0 0 4px 0' }}>SECRETS</h4>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ea580c' }}>{repo.findings?.secrets || 0}</div>
          </div>
        </div>
      </div>

      <div className="html2pdf__page-break"></div>

      {/* FINDINGS DETAIL */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '24px' }}>Detailed Findings</h2>
        
        {findings.length === 0 ? (
          <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No vulnerabilities detected in this repository.</p>
        ) : (
          findings.map((finding: any, idx: number) => (
            <div key={idx} style={{ 
              marginBottom: '24px', 
              border: `1px solid ${finding.severity === 'CRITICAL' ? '#fca5a5' : (finding.severity === 'HIGH' ? '#fcd34d' : '#fdba74')}`,
              borderRadius: '8px',
              overflow: 'hidden',
              pageBreakInside: 'avoid'
            }}>
              {/* Finding Header */}
              <div style={{ 
                backgroundColor: finding.severity === 'CRITICAL' ? '#fef2f2' : (finding.severity === 'HIGH' ? '#fffbeb' : '#fff7ed'),
                padding: '12px 16px',
                borderBottom: `1px solid ${finding.severity === 'CRITICAL' ? '#fca5a5' : (finding.severity === 'HIGH' ? '#fcd34d' : '#fdba74')}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    display: 'inline-block',
                    textAlign: 'center',
                    fontSize: '11px', 
                    lineHeight: '26px', // Matches height exactly for perfect vertical center
                    height: '26px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    minWidth: '80px',
                    padding: '0 12px', 
                    borderRadius: '4px',
                    backgroundColor: finding.severity === 'CRITICAL' ? '#dc2626' : (finding.severity === 'HIGH' ? '#d97706' : '#ea580c'),
                    color: '#ffffff',
                    fontFamily: 'Helvetica, Arial, sans-serif'
                  }}>
                    {finding.severity}
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    {finding.type || 'Security Issue'}
                  </span>
                </div>
                <span style={{ fontSize: '14px', color: '#6b7280', fontFamily: 'monospace' }}>{finding.file} : L{finding.line}</span>
              </div>
              
              {/* Finding Body */}
              <div style={{ padding: '16px', backgroundColor: '#ffffff' }}>
                <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#374151', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                  {finding.description ? finding.description : `Vulnerability detected: ${finding.type}`}
                </p>
                
                <div style={{ backgroundColor: '#1f2937', borderRadius: '6px', padding: '12px', overflowX: 'hidden' }}>
                  <pre style={{ margin: 0, fontSize: '12px', color: '#e5e7eb', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {(() => {
                      const text = String(finding.snippet || finding.match || 'No code snippet available.');
                      return text.substring(0, 500) + (text.length > 500 ? '...' : '');
                    })()}
                  </pre>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* FOOTER */}
      <div style={{ marginTop: '40px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', textAlign: 'center', color: '#9ca3af', fontSize: '12px' }}>
        RepoGuard Automated Security Scan • Confidential Document
      </div>
    </div>
  );
}
