import { View } from '../types';
import { BookOpen, Key, GitMerge, FileJson } from 'lucide-react';

export default function Docs() {
  return (
    <div className="pt-24 pb-32 px-8 overflow-y-auto w-full h-full custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-4">Documentation</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Everything you need to integrate, configure, and maximize RepoGuard.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6 cursor-pointer hover:bg-surface-variant/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/20 text-primary"><BookOpen size={20} /></div>
              <h3 className="font-bold text-on-surface">Getting Started</h3>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">Learn how to connect your first repository and run an initial scan.</p>
            <div className="text-sm text-primary font-medium hover:underline">Read Guide &rarr;</div>
          </div>
          
          <div className="glass-card p-6 cursor-pointer hover:bg-surface-variant/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-warning/20 text-warning"><Key size={20} /></div>
              <h3 className="font-bold text-on-surface">API Authentication</h3>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">Generate API tokens and learn how to authenticate your CI/CD pipelines.</p>
            <div className="text-sm text-primary font-medium hover:underline">Read Guide &rarr;</div>
          </div>
          
          <div className="glass-card p-6 cursor-pointer hover:bg-surface-variant/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500"><GitMerge size={20} /></div>
              <h3 className="font-bold text-on-surface">GitHub Integration</h3>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">Set up webhook events for real-time PR scanning and automated fixes.</p>
            <div className="text-sm text-primary font-medium hover:underline">Read Guide &rarr;</div>
          </div>
          
          <div className="glass-card p-6 cursor-pointer hover:bg-surface-variant/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-secondary/20 text-secondary"><FileJson size={20} /></div>
              <h3 className="font-bold text-on-surface">Custom Policies</h3>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">Write custom Regular Expressions to detect proprietary token patterns.</p>
            <div className="text-sm text-primary font-medium hover:underline">Read Guide &rarr;</div>
          </div>
        </div>
        
        <div className="glass-card p-8 bg-primary/5 border-primary/20">
          <h2 className="text-xl font-bold text-on-surface mb-2">Need Help?</h2>
          <p className="text-on-surface-variant mb-6">Our support team is available 24/7 to help you with any questions.</p>
          <button className="px-5 py-2 bg-primary-container text-white text-sm font-bold rounded-lg hover:bg-primary-container/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 cursor-pointer">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
