import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Github, Key, Users, Webhook } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
                      <p className="text-sm text-on-surface-variant mt-1">Connected to <span className="font-code-sm text-primary">acme-corp</span> (24 repositories)</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-surface-variant hover:bg-surface-variant/80 text-on-surface text-sm font-medium rounded transition-colors border border-outline-variant/30 cursor-pointer">
                    Configure
                  </button>
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
                      <p className="text-sm text-on-surface-variant mt-1">Automatically create tickets for Critical findings.</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-surface-variant hover:bg-surface-variant/80 text-on-surface text-sm font-medium rounded transition-colors border border-outline-variant/30 cursor-pointer">
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'general' && activeTab !== 'integrations' && (
            <div className="h-full flex flex-col items-center justify-center text-on-surface-variant opacity-60 animate-fade-in-up">
              <SettingsIcon size={48} className="mb-4" />
              <p>This settings pane is currently under construction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
