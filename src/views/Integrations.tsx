import { Puzzle, CheckCircle2, Webhook, Plus, ExternalLink, ArrowRight } from 'lucide-react';

export default function Integrations() {
  const integrations = [
    { id: 'github', name: 'GitHub', category: 'Version Control', status: 'connected', desc: 'Scan code, PRs, and commits automatically.' },
    { id: 'gitlab', name: 'GitLab', category: 'Version Control', status: 'available', desc: 'Integrate with GitLab repositories and pipelines.' },
    { id: 'slack', name: 'Slack', category: 'Notifications', status: 'connected', desc: 'Receive real-time alerts in Slack channels.' },
    { id: 'jira', name: 'Jira Software', category: 'Issue Tracking', status: 'connected', desc: 'Automatically sync vulnerabilities as Jira tickets.' },
    { id: 'datadog', name: 'DataDog', category: 'Monitoring', status: 'available', desc: 'Export security metrics to DataDog dashboards.' },
    { id: 'snyk', name: 'Snyk Import', category: 'Data Sync', status: 'available', desc: 'Import historical findings from Snyk.' },
  ];

  return (
    <div className="pt-24 pb-12 px-container-padding-mobile md:px-container-padding-desktop w-full h-full flex flex-col max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold flex items-center gap-3">
            <Puzzle className="text-primary" size={32} />
            Integrations Hub
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Connect RepoGuard to your existing developer tools and workflows.</p>
        </div>
        <button className="border border-outline-variant text-on-surface px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-variant transition-colors cursor-pointer flex items-center gap-2">
          <Webhook size={16} /> Custom Webhooks
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(integration => (
          <div key={integration.id} className="glass-card p-6 rounded-xl border border-outline-variant/30 flex flex-col hover:border-primary/40 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center text-xl font-bold text-on-surface group-hover:scale-105 transition-transform">
                {integration.name.charAt(0)}
              </div>
              {integration.status === 'connected' ? (
                <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full border border-success/20">
                  <CheckCircle2 size={12} /> Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-medium text-on-surface-variant bg-surface-variant/50 px-2 py-1 rounded-full border border-outline-variant/30">
                  Available
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-1">{integration.name}</h3>
            <p className="text-xs text-primary font-medium mb-3">{integration.category}</p>
            <p className="text-sm text-on-surface-variant mb-6 flex-1">
              {integration.desc}
            </p>
            <div className="mt-auto">
              {integration.status === 'connected' ? (
                <button className="w-full py-2 bg-surface-variant/50 text-on-surface text-sm font-medium rounded hover:bg-surface-variant transition-colors border border-outline-variant/30 flex items-center justify-center gap-2 cursor-pointer">
                  Manage <ExternalLink size={14} />
                </button>
              ) : (
                <button className="w-full py-2 bg-primary-container text-white text-sm font-medium rounded hover:bg-primary-container/90 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_10px_rgba(37,99,235,0.1)]">
                  <Plus size={16} /> Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 glass-panel p-6 rounded-xl border border-outline-variant/30 bg-surface-container-lowest/50 flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
            <h3 className="font-semibold text-on-surface mb-1">Need a custom integration?</h3>
            <p className="text-sm text-on-surface-variant">Build your own connectors using our REST API and Webhooks.</p>
         </div>
         <button className="text-primary hover:underline font-medium text-sm flex items-center gap-1 whitespace-nowrap cursor-pointer">
            View API Documentation <ArrowRight size={16} />
         </button>
      </div>
    </div>
  );
}
