import { X, ShieldAlert, Code, ExternalLink, GitBranch } from 'lucide-react';

export default function RepoDetailsDrawer({ repo, onClose }: { repo: any, onClose: () => void }) {
  if (!repo) return null;

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
          <button onClick={onClose} className="p-2 rounded-full text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-8">
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
            <h3 className="font-title-md font-semibold text-on-surface mb-4 flex items-center gap-2">
              <ShieldAlert className="text-critical" size={20} />
              Critical Findings
            </h3>
            
            <div className="space-y-4">
              {repo.findings.detail && repo.findings.detail.length > 0 ? (
                repo.findings.detail.map((finding: any, idx: number) => (
                  <div key={idx} className={`rounded-xl border ${finding.type === 'SECRET' ? 'border-warning/30 bg-warning-subtle/5' : finding.severity === 'CRITICAL' ? 'border-critical/30 bg-critical-subtle/5' : 'border-warning/30 bg-warning-subtle/5'} overflow-hidden`}>
                    <div className={`p-4 border-b ${finding.type === 'SECRET' ? 'border-warning/20 bg-warning/5' : finding.severity === 'CRITICAL' ? 'border-critical/20 bg-critical/5' : 'border-warning/20 bg-warning/5'} flex justify-between items-start`}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`${finding.type === 'SECRET' ? 'bg-orange-500 text-background' : finding.severity === 'CRITICAL' ? 'bg-critical text-background' : 'bg-warning text-background'} text-[10px] uppercase font-bold px-1.5 py-0.5 rounded`}>
                            {finding.type === 'SECRET' ? 'Secret' : finding.severity}
                          </span>
                          <span className={`font-code-sm text-sm ${finding.type === 'SECRET' ? 'text-orange-400' : finding.severity === 'CRITICAL' ? 'text-critical' : 'text-warning'} font-semibold`}>
                            {finding.description}
                          </span>
                        </div>
                        <h4 className="font-medium text-on-surface">Security Issue Detected</h4>
                      </div>
                    </div>
                    <div className="p-4 bg-surface-container-lowest">
                      <div className="rounded-md overflow-hidden border border-outline-variant/30 font-code-sm text-xs">
                        <div className="bg-surface-variant px-3 py-1 text-on-surface-variant border-b border-outline-variant/30 flex justify-between">
                          <span>{finding.file}</span>
                          <span>Line {finding.line}</span>
                        </div>
                        <div className="p-3 bg-surface-container-lowest overflow-x-auto text-on-surface whitespace-pre">
                          <div className={`${finding.type === 'SECRET' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : finding.severity === 'CRITICAL' ? 'bg-critical/20 border-critical text-critical' : 'bg-warning/20 border-warning text-warning'} -mx-3 px-3 py-0.5 border-l-2`}>
                            {finding.line}: {finding.snippet}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
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
