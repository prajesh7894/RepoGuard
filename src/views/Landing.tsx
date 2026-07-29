import { PlayCircle, ArrowRight, Brain, Lock, Key, Network, ShieldCheck, Gavel } from 'lucide-react';
import { View } from '../types';
import ShaderBackground from '../components/ShaderBackground';

interface LandingProps {
  setView: (view: View) => void;
}

export default function Landing({ setView }: LandingProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-6 w-full z-50 flex justify-center px-4">
        <header className="w-full max-w-4xl h-[56px] rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="font-display-lg text-title-md text-primary tracking-tight font-bold">RepoGuard</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => setView('product')} className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Product</button>
            <button onClick={() => setView('solutions')} className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Solutions</button>
            <button onClick={() => setView('pricing')} className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Pricing</button>
            <button onClick={() => setView('docs')} className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Docs</button>
          </nav>
          <div className="flex items-center gap-4">
            <a className="hidden md:block font-body-sm text-body-sm text-on-surface hover:text-primary transition-colors" href="#">Login</a>
            <button 
                onClick={() => setView('login')}
                className="bg-primary-container text-white px-4 py-1.5 rounded-full font-body-sm text-body-sm hover:bg-primary-container/90 transition-all shadow-lg shadow-primary-container/20 cursor-pointer"
            >
              Start Scanning
            </button>
          </div>
        </header>
      </div>

      <main className="flex-grow pt-16">
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full opacity-60">
                <ShaderBackground />
            </div>
          </div>
          <div className="hero-glow"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-container-padding-desktop w-full grid lg:grid-cols-2 gap-12 items-center py-20">
            <div className="flex flex-col gap-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 w-fit">
                <Brain className="text-secondary" size={16} />
                <span className="font-label-caps text-label-caps text-primary tracking-wider uppercase">AI-Powered Security</span>
              </div>
              
              <h1 className="font-display-lg text-4xl lg:text-[64px] leading-[1.1] tracking-tight text-white font-bold">
                Scan. Detect. Secure. <br />
                <span className="gradient-text">Your Repositories Protected by AI.</span>
              </h1>
              
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Enterprise-grade DevSecOps platform that seamlessly integrates into your workflow. Detect secrets, analyze dependencies, and remediate vulnerabilities before they reach production.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => setView('login')}
                  className="bg-primary-container text-white px-8 py-3.5 rounded-full font-body-lg text-body-lg text-center hover:bg-primary-container/90 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] cursor-pointer"
                >
                  Start Free Trial
                </button>
                <button className="glass-panel text-on-surface px-8 py-3.5 rounded-full font-body-lg text-body-lg text-center hover:bg-white/5 transition-all flex items-center justify-center gap-2 border border-outline-variant/30 cursor-pointer">
                  <PlayCircle size={20} />
                  View Demo
                </button>
              </div>
              
              <div className="flex items-center gap-4 mt-8 text-on-surface-variant font-body-sm text-sm">
                <div className="flex -space-x-2">
                  <img className="w-8 h-8 rounded-full border-2 border-background object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm2_p7IvBiLD4dyruBg8beU14vqDUv0FxjycUutjxEmoU4F3Vzhq3FJFSbi62PprQJU0axiHz-sMKoVZgTK7T-XcQovEstxrVxFE91vFMxOfMEmAUKRohaQvFNa2mxRMWFodLmu31j0cNC2ngPItacKS_Czn5GZNuPoSGl9LfjkgsdPzn7yyod2Bh8HeZdAqKiqT-y-SzAsEoYbMrBSMErfE19HRmRYYzPYJ4WWekKfKt3T3gnNXUz4Zmq1iDDIhJnahWnzuB3_tw" alt="User 1" />
                  <img className="w-8 h-8 rounded-full border-2 border-background object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0POUgbRdVnOnxgceTGovD4fOlrxFQn8JX8G2mgFncgRNY4yMAKJW6MpIX8bZE6I8PTj0-3zW_ty5z4H374ZDwS3bTmpkIc4TOamg429itJtUMzJbDOIcvQP8LvDcupOCyb_kelOc68MdSgMGpDKu_K5zFvxd-ax1yS9Hcc2fti-5Pgonvq1aVIsOgv-Xi56bGJMlSeuR6KvMdDGiJUZiTXlldN0QpuhQ1vQcOPeLrSqilth1HgzdbORkcHe7bTvinqKCiN-3qm1s" alt="User 2" />
                  <img className="w-8 h-8 rounded-full border-2 border-background object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlOdPyHN7jzky2YCX2mRhb2_hQ8NAjgZBJEBQvN79y4ZYRNQJCvs90OSoWEwnqinco8jB6l5AWjtumwJcdWEmiNU4cTdYMoEz_ofDiK6az6XCZe0wzPJvdPm-1FjpWnd5iFWaI-aEXv-Tvw00Wj7o0XGSLEJ4iyKzRh84oyZ3kn7v7LzlSvUOAMf7pDIawpA4lzQ0oJT2wyUP_bL1aiJZvdsnVDNC6cOCFxRAFSSGJXRubvmFBDObwLXx6-cRIDcPbdsvS5yrXmOc" alt="User 3" />
                </div>
                <p>Joined by 50,000+ developers</p>
              </div>
            </div>
            
            <div className="relative w-full aspect-square lg:aspect-auto lg:h-[600px] animate-fade-in-up delay-200">
              <div className="absolute inset-0 rounded-2xl border border-outline-variant/20 bg-surface-container-low/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="h-10 border-b border-outline-variant/20 flex items-center px-4 gap-2 bg-surface-container/50">
                  <div className="w-3 h-3 rounded-full bg-error/80"></div>
                  <div className="w-3 h-3 rounded-full bg-secondary-container/80"></div>
                  <div className="w-3 h-3 rounded-full bg-primary/80"></div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col gap-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/10">
                      <div className="text-on-surface-variant text-xs mb-1">Critical Issues</div>
                      <div className="text-error font-display-lg text-2xl font-bold">0</div>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/10">
                      <div className="text-on-surface-variant text-xs mb-1">Repos Scanned</div>
                      <div className="text-primary font-display-lg text-2xl font-bold">142</div>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-outline-variant/10">
                      <div className="text-on-surface-variant text-xs mb-1">Health Score</div>
                      <div className="text-secondary font-display-lg text-2xl font-bold">98%</div>
                    </div>
                  </div>
                  
                  <div className="flex-grow bg-surface rounded-xl border border-outline-variant/10 p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm font-medium text-on-surface">Vulnerability Trend</div>
                      <div className="text-xs text-secondary bg-secondary/10 px-2 py-1 rounded">-12% this week</div>
                    </div>
                    <div className="flex-grow relative">
                      <div className="absolute inset-0 flex flex-col justify-between">
                        <div className="w-full h-px bg-outline-variant/10"></div>
                        <div className="w-full h-px bg-outline-variant/10"></div>
                        <div className="w-full h-px bg-outline-variant/10"></div>
                        <div className="w-full h-px bg-outline-variant/10"></div>
                      </div>
                      <div className="absolute inset-0 flex items-end">
                        <div className="w-full h-32 bg-gradient-to-t from-primary/20 to-transparent relative overflow-hidden">
                          <svg className="absolute bottom-0 w-full h-full text-primary" fill="none" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path d="M0,100 C20,80 40,90 60,40 C80,10 90,30 100,20 L100,100 Z" fill="currentColor" fillOpacity="0.3"></path>
                            <path d="M0,100 C20,80 40,90 60,40 C80,10 90,30 100,20" stroke="currentColor" strokeWidth="2"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-error-container/10 border border-error/20 rounded-lg p-3 flex items-start gap-3">
                    <AlertTriangle className="text-error" size={20} />
                    <div>
                      <div className="text-sm text-error font-medium">Outdated Dependency Detected</div>
                      <div className="text-xs text-on-surface-variant mt-1">lodash v4.17.15 contains known vulnerability (CVE-2020-8203)</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-surface-container border border-outline-variant/30 p-4 rounded-xl shadow-lg animate-fade-in-up delay-300">
                <div className="flex items-center gap-2">
                  <Lock className="text-secondary" size={16} />
                  <span className="text-sm font-medium">API Key Secured</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 border-y border-outline-variant/10 bg-surface-container-lowest/50">
          <div className="max-w-7xl mx-auto px-container-padding-desktop">
            <p className="text-center text-sm font-label-caps text-on-surface-variant uppercase tracking-widest mb-8">Trusted by engineering teams at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="text-xl font-display-lg font-bold flex items-center gap-2"><span className="w-6 h-6 rounded-sm bg-current inline-block"></span> Vercel</div>
              <div className="text-xl font-display-lg font-bold flex items-center gap-2"><span className="w-6 h-6 rounded-full border-4 border-current inline-block"></span> Linear</div>
              <div className="text-xl font-display-lg font-bold flex items-center gap-2"><svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"></path></svg> Supabase</div>
              <div className="text-xl font-display-lg font-bold flex items-center gap-2"><span className="w-6 h-6 rounded-lg bg-gradient-to-br from-current to-transparent inline-block"></span> Stripe</div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-background relative">
          <div className="max-w-7xl mx-auto px-container-padding-desktop">
            <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
              <h2 className="font-display-lg text-3xl md:text-4xl font-bold mb-4">Comprehensive Security Canvas</h2>
              <p className="text-on-surface-variant text-body-lg">Every commit, every dependency, scrutinized by our AI engine to ensure zero vulnerabilities make it to production.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card rounded-2xl p-8 md:col-span-2 flex flex-col justify-between group overflow-hidden relative min-h-[320px] animate-fade-in-up delay-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/20 transition-colors"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                    <Key className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Real-time Secret Scanning</h3>
                  <p className="text-on-surface-variant text-sm max-w-md">Instantly detect hardcoded API keys, tokens, and credentials in every commit. Prevent accidental exposure before the code is even pushed.</p>
                </div>
                <div className="mt-8 code-block p-4 rounded-lg text-xs text-on-surface-variant relative z-10">
                  <div className="text-error mb-1">const AWS_KEY = "AKIAIOSFODNN7EXAMPLE"; <span className="text-error/50"> // ⚠️ Hardcoded secret detected</span></div>
                  <div className="text-primary">const db = new Database(process.env.DB_URL); <span className="text-primary/50"> // ✓ Secure</span></div>
                </div>
              </div>
              
              <div className="glass-card rounded-2xl p-8 flex flex-col group min-h-[320px] relative overflow-hidden animate-fade-in-up delay-200">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 border border-secondary/20">
                  <Brain className="text-secondary" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Security Audit</h3>
                <p className="text-on-surface-variant text-sm flex-grow">Our LLM-powered engine analyzes code logic to identify complex business logic flaws that static analysis misses.</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-secondary font-medium cursor-pointer">
                  Explore AI Engine <ArrowRight size={16} />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8 flex flex-col group min-h-[320px] animate-fade-in-up delay-300">
                <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center mb-6 border border-tertiary/20">
                  <Network className="text-tertiary" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Dependency Mapping</h3>
                <p className="text-on-surface-variant text-sm">Visualize and secure your entire software supply chain. Automated pull requests to update vulnerable packages.</p>
              </div>

              <div className="glass-card rounded-2xl p-8 md:col-span-2 flex flex-col md:flex-row items-center gap-8 animate-fade-in-up delay-400">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-surface-variant mb-4 text-xs font-medium text-on-surface-variant border border-outline-variant/20">
                    SOC2 · ISO27001 · GDPR
                  </div>
                  <h3 className="text-xl font-bold mb-2">Continuous Compliance</h3>
                  <p className="text-on-surface-variant text-sm">Generate auditor-ready reports with a single click. Maintain a pristine security posture mapped directly to major regulatory frameworks.</p>
                </div>
                <div className="flex gap-4 shrink-0">
                  <div className="w-20 h-24 bg-surface rounded-lg border border-outline-variant/20 flex flex-col items-center justify-center gap-2 shadow-lg">
                    <ShieldCheck className="text-primary" size={32} />
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">SOC 2 Type II</span>
                  </div>
                  <div className="w-20 h-24 bg-surface rounded-lg border border-outline-variant/20 flex flex-col items-center justify-center gap-2 shadow-lg">
                    <Gavel className="text-secondary" size={32} />
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">HIPAA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 border-t border-outline-variant/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="max-w-7xl mx-auto px-container-padding-desktop relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-outline-variant/20">
              <div className="p-8">
                <div className="font-display-lg text-5xl font-bold text-white mb-2 tracking-tight">100M+</div>
                <div className="text-primary text-sm font-label-caps uppercase tracking-widest">Repositories Scanned</div>
              </div>
              <div className="p-8">
                <div className="font-display-lg text-5xl font-bold text-white mb-2 tracking-tight">50k+</div>
                <div className="text-secondary text-sm font-label-caps uppercase tracking-widest">Engineering Teams</div>
              </div>
              <div className="p-8">
                <div className="font-display-lg text-5xl font-bold text-white mb-2 tracking-tight">99.9%</div>
                <div className="text-tertiary text-sm font-label-caps uppercase tracking-widest">Detection Rate</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 relative">
          <div className="max-w-4xl mx-auto px-container-padding-desktop text-center">
            <div className="glass-panel p-12 rounded-3xl border border-primary/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent"></div>
              <h2 className="relative z-10 font-display-lg text-3xl md:text-4xl font-bold mb-6">Ready to secure your code?</h2>
              <p className="relative z-10 text-on-surface-variant text-body-lg mb-8 max-w-xl mx-auto">Join thousands of companies using RepoGuard to protect their software supply chain. Setup takes less than 2 minutes.</p>
              <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => setView('login')}
                  className="bg-primary-container text-white px-8 py-3 rounded-full font-body-lg text-body-lg hover:bg-primary-container/90 transition-all cursor-pointer"
                >
                  Start Scanning Now
                </button>
                <button className="bg-surface text-on-surface border border-outline-variant/30 px-8 py-3 rounded-full font-body-lg text-body-lg hover:bg-surface-variant transition-all cursor-pointer">
                  Talk to Sales
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>
      
      <footer className="border-t border-outline-variant/20 bg-surface-container-lowest pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-container-padding-desktop">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-display-lg text-lg text-on-surface font-semibold">RepoGuard</span>
              </div>
              <p className="text-on-surface-variant text-sm max-w-xs mb-6">
                Enterprise DevSecOps platform securing the next generation of software development.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-on-surface mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-on-surface-variant flex flex-col items-start">
                <li><button onClick={() => setView('dashboard')} className="hover:text-primary transition-colors cursor-pointer text-left">Dashboard</button></li>
                <li><button onClick={() => setView('integrations')} className="hover:text-primary transition-colors cursor-pointer text-left">Integrations</button></li>
                <li><button onClick={() => setView('new_scan')} className="hover:text-primary transition-colors cursor-pointer text-left">New Scan</button></li>
                <li><button onClick={() => setView('scan_history')} className="hover:text-primary transition-colors cursor-pointer text-left">Scan History</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-on-surface mb-4">Scanners & Reports</h4>
              <ul className="space-y-2 text-sm text-on-surface-variant flex flex-col items-start">
                <li><button onClick={() => setView('reports')} className="hover:text-primary transition-colors cursor-pointer text-left">Reports</button></li>
                <li><button onClick={() => setView('secret_scanner')} className="hover:text-primary transition-colors cursor-pointer text-left">Secret Scanner</button></li>
                <li><button onClick={() => setView('dependency_scanner')} className="hover:text-primary transition-colors cursor-pointer text-left">Dependency Scanner</button></li>
                <li><button onClick={() => setView('ai_security_review')} className="hover:text-primary transition-colors cursor-pointer text-left">AI Security Review</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-on-surface mb-4">System</h4>
              <ul className="space-y-2 text-sm text-on-surface-variant flex flex-col items-start">
                <li><button onClick={() => setView('settings')} className="hover:text-primary transition-colors cursor-pointer text-left">Settings</button></li>
                <li><button onClick={() => setView('team')} className="hover:text-primary transition-colors cursor-pointer text-left">Team</button></li>
                <li><button onClick={() => setView('notifications')} className="hover:text-primary transition-colors cursor-pointer text-left">Notifications</button></li>
                <li><button onClick={() => setView('help')} className="hover:text-primary transition-colors cursor-pointer text-left">Help</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
            <p>© 2026 RepoGuard Inc. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-on-surface transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-on-surface transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const AlertTriangle = ({ ...props }) => {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
}

