import { useState, useEffect, useRef } from 'react';
import { Package, Link as LinkIcon, Lock, Unlock, Network, Brain, History, Check, Info, Rocket, FolderCode, CheckCircle2, XCircle, Terminal } from 'lucide-react';
import { View } from '../types';

export default function NewScan({ setView }: { setView?: (view: View) => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [repoUrl, setRepoUrl] = useState('');
  const [scanModules, setScanModules] = useState({
    secret: true,
    dependency: true,
    history: false,
    ai: true
  });
  const logsEndRef = useRef<HTMLDivElement>(null);
  
  const totalSteps = 3;

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scanLogs]);

  useEffect(() => {
    if (!isScanning) return;
    
    // Clear previous logs
    setScanLogs([]);
    setScanProgress(5); // Initial progress
    
    let url = repoUrl;
    if (!url) {
       // fallback for the mock connected repos
       url = 'https://github.com/expressjs/express.git';
    }

    let eventSource: EventSource | null = null;

    const startScan = async () => {
      try {
        // 1. Create Repo in DB so it shows up in dashboard
        const res = await fetch('/api/repos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
        const repo = await res.json();
        
        // 2. Start stream and pass repoId to save scan results
        const sseUrl = `/api/scans/stream?url=${encodeURIComponent(url)}&ai=${scanModules.ai}&secret=${scanModules.secret}&dep=${scanModules.dependency}&repoId=${repo.id}`;
        eventSource = new EventSource(sseUrl);

        eventSource.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data.type === 'log') {
              setScanLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}] > ${data.message}`]);
              setScanProgress(prev => Math.min(prev + 5, 95)); // Fake progress until done
            } else if (data.type === 'done') {
              setScanProgress(100);
              setScanLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}] > Scan finished. Found ${data.findings.length} issues.`]);
              eventSource?.close();
            } else if (data.type === 'error') {
              setScanProgress(100);
              setScanLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}] > [FATAL ERROR] ${data.message}`]);
              eventSource?.close();
            }
          } catch (err) {
            console.error('SSE parsing error', err);
          }
        };

        eventSource.onerror = (err) => {
          console.error('EventSource failed:', err);
          eventSource?.close();
          setScanProgress(100);
        };
      } catch (err) {
        console.error('Failed to initiate scan', err);
        setScanLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}] > [FATAL ERROR] Failed to connect to server.`]);
        setScanProgress(100);
      }
    };

    startScan();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [isScanning, repoUrl]);

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const goToStep = (step: number) => {
    if (step <= currentStep || step === currentStep + 1) setCurrentStep(step);
  };

  const progressWidth = currentStep === 1 ? '15%' : currentStep === 2 ? '50%' : '100%';

  return (
    <div className="pt-24 pb-12 px-container-padding-mobile md:px-container-padding-desktop w-full flex flex-col min-h-screen">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
        
        <div className="mb-8 mt-2">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-semibold text-on-surface mb-2">Initiate Security Scan</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Configure and launch a comprehensive security analysis for your codebase.</p>
        </div>

        <div className="mb-10 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-highest -translate-y-1/2 z-0"></div>
          <div className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-300" style={{ width: progressWidth }}></div>
          <ul className="relative z-10 flex justify-between w-full">
            {[
              { id: 1, label: 'Select Target' },
              { id: 2, label: 'Configure' },
              { id: 3, label: 'Review' }
            ].map(step => {
              const isCompleted = step.id < currentStep;
              const isActive = step.id === currentStep;
              
              return (
                <li key={step.id} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => goToStep(step.id)}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-title-md transition-colors border-4 border-background shadow-[0_0_0_2px_rgba(255,255,255,0.1)] ${isCompleted || isActive ? 'bg-primary text-background' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                    {isCompleted ? <Check size={16} /> : step.id}
                  </div>
                  <span className={`font-label-caps text-label-caps uppercase ${isCompleted || isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="glass-panel rounded-xl p-6 md:p-8 flex-1 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          {!isScanning ? (
            <>
              {currentStep === 1 && (
                <div className="flex-1 flex flex-col animate-fade-in-up">
                  <h3 className="font-title-md text-title-md font-medium text-on-surface mb-6">Select Repository to Scan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    
                    <div className="surface-1 rounded-lg p-5 hover:border-primary/50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3 mb-4">
                        <Package className="text-secondary" size={24} />
                        <h4 className="font-body-lg font-medium">Connected Repositories</h4>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Choose from repositories already linked to your RepoGuard workspace.</p>
                      <div className="space-y-2">
                        <label className="flex items-center p-3 rounded bg-surface-container-lowest border border-outline-variant/20 cursor-pointer hover:bg-surface-variant/30">
                          <input className="form-radio text-primary bg-transparent border-outline-variant mr-3 focus:ring-primary focus:ring-offset-0" name="repo_select" type="radio" onChange={() => setRepoUrl('https://github.com/OWASP/NodeGoat.git')} />
                          <div className="flex-1">
                            <div className="font-code-sm text-code-sm font-medium">OWASP/NodeGoat</div>
                            <div className="text-[11px] text-on-surface-variant">Intentionally vulnerable app</div>
                          </div>
                          <Lock className="text-outline-variant" size={14} />
                        </label>
                        <label className="flex items-center p-3 rounded bg-surface-container-lowest border border-outline-variant/20 cursor-pointer hover:bg-surface-variant/30">
                          <input className="form-radio text-primary bg-transparent border-outline-variant mr-3 focus:ring-primary focus:ring-offset-0" name="repo_select" type="radio" onChange={() => setRepoUrl('https://github.com/expressjs/express.git')} />
                          <div className="flex-1">
                            <div className="font-code-sm text-code-sm font-medium">expressjs/express</div>
                            <div className="text-[11px] text-on-surface-variant">Popular web framework</div>
                          </div>
                          <Lock className="text-outline-variant" size={14} />
                        </label>
                      </div>
                    </div>

                    <div className="surface-1 rounded-lg p-5 hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <LinkIcon className="text-secondary" size={24} />
                        <h4 className="font-body-lg font-medium">External URL</h4>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Provide a direct Git URL. Public repositories or pre-authenticated URLs only.</p>
                      <div className="mt-auto">
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Git Repository URL</label>
                        <input 
                          className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded p-3 font-code-sm text-code-sm text-on-surface input-glow focus:outline-none" 
                          placeholder="https://github.com/OWASP/NodeGoat.git" 
                          type="text" 
                          value={repoUrl}
                          onChange={(e) => setRepoUrl(e.target.value)}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex-1 flex flex-col animate-fade-in-up">
                  <h3 className="font-title-md text-title-md font-medium text-on-surface mb-2">Configure Scan Modules</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Select the security analysis engines to run on the target repository.</p>
                  
                  <div className="space-y-4">
                    <div className="surface-1 rounded-lg p-4 flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded bg-primary-container/20 flex items-center justify-center text-primary mt-1">
                          <Unlock size={20} />
                        </div>
                        <div>
                          <h4 className="font-body-lg font-medium text-on-surface">Secret Scanner</h4>
                          <p className="font-body-sm text-on-surface-variant mt-1">Detect hardcoded passwords, API keys, and tokens across the codebase.</p>
                        </div>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in mt-2">
                        <input type="checkbox" name="toggle" id="toggle-secret" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-on-surface border-4 appearance-none cursor-pointer border-surface-variant z-10" checked={scanModules.secret} onChange={(e) => setScanModules({...scanModules, secret: e.target.checked})} />
                        <label htmlFor="toggle-secret" className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-variant cursor-pointer"></label>
                      </div>
                    </div>

                    <div className="surface-1 rounded-lg p-4 flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded bg-secondary-container/20 flex items-center justify-center text-secondary mt-1">
                          <Network size={20} />
                        </div>
                        <div>
                          <h4 className="font-body-lg font-medium text-on-surface">Dependency Scanner</h4>
                          <p className="font-body-sm text-on-surface-variant mt-1">Identify known vulnerabilities (CVEs) in open-source dependencies (SCA).</p>
                        </div>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in mt-2">
                        <input type="checkbox" name="toggle" id="toggle-dep" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-on-surface border-4 appearance-none cursor-pointer border-surface-variant z-10" checked={scanModules.dependency} onChange={(e) => setScanModules({...scanModules, dependency: e.target.checked})} />
                        <label htmlFor="toggle-dep" className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-variant cursor-pointer"></label>
                      </div>
                    </div>

                    <div className="surface-1 rounded-lg p-4 flex items-start justify-between opacity-80">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded bg-tertiary-container/20 flex items-center justify-center text-tertiary mt-1">
                          <History size={20} />
                        </div>
                        <div>
                          <h4 className="font-body-lg font-medium text-on-surface">Deep Git History</h4>
                          <p className="font-body-sm text-on-surface-variant mt-1">Scan entire commit history for leaked secrets (Increases scan time significantly).</p>
                        </div>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in mt-2">
                        <input type="checkbox" name="toggle" id="toggle-history" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-on-surface border-4 appearance-none cursor-pointer border-surface-variant z-10" checked={scanModules.history} onChange={(e) => setScanModules({...scanModules, history: e.target.checked})} />
                        <label htmlFor="toggle-history" className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-variant cursor-pointer"></label>
                      </div>
                    </div>

                    <div className="surface-1 rounded-lg p-4 flex items-start justify-between border-l-2 border-primary">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded bg-primary-container/20 flex items-center justify-center text-primary mt-1">
                          <Brain size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-body-lg font-medium text-on-surface">AI Security Review</h4>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase tracking-wider">Pro</span>
                          </div>
                          <p className="font-body-sm text-on-surface-variant mt-1">Utilize LLMs to detect complex logic flaws and zero-day patterns.</p>
                        </div>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in mt-2">
                        <input type="checkbox" name="toggle" id="toggle-ai" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-on-surface border-4 appearance-none cursor-pointer border-surface-variant z-10" checked={scanModules.ai} onChange={(e) => setScanModules({...scanModules, ai: e.target.checked})} />
                        <label htmlFor="toggle-ai" className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-variant cursor-pointer"></label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex-1 flex flex-col animate-fade-in-up">
                  <h3 className="font-title-md text-title-md font-medium text-on-surface mb-6">Review Configuration</h3>
                  <div className="surface-1 rounded-lg p-6 mb-8 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase">Target Information</h4>
                        <div className="bg-surface-container-lowest/50 rounded p-4 border border-outline-variant/20 mb-6">
                          <div className="flex items-center gap-3">
                            <FolderCode className="text-outline" size={24} />
                            <div className="overflow-hidden">
                              <div className="font-code-sm text-on-surface truncate" title={repoUrl || 'Default (OWASP/NodeGoat)'}>
                                {repoUrl ? repoUrl.replace('https://github.com/', '').replace('.git', '') : 'OWASP/NodeGoat'}
                              </div>
                              <div className="text-xs text-on-surface-variant mt-1">Branch: <span className="font-code-sm">HEAD</span></div>
                            </div>
                          </div>
                        </div>
                        
                        <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase">Scan Profile</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-full bg-surface-variant text-body-sm text-on-surface border border-outline-variant/30 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-secondary"></div> High Sensitivity
                          </span>
                          <span className="px-3 py-1 rounded-full bg-surface-variant text-body-sm text-on-surface border border-outline-variant/30">
                            Default Ignore Rules
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase">Enabled Modules</h4>
                        <ul className="space-y-3">
                          <li className={`flex items-center gap-3 text-body-sm ${!scanModules.secret && 'text-on-surface-variant'}`}>
                            {scanModules.secret ? <CheckCircle2 className="text-primary" size={16} /> : <XCircle className="text-outline-variant" size={16} />}
                            Secret Scanner
                          </li>
                          <li className={`flex items-center gap-3 text-body-sm ${!scanModules.dependency && 'text-on-surface-variant'}`}>
                            {scanModules.dependency ? <CheckCircle2 className="text-primary" size={16} /> : <XCircle className="text-outline-variant" size={16} />}
                            Dependency Scanner (SCA)
                          </li>
                          <li className={`flex items-center gap-3 text-body-sm ${!scanModules.history && 'text-on-surface-variant'}`}>
                            {scanModules.history ? <CheckCircle2 className="text-primary" size={16} /> : <XCircle className="text-outline-variant" size={16} />}
                            Deep Git History
                          </li>
                          <li className={`flex items-center gap-3 text-body-sm ${!scanModules.ai && 'text-on-surface-variant'}`}>
                            {scanModules.ai ? <CheckCircle2 className="text-primary" size={16} /> : <XCircle className="text-outline-variant" size={16} />}
                            AI Security Review
                          </li>
                        </ul>
                        
                        <div className="mt-6 p-4 rounded bg-primary-container/10 border border-primary/20">
                          <div className="flex items-start gap-3">
                            <Info className="text-primary mt-0.5" size={20} />
                            <p className="font-body-sm text-on-surface-variant text-sm">Estimated scan time based on repository size and selected modules is <span className="text-on-surface font-medium">approx. 2-3 minutes</span>.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-auto pt-6 border-t border-outline-variant/20 flex justify-between items-center">
                <button 
                  className={`px-6 py-2 rounded-lg font-title-md text-title-md text-on-surface-variant border border-outline-variant/30 hover:bg-surface-variant/50 transition-colors ${currentStep === 1 ? 'invisible' : ''}`}
                  onClick={prevStep}
                >
                  Back
                </button>
                
                {currentStep < 3 ? (
                  <button 
                    className="px-6 py-2 rounded-lg font-title-md text-title-md bg-primary-container text-white hover:bg-primary-container/90 transition-colors cursor-pointer"
                    onClick={nextStep}
                  >
                    Continue
                  </button>
                ) : (
                  <button className="px-8 py-3 rounded-lg font-title-md text-title-md bg-primary-container text-white hover:bg-primary-container/90 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2 cursor-pointer" onClick={() => setIsScanning(true)}>
                    <Rocket size={20} />
                    Launch Security Scan
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col animate-fade-in-up h-full">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="font-title-md text-title-md font-medium text-on-surface flex items-center gap-2">
                    <Terminal size={20} className="text-primary" />
                    Live Scan Progress
                 </h3>
                 <span className="font-code-sm text-primary">{Math.round(scanProgress)}%</span>
              </div>
              
              <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden mb-6">
                <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${scanProgress}%` }}></div>
              </div>

              <div className="flex-1 code-block rounded-lg p-4 font-code-sm text-sm overflow-y-auto min-h-[300px] flex flex-col gap-2 shadow-inner">
                {scanLogs.map((log, i) => (
                  <div key={i} className={`
                    ${log.includes('[WARN]') ? 'text-warning' : ''}
                    ${log.includes('[ALERT]') ? 'text-critical' : ''}
                    ${!log.includes('[WARN]') && !log.includes('[ALERT]') ? 'text-on-surface-variant' : ''}
                  `}>
                    {log}
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
              
              {scanProgress >= 100 && (
                <div className="mt-6 flex justify-end animate-fade-in-up">
                  <button 
                    className="px-6 py-2 rounded-lg font-title-md text-title-md bg-primary-container text-white hover:bg-primary-container/90 transition-colors cursor-pointer" 
                    onClick={() => {
                      if (setView) {
                        setView('repositories');
                      } else {
                        window.location.reload();
                      }
                    }}
                  >
                    View Report
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
