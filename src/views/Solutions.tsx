import { View } from '../types';
import { Building2, Code2, ShieldAlert } from 'lucide-react';

export default function Solutions() {
  return (
    <div className="p-8 pb-32 overflow-y-auto w-full h-full custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-4">Solutions for Every Team</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            RepoGuard adapts to your organizational structure, providing the right tools for the right people.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="glass-card p-8 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-container text-primary flex items-center justify-center shrink-0">
              <Code2 size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-2">For Developers</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Stay in your flow state. RepoGuard integrates directly into your PRs, flagging vulnerabilities and automatically suggesting AI-generated fixes before you merge. No more context switching or hunting for security documentation.
              </p>
            </div>
          </div>
          
          <div className="glass-card p-8 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 rounded-2xl bg-warning/20 text-warning flex items-center justify-center shrink-0">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-2">For Security Teams</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Get a bird's-eye view of your entire organization's security posture. Write custom regex policies to hunt for proprietary secrets, track vulnerability trends over time, and export compliance reports for audits with a single click.
              </p>
            </div>
          </div>
          
          <div className="glass-card p-8 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
              <Building2 size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface mb-2">For Engineering Leaders</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Enforce security standards across hundreds of repositories effortlessly. Use our analytics dashboard to track remediation velocity and ensure your teams are shipping secure code on time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
