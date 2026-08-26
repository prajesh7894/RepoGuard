import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Github, Key, Users, Webhook } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CustomRulesManager from '../components/CustomRulesManager';
import TeamManager from '../components/TeamManager';

export default function Settings() {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    if (user?.preferences) {
      try {
        const prefs = JSON.parse(user.preferences);
        if (prefs.theme) {
          setTheme(prefs.theme);
        }
      } catch (e) {}
    }
  }, [user]);

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    if (newTheme === 'default') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', newTheme);
    }

    if (token) {
      try {
        let prefs: any = {};
        if (user?.preferences) {
          prefs = JSON.parse(user.preferences);
        }
        prefs.theme = newTheme;
        
        await fetch('/api/me/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ preferences: JSON.stringify(prefs) })
        });
      } catch (err) {
        console.error("Failed to save theme", err);
      }
    }
  };

  const themes = [
    { id: 'default', name: 'Blue (Default)', colorClass: 'bg-blue-500' },
    { id: 'emerald', name: 'Emerald', colorClass: 'bg-emerald-500' },
    { id: 'purple', name: 'Purple', colorClass: 'bg-purple-500' },
    { id: 'rose', name: 'Rose', colorClass: 'bg-rose-500' },
  ];

  return (
    <div className="pt-24 pb-12 px-container-padding-mobile md:px-container-padding-desktop w-full h-full flex flex-col max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold flex items-center gap-3">
            <SettingsIcon className="text-outline" size={32} />
            Settings
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Configure workspace integrations, policies, and access controls.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-1">
            {[
              { id: 'general', label: 'General', icon: SettingsIcon },
              { id: 'integrations', label: 'Integrations', icon: Webhook },
              { id: 'policies', label: 'Scan Policies', icon: Shield },
              { id: 'alerts', label: 'Alerts & Notifications', icon: Bell },
              { id: 'access', label: 'Access Control', icon: Users },
              { id: 'api', label: 'API Tokens', icon: Key },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-variant/30 hover:text-on-surface border-l-4 border-transparent'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 glass-panel rounded-xl border border-outline-variant/30 p-6 md:p-8 min-h-[500px]">
          {activeTab === 'general' && (
            <div className="animate-fade-in-up">
              <h3 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">Appearance</h3>
              
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="font-semibold text-on-surface">Accent Color Theme</h4>
                    <p className="text-sm text-on-surface-variant mt-1">Select the primary accent color for the RepoGuard workspace.</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-2">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleThemeChange(t.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                          theme === t.id
                            ? 'border-primary bg-primary/10 shadow-lg'
                            : 'border-outline-variant/30 hover:border-outline-variant hover:bg-surface-variant/30'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full ${t.colorClass} shadow-lg ring-2 ring-background`} />
                        <span className={`text-xs font-medium ${theme === t.id ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {t.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="animate-fade-in-up">
              <h3 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">Version Control Integrations</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 rounded-lg border border-outline-variant/30 bg-surface-container-lowest">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface">
                      <Github size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-on-surface">GitHub App</h4>
                      <p className="text-sm text-on-surface-variant mt-1">
                        {user?.githubLinked ? 'Connected and syncing repositories' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  {user?.githubLinked ? (
                    <button className="px-4 py-2 bg-surface-variant hover:bg-surface-variant/80 text-on-surface text-sm font-medium rounded transition-colors border border-outline-variant/30 cursor-pointer">
                      Connected
                    </button>
                  ) : (
                    <a 
                      href="/api/auth/github/callback?code=mock_code"
                      onClick={(e) => {
                        e.preventDefault();
                        fetch('/api/auth/github/callback', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                          body: JSON.stringify({ code: "mock_code" })
                        }).then(() => window.location.reload());
                      }}
                      className="px-4 py-2 bg-primary-container text-white text-sm font-medium rounded hover:bg-primary-container/90 transition-colors cursor-pointer"
                    >
                      Connect
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-between p-5 rounded-lg border border-outline-variant/30 bg-surface-container-lowest opacity-75">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface">
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 13.29l-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83z"></path></svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-on-surface">GitLab</h4>
                      <p className="text-sm text-on-surface-variant mt-1">Not connected</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-primary-container text-white text-sm font-medium rounded hover:bg-primary-container/90 transition-colors cursor-pointer">
                    Connect
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-on-surface mb-6 mt-12 border-b border-outline-variant/30 pb-4">Issue Trackers</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 rounded-lg border border-outline-variant/30 bg-surface-container-lowest">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface">
                      <span className="font-bold">J</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-on-surface">Jira Software</h4>
                      <p className="text-sm text-on-surface-variant mt-1">Automatically create tickets for findings.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const url = prompt("Enter Jira Webhook URL (e.g. Zapier hook):", user?.jiraWebhook || "");
                      if (url !== null) {
                        fetch('/api/integrations/jira', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                          body: JSON.stringify({ jiraWebhook: url })
                        }).then(() => window.location.reload());
                      }
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded transition-colors border cursor-pointer ${
                      user?.jiraWebhook 
                      ? 'bg-surface-variant hover:bg-surface-variant/80 text-on-surface border-outline-variant/30' 
                      : 'bg-primary-container text-white hover:bg-primary-container/90 border-transparent'
                    }`}
                  >
                    {user?.jiraWebhook ? 'Configure' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="animate-fade-in-up">
              <h3 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">Custom Scan Policies</h3>
              <p className="text-sm text-on-surface-variant mb-6">Define custom Regex patterns to detect proprietary secrets and internal configurations.</p>
              
              <CustomRulesManager token={token} />
            </div>
          )}

          {activeTab === 'access' && (
            <div className="animate-fade-in-up">
              <h3 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">Team & Access Control</h3>
              <TeamManager token={token} />
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="animate-fade-in-up">
              <h3 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">Alerts & Notifications</h3>
              <p className="text-sm text-on-surface-variant mb-6">Choose how and when you want to be notified about security events.</p>
              
              <div className="space-y-6">
                <div className="glass-card p-5 border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-on-surface">Email Notifications</h4>
                      <p className="text-sm text-on-surface-variant">Receive alerts in your inbox.</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-primary/20 cursor-pointer border border-primary/30">
                       <div className="absolute top-0.5 left-6 w-5 h-5 rounded-full bg-primary shadow-sm transition-all"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pl-2 border-l-2 border-outline-variant/30 ml-2 mt-4">
                     <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-primary bg-surface border-outline-variant/50 rounded" />
                        <span className="text-sm text-on-surface-variant">Critical vulnerabilities found</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-primary bg-surface border-outline-variant/50 rounded" />
                        <span className="text-sm text-on-surface-variant">New secrets detected in commits</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-primary bg-surface border-outline-variant/50 rounded" />
                        <span className="text-sm text-on-surface-variant">Weekly executive summary reports</span>
                     </label>
                  </div>
                </div>

                <div className="glass-card p-5 border border-outline-variant/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-on-surface">Slack Integration</h4>
                      <p className="text-sm text-on-surface-variant">Send alerts to a Slack channel.</p>
                    </div>
                    <button className="px-4 py-2 bg-surface-variant hover:bg-surface-variant/80 text-on-surface text-sm font-medium rounded transition-colors border border-outline-variant/30 cursor-pointer">
                      Connect Slack
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="animate-fade-in-up">
              <h3 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-4">API Tokens</h3>
              <p className="text-sm text-on-surface-variant mb-6">Generate Personal Access Tokens to authenticate with the RepoGuard API in your CI/CD pipelines.</p>
              
              <div className="glass-card p-6 border border-outline-variant/30 mb-8">
                <h4 className="font-semibold text-on-surface mb-4">Generate New Token</h4>
                <div className="flex gap-4">
                   <input type="text" placeholder="Token description (e.g. Jenkins CI)" className="flex-1 bg-surface-container-highest border border-outline-variant/30 rounded-lg px-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary/50" />
                   <select className="bg-surface-container-highest border border-outline-variant/30 rounded-lg px-4 py-2 text-sm text-on-surface focus:outline-none">
                     <option>30 days</option>
                     <option>90 days</option>
                     <option>No expiration</option>
                   </select>
                   <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap">
                     Generate Token
                   </button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-on-surface mb-4">Active Tokens</h4>
                <div className="border border-outline-variant/30 rounded-lg overflow-hidden">
                   <div className="bg-surface-variant/30 px-4 py-3 flex items-center justify-between text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      <span>Description</span>
                      <span className="w-32">Created</span>
                      <span className="w-32">Expires</span>
                      <span className="w-20 text-right">Actions</span>
                   </div>
                   <div className="px-4 py-3 flex items-center justify-between border-t border-outline-variant/30 text-sm">
                      <span className="text-on-surface font-medium flex items-center gap-2"><Key size={14} className="text-primary"/> GitHub Actions</span>
                      <span className="w-32 text-on-surface-variant">Oct 12, 2025</span>
                      <span className="w-32 text-on-surface-variant">Nov 11, 2025</span>
                      <button className="w-20 text-right text-red-400 hover:text-red-300 transition-colors cursor-pointer">Revoke</button>
                   </div>
                   <div className="px-4 py-3 flex items-center justify-between border-t border-outline-variant/30 text-sm">
                      <span className="text-on-surface font-medium flex items-center gap-2"><Key size={14} className="text-primary"/> Local Dev CLI</span>
                      <span className="w-32 text-on-surface-variant">Sep 01, 2025</span>
                      <span className="w-32 text-on-surface-variant">Never</span>
                      <button className="w-20 text-right text-red-400 hover:text-red-300 transition-colors cursor-pointer">Revoke</button>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
