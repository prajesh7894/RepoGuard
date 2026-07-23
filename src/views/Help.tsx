import { HelpCircle, Book, MessageCircle, FileText, ExternalLink } from 'lucide-react';

export default function Help() {
  return (
    <div className="pt-24 pb-12 px-container-padding-mobile md:px-container-padding-desktop w-full h-full flex flex-col max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-12 mt-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold flex items-center gap-3">
            <HelpCircle className="text-primary" size={32} />
            Help & Support
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Find answers, read documentation, and get in touch with our security experts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <a href="#" className="glass-panel p-8 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-colors group cursor-pointer flex flex-col">
          <div className="w-14 h-14 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Book size={28} />
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2">Documentation</h3>
          <p className="text-on-surface-variant mb-6 flex-1">Read comprehensive guides on how to configure RepoGuard, set up CI/CD pipelines, and interpret scan results.</p>
          <div className="flex items-center gap-2 text-primary font-medium text-sm">
            Read Docs <ExternalLink size={16} />
          </div>
        </a>

        <a href="#" className="glass-panel p-8 rounded-xl border border-outline-variant/30 hover:border-secondary/50 transition-colors group cursor-pointer flex flex-col">
          <div className="w-14 h-14 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <MessageCircle size={28} />
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2">Contact Support</h3>
          <p className="text-on-surface-variant mb-6 flex-1">Need help with a specific vulnerability or facing an issue? Our security engineering team is available 24/7.</p>
          <div className="flex items-center gap-2 text-secondary font-medium text-sm">
            Open Ticket <ExternalLink size={16} />
          </div>
        </a>
      </div>

      <div className="glass-panel p-8 rounded-xl border border-outline-variant/30">
        <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
          <FileText size={24} className="text-outline" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-6">
          <div className="border-b border-outline-variant/20 pb-6">
            <h4 className="font-semibold text-on-surface mb-2">How do I fix a Prototype Pollution vulnerability?</h4>
            <p className="text-sm text-on-surface-variant">The easiest way is to use our auto-remediation feature which will generate a PR bumping the package version. Alternatively, you can use our AI Security Assistant for tailored advice.</p>
          </div>
          <div className="border-b border-outline-variant/20 pb-6">
            <h4 className="font-semibold text-on-surface mb-2">Why did my build fail in CI?</h4>
            <p className="text-sm text-on-surface-variant">If you have configured "Block Builds" in your Scan Policies for Critical or High vulnerabilities, RepoGuard will intentionally return a non-zero exit code to prevent deployment of insecure code.</p>
          </div>
          <div>
            <h4 className="font-semibold text-on-surface mb-2">How are false positives handled?</h4>
            <p className="text-sm text-on-surface-variant">You can mark any finding as "Ignored" directly from the dashboard. Our AI review engine learns from these actions to reduce future false positives for your specific codebase patterns.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
