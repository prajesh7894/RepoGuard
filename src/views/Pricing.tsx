import { View } from '../types';
import { CheckCircle2 } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="pt-24 pb-32 px-8 overflow-y-auto w-full h-full custom-scrollbar">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-4">Transparent Pricing</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Choose the plan that matches your organization's security needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 flex flex-col hover:-translate-y-1 transition-transform">
            <h3 className="text-xl font-bold text-on-surface mb-2">Developer</h3>
            <div className="text-3xl font-bold text-primary mb-6">$0<span className="text-sm font-normal text-on-surface-variant">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-on-surface-variant">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Up to 3 private repositories</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Basic secret scanning</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Weekly manual scans</li>
            </ul>
            <button className="w-full py-2 rounded-lg bg-surface-variant text-on-surface font-medium hover:bg-surface-variant/80 transition-colors">Current Plan</button>
          </div>
          
          <div className="glass-card p-8 flex flex-col border-primary/50 relative hover:-translate-y-1 transition-transform">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Pro Team</h3>
            <div className="text-3xl font-bold text-primary mb-6">$49<span className="text-sm font-normal text-on-surface-variant">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-on-surface-variant">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Unlimited private repositories</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Real-time PR scanning</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Automated AI Remediation PRs</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Dependency vulnerabilities (OSV)</li>
            </ul>
              <button className="w-full py-2 bg-primary-container text-white text-sm font-bold rounded-lg hover:bg-primary-container/90 transition-all flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 cursor-pointer">
                Upgrade to Pro
              </button>
          </div>
          
          <div className="glass-card p-8 flex flex-col hover:-translate-y-1 transition-transform">
            <h3 className="text-xl font-bold text-on-surface mb-2">Enterprise</h3>
            <div className="text-3xl font-bold text-primary mb-6">Custom</div>
            <ul className="space-y-4 mb-8 flex-1 text-sm text-on-surface-variant">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Everything in Pro</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Custom Regex Engine policies</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Jira & Slack integrations</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Advanced compliance reporting</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Priority 24/7 support</li>
            </ul>
            <button className="w-full py-2 rounded-lg bg-surface-variant text-on-surface font-medium hover:bg-surface-variant/80 transition-colors">Contact Sales</button>
          </div>
        </div>
      </div>
    </div>
  );
}
