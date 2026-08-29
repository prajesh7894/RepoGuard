import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Github, Users, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { View } from '../types';
import { useAuth } from '../contexts/AuthContext';
import ShaderBackground from '../components/ShaderBackground';

interface OnboardingProps {
  setView: (view: View) => void;
}

export default function Onboarding({ setView }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  const roles = [
    { id: 'dev', name: 'Developer', desc: 'I write code and want to catch issues early.' },
    { id: 'sec', name: 'Security Engineer', desc: 'I manage security policies and audits.' },
    { id: 'lead', name: 'Team Lead', desc: 'I oversee projects and team metrics.' },
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setView('dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 opacity-40">
        <ShaderBackground />
      </div>
      
      <div className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center">
        
        {/* Progress Bar */}
        <div className="w-full flex items-center justify-center mb-12 gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= i ? 'bg-primary text-background' : 'bg-surface-variant text-on-surface-variant'}`}>
                {step > i ? <CheckCircle2 size={16} /> : i}
              </div>
              {i < 3 && (
                <div className={`w-16 h-1 rounded-full mx-2 transition-colors ${step > i ? 'bg-primary' : 'bg-surface-variant'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="w-full glass-panel border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative bg-surface-container-low/80 backdrop-blur-2xl">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Welcome to RepoGuard, {user?.name || 'Developer'}!</h1>
                <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                  Let's get your workspace set up so you can start securing your code in minutes. How do you describe your role?
                </p>
                
                <div className="w-full flex flex-col gap-4 mb-8">
                  {roles.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${selectedRole === r.id ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(37,99,235,0.2)]' : 'border-outline-variant/30 hover:border-outline-variant bg-surface-container-lowest/50'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRole === r.id ? 'border-primary' : 'border-outline-variant'}`}>
                        {selectedRole === r.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                      </div>
                      <div>
                        <h3 className={`font-bold ${selectedRole === r.id ? 'text-primary' : 'text-on-surface'}`}>{r.name}</h3>
                        <p className="text-sm text-on-surface-variant mt-1">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleNext}
                  disabled={!selectedRole}
                  className="w-full sm:w-auto px-8 bg-primary-container hover:bg-primary-container/90 text-white font-bold rounded-xl py-3.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-surface-variant flex items-center justify-center mb-6">
                  <Github className="w-10 h-10 text-on-surface" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Connect your Codebase</h1>
                <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                  Link your GitHub account to automatically sync repositories and enable pull request scanning.
                </p>
                
                <div className="w-full max-w-sm mb-8">
                  {user?.githubLinked ? (
                    <div className="p-4 rounded-xl border border-success/30 bg-success/10 flex flex-col items-center justify-center gap-3">
                      <CheckCircle2 className="text-success" size={32} />
                      <p className="font-bold text-success">GitHub Connected Successfully!</p>
                    </div>
                  ) : (
                    <a 
                      href="/api/auth/github/callback?code=mock_code"
                      onClick={(e) => {
                        e.preventDefault();
                        fetch('/api/auth/github/callback', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                          body: JSON.stringify({ code: "mock_code" })
                        }).then(() => window.location.reload());
                      }}
                      className="w-full flex items-center justify-center gap-3 bg-[#2ea043] text-white px-6 py-4 rounded-xl font-bold hover:bg-[#2c974b] transition-colors shadow-lg cursor-pointer"
                    >
                      <div className="i-lucide-github" style={{width: 24, height: 24}}></div>
                      Sync with GitHub
                    </a>
                  )}
                  
                  {!user?.githubLinked && (
                    <button onClick={handleNext} className="mt-4 text-sm text-on-surface-variant hover:text-white transition-colors">
                      Skip for now
                    </button>
                  )}
                </div>

                {user?.githubLinked && (
                  <button 
                    onClick={handleNext}
                    className="w-full sm:w-auto px-8 bg-primary-container hover:bg-primary-container/90 text-white font-bold rounded-xl py-3.5 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20 flex items-center justify-center mb-6">
                  <Users className="w-10 h-10 text-secondary" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Invite your Team</h1>
                <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                  Security is a team effort. Invite developers to review findings and configure policies together.
                </p>
                
                <div className="w-full max-w-md space-y-4 mb-8 text-left">
                  <div className="flex gap-2">
                    <input type="email" placeholder="colleague@company.com" className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary outline-none" />
                    <button className="bg-surface-variant hover:bg-surface-variant/80 px-4 rounded-lg font-bold text-on-surface transition-colors">Add</button>
                  </div>
                  <div className="flex gap-2">
                    <input type="email" placeholder="security@company.com" className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus:border-primary outline-none" />
                    <button className="bg-surface-variant hover:bg-surface-variant/80 px-4 rounded-lg font-bold text-on-surface transition-colors">Add</button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button 
                    onClick={handleNext}
                    className="px-8 bg-surface-variant hover:bg-surface-variant/80 text-on-surface font-bold rounded-xl py-3.5 transition-all"
                  >
                    Skip
                  </button>
                  <button 
                    onClick={handleNext}
                    className="px-8 bg-primary-container hover:bg-primary-container/90 text-white font-bold rounded-xl py-3.5 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
                  >
                    Go to Dashboard <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
