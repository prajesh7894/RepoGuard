import { useState, useEffect } from 'react';
import { Puzzle, CheckCircle2, Webhook, Plus, ExternalLink, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Integrations() {
  const { token, user } = useAuth();
  const [slackWebhook, setSlackWebhook] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWebhook, setNewWebhook] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token) {
      fetch('/api/integrations/slack', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.slackWebhook) {
          setSlackWebhook(data.slackWebhook);
        }
      })
      .catch(err => console.error("Failed to fetch integrations", err));
    }
  }, [token]);

  const handleSaveWebhook = async () => {
    if (!newWebhook.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/integrations/slack', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ slackWebhook: newWebhook })
      });
      if (res.ok) {
        setSlackWebhook(newWebhook);
        setIsModalOpen(false);
      } else {
        alert("Failed to save webhook");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving webhook");
    } finally {
      setSaving(false);
    }
  };

  const handleConnect = async (id: string) => {
    if (id === 'slack') {
      setIsModalOpen(true);
    } else if (id === 'github') {
      try {
        await fetch('/api/auth/github/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ code: "mock_code" })
        });
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    } else if (id === 'jira') {
      const url = prompt("Enter Jira Webhook URL (e.g. Zapier hook):", user?.jiraWebhook || "");
      if (url !== null) {
        try {
          await fetch('/api/integrations/jira', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ jiraWebhook: url })
          });
          window.location.reload();
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      alert(`${id} integration coming soon!`);
    }
  };

  const handleDisconnect = async (id: string) => {
    setSaving(true);
    try {
      if (id === 'slack') {
        const res = await fetch('/api/integrations/slack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ slackWebhook: null })
        });
        if (res.ok) setSlackWebhook(null);
      } else if (id === 'github') {
        // Mock disconnect
        alert("GitHub disconnected.");
      } else if (id === 'jira') {
        await fetch('/api/integrations/jira', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ jiraWebhook: null })
        });
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const integrations = [
    { id: 'github', name: 'GitHub', category: 'Version Control', status: user?.githubLinked ? 'connected' : 'available', desc: 'Scan code, PRs, and commits automatically.' },
    { id: 'gitlab', name: 'GitLab', category: 'Version Control', status: 'available', desc: 'Integrate with GitLab repositories and pipelines.' },
    { id: 'slack', name: 'Slack', category: 'Notifications', status: slackWebhook ? 'connected' : 'available', desc: 'Receive real-time alerts in Slack channels.' },
    { id: 'jira', name: 'Jira Software', category: 'Issue Tracking', status: user?.jiraWebhook ? 'connected' : 'available', desc: 'Automatically sync vulnerabilities as Jira tickets.' },
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
                <button 
                  onClick={() => handleDisconnect(integration.id)}
                  className="w-full py-2 bg-surface-variant/50 text-on-surface text-sm font-medium rounded hover:bg-surface-variant transition-colors border border-outline-variant/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {saving && integration.id === 'slack' ? 'Disconnecting...' : 'Disconnect'}
                </button>
              ) : (
                <button 
                  onClick={() => handleConnect(integration.id)}
                  className="w-full py-2 bg-primary-container text-white text-sm font-medium rounded hover:bg-primary-container/90 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_10px_rgba(37,99,235,0.1)]"
                >
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface-container-highest border border-outline-variant/30 rounded-xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface font-bold">
                  S
                </div>
                <h3 className="text-xl font-bold text-on-surface">Connect Slack</h3>
              </div>
              <p className="text-sm text-on-surface-variant mb-6">
                Enter your Slack Webhook URL. RepoGuard will instantly notify this channel whenever a critical vulnerability or secret is detected.
              </p>
              
              <div className="mb-6">
                <label className="block text-xs font-medium text-on-surface-variant mb-2">Slack Webhook URL</label>
                <input 
                  type="text"
                  value={newWebhook}
                  onChange={(e) => setNewWebhook(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-variant rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveWebhook}
                  disabled={saving || !newWebhook.trim()}
                  className="px-4 py-2 text-sm font-medium bg-primary-container text-white rounded-lg hover:bg-primary-container/90 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Connect Slack'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
