import { View } from '../types';
import { Shield, Zap, Search, Lock } from 'lucide-react';

export default function Product() {
  return (
    <div className="pt-24 pb-32 px-8 overflow-y-auto w-full h-full custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-4">RepoGuard Product Features</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Discover the tools that keep your codebase secure, automated, and compliant.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-8 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-primary-container text-primary flex items-center justify-center mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-3">Secret Scanning</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Instantly identify and remediate hardcoded secrets, API keys, and credentials before they leak into production. Matches against 100+ patterns.
            </p>
          </div>
          
          <div className="glass-card p-8 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-warning/20 text-warning flex items-center justify-center mb-6">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-3">Dependency Analysis</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Scan your SBOM against real-time OSV vulnerability databases to highlight malicious or vulnerable dependencies instantly.
            </p>
          </div>
          
          <div className="glass-card p-8 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-3">AI Auto-Remediation</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Don't just find vulnerabilities—fix them. RepoGuard's AI Assistant automatically generates precise pull requests to patch your code.
            </p>
          </div>
          
          <div className="glass-card p-8 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-secondary-container text-secondary flex items-center justify-center mb-6">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-3">Custom Rules Engine</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Tailor the scanner to your organization's unique requirements with custom regex policies for proprietary token formats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
