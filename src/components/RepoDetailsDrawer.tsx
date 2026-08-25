import { useState, useEffect } from 'react';
import { X, ShieldAlert, Code, ExternalLink, GitBranch, Download, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import PdfReportTemplate from './PdfReportTemplate';
import { useAuth } from '../contexts/AuthContext';

export default function RepoDetailsDrawer({ repo, onClose }: { repo: any, onClose: () => void }) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [aiReviews, setAiReviews] = useState<Record<number, any>>({});
  const [aiLoading, setAiLoading] = useState<Record<number, boolean>>({});
  const [prLoading, setPrLoading] = useState<Record<number, boolean>>({});
  const [prSuccess, setPrSuccess] = useState<Record<number, string>>({});
  const [jiraLoading, setJiraLoading] = useState<Record<number, boolean>>({});
  const [jiraSuccess, setJiraSuccess] = useState<Record<number, string>>({});
  const [showIgnored, setShowIgnored] = useState(false);
  const { token } = useAuth();
  
  // We need local state for findings to reflect ignored status instantly
  const [localFindings, setLocalFindings] = useState<any[]>([]);

  useEffect(() => {
    if (repo?.findings?.detail) {
      setLocalFindings(repo.findings.detail);
    }
  }, [repo]);

  if (!repo) return null;

  const handleCreatePR = async (idx: number, finding: any) => {
    setPrLoading(prev => ({ ...prev, [idx]: true }));
    try {
      const response = await fetch('/api/remediate/pr', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          finding: finding,
          repo_url: repo.url
        })
      });
      const data = await response.json();
      
      if (response.ok) {
        setPrSuccess(prev => ({ ...prev, [findingIdx]: data.url }));
      } else {
        alert(data.detail || "Failed to create PR.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to create PR: " + err.message);
    } finally {
      setPrLoading(prev => ({ ...prev, [findingIdx]: false }));
    }
  };

  const handleCreateJira = async (findingIdx: number, finding: any) => {
    setJiraLoading(prev => ({ ...prev, [findingIdx]: true }));
    try {
      const res = await fetch('/api/remediate/jira', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          repo_url: repo.url,
          finding: finding
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to create Jira Issue');
      }
      const data = await res.json();
      setJiraSuccess(prev => ({ ...prev, [findingIdx]: data.url }));
    } catch (err: any) {
      console.error(err);
      alert("Failed to create Jira Issue: " + err.message);
    } finally {
      setJiraLoading(prev => ({ ...prev, [findingIdx]: false }));
    }
  };

  const handleAiReview = async (idx: number, finding: any) => {
    const codeSnippet = finding.snippet || finding.match;
    if (!codeSnippet) return;

    setAiLoading(prev => ({ ...prev, [idx]: true }));
    try {
      const response = await fetch('/api/ai-review', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: codeSnippet })
      });
      const data = await response.json();
      
      if (data && data.vulns && data.vulns.length > 0) {
        setAiReviews(prev => ({ ...prev, [idx]: data.vulns[0] }));
      } else {
        setAiReviews(prev => ({ ...prev, [idx]: { error: "AI could not definitively identify a vulnerability in this snippet." } }));
      }
    } catch (error) {
      console.error("AI Review failed:", error);
      setAiReviews(prev => ({ ...prev, [idx]: { error: true } }));
    } finally {
      setAiLoading(prev => ({ ...prev, [idx]: false }));
    }
  };

  const handleIgnore = async (idx: number, finding: any, reason: string) => {
    try {
      const response = await fetch(`/api/repos/${repo.id}/findings/ignore`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ findingHash: finding.hash, reason })
      });
      if (response.ok) {
        setLocalFindings(prev => prev.map((f, i) => i === idx ? { ...f, isIgnored: true } : f));
      }
    } catch (e) {
      console.error("Failed to ignore finding", e);
    }
  };

  const handleUnignore = async (idx: number, finding: any) => {
    try {
      const response = await fetch(`/api/repos/${repo.id}/findings/unignore`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ findingHash: finding.hash, reason: "unignore" })
      });
      if (response.ok) {
        setLocalFindings(prev => prev.map((f, i) => i === idx ? { ...f, isIgnored: false } : f));
      }
    } catch (e) {
      console.error("Failed to unignore finding", e);
    }
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('hidden-pdf-template');
    if (!element) return;
    
    setIsGeneratingPdf(true);
    try {
      // @ts-ignore
      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
        margin:       0,
        filename:     `RepoGuard-Report-${repo.name}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-background/50 z-[100] backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[600px] max-w-[100vw] bg-surface-container-highest border-l border-outline-variant/30 shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out flex flex-col translate-x-0 overflow-y-auto`}>
        
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="font-title-md font-bold text-on-surface text-xl">{repo.name}</h2>
            <div className="flex items-center gap-3 mt-2 text-sm text-on-surface-variant">
              <span className="flex items-center gap-1"><GitBranch size={14} /> main</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Code size={14} /> {repo.lang}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3 py-1.5 flex items-center gap-2 bg-primary-container text-white rounded text-sm hover:bg-primary-container/90 transition-colors disabled:opacity-50"
              title="Download PDF Report"
            >
              {isGeneratingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              <span className="hidden sm:inline">{isGeneratingPdf ? 'Generating...' : 'PDF Report'}</span>
            </button>
            <button onClick={onClose} className="p-2 rounded-full text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors cursor-pointer">
              <X size={24} />
            </button>
          </div>
        </div>
        
        {/* HIDDEN PDF TEMPLATE CONTAINER */}
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, zIndex: -1 }}>
          <div id="hidden-pdf-template">
            <PdfReportTemplate repo={repo} />
          </div>
        </div>

        <div id="pdf-report-content" className="p-6 flex flex-col gap-8 bg-surface-container-highest">
          {/* Overview Score */}
          <div className="flex items-center gap-6 p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-surface-variant" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                <path className={`text-${repo.scoreColor} score-circle`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${repo.score}, 100`} strokeLinecap="round" strokeWidth="3"></path>
              </svg>
              <span className={`absolute text-3xl font-bold text-${repo.scoreColor}`}>{repo.score}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-on-surface mb-1">Security Posture</h3>
              <p className="text-sm text-on-surface-variant mb-4">This repository is currently in a {repo.status} state. Action is required to remediate open findings.</p>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-outline uppercase font-label-caps mb-1">Critical</span>
                  <span className="text-xl font-bold text-critical">{repo.findings.crit || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-outline uppercase font-label-caps mb-1">High</span>
                  <span className="text-xl font-bold text-warning">{repo.findings.high || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-outline uppercase font-label-caps mb-1">Secrets</span>
                  <span className="text-xl font-bold text-orange-400">{repo.findings.secrets || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Finding Details */}
          <div>
            <h3 className="font-title-md font-semibold text-on-surface mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldAlert className="text-critical" size={20} />
                Findings
              </span>
              <button 
                onClick={() => setShowIgnored(!showIgnored)}
                className="text-sm font-medium text-primary hover:underline"
              >
                {showIgnored ? "Hide Ignored" : "Show Ignored"}
              </button>
            </h3>
            
            <div className="space-y-4">
              {localFindings && localFindings.length > 0 ? (
                localFindings.map((finding: any, idx: number) => {
                  if (finding.isIgnored && !showIgnored) return null;
                  
                  return (
                  <div key={idx} className={`rounded-xl border ${finding.isIgnored ? 'border-outline-variant/30 bg-surface-container/50 opacity-60' : finding.type === 'SECRET' ? 'border-warning/30 bg-warning-subtle/5' : finding.severity === 'CRITICAL' ? 'border-critical/30 bg-critical-subtle/5' : 'border-warning/30 bg-warning-subtle/5'} overflow-hidden transition-all duration-300`}>
                    <div className={`p-4 border-b ${finding.isIgnored ? 'border-outline-variant/20 bg-surface-container' : finding.type === 'SECRET' ? 'border-warning/20 bg-warning/5' : finding.severity === 'CRITICAL' ? 'border-critical/20 bg-critical/5' : 'border-warning/20 bg-warning/5'} flex justify-between items-start`}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`${finding.type === 'SECRET' ? 'bg-orange-500 text-background' : finding.severity === 'CRITICAL' ? 'bg-critical text-background' : 'bg-warning text-background'} text-[10px] uppercase font-bold px-1.5 py-0.5 rounded`}>
                            {finding.type === 'SECRET' ? 'Secret' : finding.severity}
                          </span>
                          <span className={`font-code-sm text-sm ${finding.type === 'SECRET' ? 'text-orange-400' : finding.severity === 'CRITICAL' ? 'text-critical' : 'text-warning'} font-semibold`}>
                            {finding.description}
                          </span>
                        </div>
                        <h4 className="font-medium text-on-surface">{finding.isIgnored ? "Ignored Finding" : "Security Issue Detected"}</h4>
                      </div>
                      {finding.isIgnored ? (
                        <button onClick={() => handleUnignore(idx, finding)} className="text-xs text-primary hover:underline font-medium">Unignore</button>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => handleIgnore(idx, finding, 'accept_risk')} className="text-xs border border-outline-variant/50 hover:bg-surface-variant px-2 py-1 rounded text-on-surface-variant font-medium transition-colors">Accept Risk</button>
                          <button onClick={() => handleIgnore(idx, finding, 'false_positive')} className="text-xs border border-outline-variant/50 hover:bg-surface-variant px-2 py-1 rounded text-on-surface-variant font-medium transition-colors">False Positive</button>
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-surface-container-lowest flex flex-col gap-4">
                      <div className="rounded-md overflow-hidden border border-outline-variant/30 font-code-sm text-xs">
                        <div className="bg-surface-variant px-3 py-1 text-on-surface-variant border-b border-outline-variant/30 flex justify-between">
                          <span>{finding.file}</span>
                          <span>Line {finding.line}</span>
                        </div>
                        <div className="p-3 bg-surface-container-lowest overflow-x-auto text-on-surface whitespace-pre">
                          <div className={`${finding.type === 'SECRET' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : finding.severity === 'CRITICAL' ? 'bg-critical/20 border-critical text-critical' : 'bg-warning/20 border-warning text-warning'} -mx-3 px-3 py-0.5 border-l-2`}>
                            {finding.line}: {finding.snippet || finding.match}
                          </div>
                        </div>
                      </div>

                      {/* AI Review Section */}
                      {!finding.isIgnored && (
                        <div className="mt-2">
                          {!aiReviews[idx] && !aiLoading[idx] && (
                            <div className="flex gap-2">
                            <button 
                              onClick={() => handleAiReview(idx, finding)}
                              className="flex items-center gap-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors font-medium border border-primary/20"
                            >
                              <Sparkles size={16} /> Analyze with Gemini AI
                            </button>
                            {prSuccess[idx] ? (
                                  <a href={prSuccess[idx]} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm bg-surface-variant text-on-surface px-4 py-2 rounded-lg font-medium">
                                    <div className="i-lucide-external-link" style={{width: 16, height: 16}}></div> View PR
                                  </a>
                                ) : (
                                  <button
                                    onClick={() => handleCreatePR(idx, finding)}
                                    disabled={prLoading[idx]}
                                    className="flex items-center gap-2 text-sm bg-[#2ea043] hover:bg-[#2c974b] text-white px-4 py-2 rounded-lg transition-colors font-medium border border-transparent disabled:opacity-50"
                                  >
                                    {prLoading[idx] ? (
                                      <><Loader2 size={16} className="animate-spin" /> Generating Fix...</>
                                    ) : (
                                      <><div className="i-lucide-github" style={{width: 16, height: 16}}></div> 1-Click Auto-Fix PR</>
                                    )}
                                  </button>
                                )}
                                
                                {jiraSuccess[idx] ? (
                                  <a href={jiraSuccess[idx]} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm bg-[#0052CC]/10 text-[#0052CC] px-4 py-2 rounded-lg font-medium">
                                    <div className="i-lucide-external-link" style={{width: 16, height: 16}}></div> View Ticket
                                  </a>
                                ) : (
                                  <button
                                    onClick={() => handleCreateJira(idx, finding)}
                                    disabled={jiraLoading[idx]}
                                    className="flex items-center gap-2 text-sm bg-surface-variant text-on-surface hover:bg-surface-variant/80 px-4 py-2 rounded-lg transition-colors font-medium border border-transparent disabled:opacity-50"
                                  >
                                    {jiraLoading[idx] ? (
                                      <><Loader2 size={16} className="animate-spin" /> Creating...</>
                                    ) : (
                                      <><span className="font-bold">J</span> Create Jira Issue</>
                                    )}
                                  </button>
                                )}
                          </div>
                        )}
                        
                        {prSuccess[idx] && (
                          <div className="flex items-center gap-2 text-success text-sm font-medium p-3 bg-success/10 border border-success/20 rounded-lg mt-2">
                            <CheckCircle2 size={16} />
                            Pull Request created successfully!
                          </div>
                        )}
                        {jiraSuccess[idx] && (
                          <div className="flex items-center gap-2 text-[#0052CC] text-sm font-medium p-3 bg-[#0052CC]/10 border border-[#0052CC]/20 rounded-lg mt-2">
                            <CheckCircle2 size={16} />
                            Jira Issue created successfully!
                          </div>
                        )}

                        {aiLoading[idx] && (
                          <div className="flex items-center gap-3 text-primary text-sm p-3 bg-primary/5 rounded-lg border border-primary/10">
                            <Loader2 size={16} className="animate-spin" />
                            <span>Gemini is analyzing this code snippet...</span>
                          </div>
                        )}

                        {aiReviews[idx] && !aiReviews[idx].error && (
                          <div className="bg-surface-variant/30 border border-primary/30 rounded-xl overflow-hidden mt-2">
                            <div className="bg-primary/10 px-4 py-2.5 border-b border-primary/20 flex items-center gap-2 text-primary font-medium text-sm">
                              <Sparkles size={16} /> Gemini AI Insights
                            </div>
                            <div className="p-4 space-y-4">
                              <div>
                                <h5 className="text-xs text-outline uppercase font-bold tracking-wider mb-1">Vulnerability Analysis</h5>
                                <p className="text-sm text-on-surface-variant">{aiReviews[idx].description}</p>
                              </div>
                              <div>
                                <h5 className="text-xs text-outline uppercase font-bold tracking-wider mb-1">Recommendation</h5>
                                <p className="text-sm text-on-surface-variant flex items-start gap-2">
                                  <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                                  <span>{aiReviews[idx].recommendation}</span>
                                </p>
                              </div>
                              
                              {aiReviews[idx].fixedCode && (
                                <div className="mt-4">
                                  <h5 className="text-xs text-outline uppercase font-bold tracking-wider mb-2">Suggested Fix</h5>
                                  <div className="rounded-md border border-outline-variant/30 bg-[#0d1117] overflow-x-auto p-3">
                                    <pre className="text-[13px] text-green-400 font-code-sm m-0">
                                      {aiReviews[idx].fixedCode}
                                    </pre>
                                  </div>
                                </div>
                              )}
                              
                              <div className="mt-4 pt-4 border-t border-primary/20 flex items-center justify-end">
                                {!prSuccess[idx] && (
                                  <button
                                    onClick={() => handleCreatePR(idx, finding)}
                                    disabled={prLoading[idx]}
                                    className="flex items-center gap-2 text-sm bg-[#2ea043] hover:bg-[#2c974b] text-white px-4 py-2 rounded-lg transition-colors font-medium border border-transparent disabled:opacity-50"
                                  >
                                    {prLoading[idx] ? (
                                      <><Loader2 size={16} className="animate-spin" /> Generating Fix...</>
                                    ) : (
                                      <><div className="i-lucide-github" style={{width: 16, height: 16}}></div> 1-Click Auto-Fix PR</>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {aiReviews[idx] && aiReviews[idx].error && (
                          <div className="text-sm text-warning p-3 bg-warning-subtle/10 border border-warning/20 rounded-lg">
                            {aiReviews[idx].error}
                          </div>
                        )}
                      </div>
                      )}
                    </div>
                  </div>
                )})
              ) : (
                <div className="text-on-surface-variant text-sm p-4 text-center border border-outline-variant/30 rounded-xl border-dashed">
                  No critical findings or secrets detected in this scan.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
