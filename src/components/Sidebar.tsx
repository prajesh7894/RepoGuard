import {
  LayoutDashboard,
  FolderGit2,
  ScanSearch,
  Activity,
  Key,
  Workflow,
  Sparkles,
  AreaChart,
  Blocks,
  Users,
  Bell,
  Settings,
  HelpCircle,
  ShieldCheck,
  Shield,
  Zap,
  X,
  ClipboardList
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ currentView, setView, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`w-[260px] fixed left-4 top-4 bottom-4 rounded-3xl glass-panel flex flex-col gap-4 py-6 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-[120%]'} md:translate-x-0`}>
        <div className="px-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shadow-lg shadow-primary-container/20">
                <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-display-lg text-title-md font-bold text-primary truncate tracking-tight">RepoGuard</h1>
              <p className="font-body-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Enterprise Security</p>
            </div>
          </div>
          <button className="md:hidden text-on-surface hover:text-primary" onClick={onClose}>
            <X size={24} />
          </button>
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
              <LayoutDashboard size={20} className="shrink-0" />
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
              <FolderGit2 size={20} className="shrink-0 text-blue-400" />
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
              <ScanSearch size={20} className="shrink-0 text-emerald-400" />
              <span className="text-sm text-left truncate font-semibold">New Scan</span>
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
              <Activity size={20} className="shrink-0 text-cyan-400" />
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
              <Key size={20} className="shrink-0 text-amber-400" />
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
              <Workflow size={20} className="shrink-0 text-sky-400" />
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
              <Sparkles size={20} className={`shrink-0 ${currentView === 'ai_security_review' ? "text-secondary" : "text-purple-400"}`} />
              <span className="text-sm text-left truncate">AI Security Review</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setView('compliance')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                currentView === 'compliance'
                  ? 'text-primary font-bold border-r-4 border-primary bg-primary/10'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <Shield size={20} className="shrink-0 text-indigo-400" />
              <span className="text-sm text-left truncate">Compliance</span>
            </button>
          </li>
          <li className="pt-4 pb-1 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">System</li>
          <li>
            <button
              onClick={() => setView('audit_logs')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                currentView === 'audit_logs'
                  ? 'text-primary font-bold border-r-4 border-primary bg-primary/10'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <ClipboardList size={20} />
              <span className="text-sm text-left truncate">Audit Logs</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setView('reports')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                currentView === 'reports'
                  ? 'text-primary font-bold border-r-4 border-primary bg-primary/10'
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'
              }`}
            >
              <AreaChart size={20} />
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
              <Blocks size={20} />
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
      </div>
    </aside>
    </>
  );
}
