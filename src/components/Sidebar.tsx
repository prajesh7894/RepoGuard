import {
  LayoutDashboard,
  Package,
  FileSearch,
  History,
  Unlock,
  Network,
  Brain,
  BarChart,
  Puzzle,
  Users,
  Bell,
  Settings,
  HelpCircle,
  Shield
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

export default function Sidebar({ currentView, setView }: SidebarProps) {
  return (
    <aside className="w-[240px] fixed left-4 top-4 bottom-4 rounded-3xl glass-panel flex flex-col gap-4 py-6 z-50 hidden md:flex">
      <div className="px-6 mb-6 flex items-center gap-3" onClick={() => setView('landing')} style={{cursor: 'pointer'}}>
        <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
            <Shield className="text-white" size={24} />
        </div>
        <div>
          <h1 className="font-display-lg text-title-md font-bold text-primary truncate">RepoGuard</h1>
          <p className="font-body-sm text-xs text-on-surface-variant">Enterprise DevSecOps</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-4">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setView('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'text-primary font-bold border-r-4 border-primary bg-primary/10'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <LayoutDashboard size={20} />
              <span className="text-sm text-left truncate">Dashboard</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setView('repositories')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                currentView === 'repositories'
                  ? 'text-primary font-bold border-r-4 border-primary bg-primary/10'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <Package size={20} />
              <span className="text-sm text-left truncate">Repositories</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setView('new_scan')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                currentView === 'new_scan'
                  ? 'text-primary font-bold border-r-4 border-primary bg-primary/10'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <FileSearch size={20} />
              <span className="text-sm text-left truncate">New Scan</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setView('scan_history')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                currentView === 'scan_history'
                  ? 'text-primary font-bold border-r-4 border-primary bg-primary/10'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <History size={20} />
              <span className="text-sm text-left truncate">Scan History</span>
            </button>
          </li>
          <li className="pt-4 pb-1 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Scanners</li>
          <li>
            <button
              onClick={() => setView('secret_scanner')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                currentView === 'secret_scanner'
                  ? 'text-primary font-bold border-r-4 border-primary bg-primary/10'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <Unlock size={20} />
              <span className="text-sm text-left truncate">Secret Scanner</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setView('dependency_scanner')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                currentView === 'dependency_scanner'
                  ? 'text-primary font-bold border-r-4 border-primary bg-primary/10'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <Network size={20} />
              <span className="text-sm text-left truncate">Dependency Scanner</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setView('ai_security_review')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                currentView === 'ai_security_review'
                  ? 'text-primary font-bold border-r-4 border-primary bg-primary/10'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <Brain size={20} />
              <span className="text-sm text-left truncate">AI Security Review</span>
            </button>
          </li>
          <li className="pt-4 pb-1 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">System</li>
          <li>
            <button
              onClick={() => setView('reports')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                currentView === 'reports'
                  ? 'text-primary font-bold border-r-4 border-primary bg-primary/10'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <BarChart size={20} />
              <span className="text-sm text-left truncate">Reports</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setView('integrations')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                currentView === 'integrations'
                  ? 'text-primary font-bold border-r-4 border-primary bg-primary/10'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <Puzzle size={20} />
              <span className="text-sm text-left truncate">Integrations</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setView('team')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                currentView === 'team'
                  ? 'text-primary font-bold border-r-4 border-primary bg-primary/10'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <Users size={20} />
              <span className="text-sm text-left truncate">Team</span>
            </button>
          </li>
        </ul>
      </nav>
      <div className="px-4 mt-auto flex flex-col gap-1">
        <button
          onClick={() => setView('notifications')}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors w-full ${
            currentView === 'notifications'
              ? 'text-primary font-bold border-r-4 border-primary bg-primary/10'
              : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
          }`}
        >
          <Bell size={20} />
          <span className="text-sm text-left">Notifications</span>
        </button>
        <button
          onClick={() => setView('settings')}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors w-full ${
            currentView === 'settings'
              ? 'text-primary font-bold border-r-4 border-primary bg-primary/10'
              : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
          }`}
        >
          <Settings size={20} />
          <span className="text-sm text-left">Settings</span>
        </button>
        <button
          onClick={() => setView('help')}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors w-full ${
            currentView === 'help'
              ? 'text-primary font-bold border-r-4 border-primary bg-primary/10'
              : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
          }`}
        >
          <HelpCircle size={20} />
          <span className="text-sm text-left">Help</span>
        </button>
        <div className="mt-4 px-2">
          <button className="w-full bg-primary-container text-white py-2 rounded-lg font-medium text-sm hover:bg-primary-container/90 transition-colors shadow-lg shadow-primary-container/20">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </aside>
  );
}
