import { Sparkles, Bell, LogOut, Search, User } from 'lucide-react';
import { View } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onOpenAiAssistant?: () => void;
  setView: (view: View) => void;
}

export default function Header({ onOpenAiAssistant, setView }: HeaderProps) {
  const { user, logout } = useAuth();
  
  return (
    <div className="fixed top-4 right-4 left-4 md:left-[272px] z-40">
      <header className="glass-panel text-primary font-body-sm text-body-sm h-14 rounded-full flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
              <input 
                  className="bg-surface-container-highest border border-outline-variant/30 rounded-full pl-10 pr-4 py-1 text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant/50 w-64 input-glow" 
                  placeholder="Search repositories, scans..." 
                  type="text" 
              />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex gap-6">
              <button onClick={() => setView('product')} className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium cursor-pointer">Product</button>
              <button onClick={() => setView('solutions')} className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium cursor-pointer">Solutions</button>
              <button onClick={() => setView('pricing')} className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium cursor-pointer">Pricing</button>
              <button onClick={() => setView('docs')} className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium cursor-pointer">Docs</button>
          </nav>
          <div className="h-6 w-px bg-outline-variant/30 hidden lg:block"></div>
          <div className="flex items-center gap-2">
              <button onClick={onOpenAiAssistant} className="bg-primary-container/20 text-primary hover:bg-primary-container/30 px-3 py-1.5 rounded-full font-medium transition-colors border border-primary/20 flex items-center gap-2 text-sm cursor-pointer">
                  <Sparkles size={16} />
                  AI Assistant
              </button>
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-variant/50 transition-colors cursor-pointer">
                  <Bell size={18} />
              </button>
              <button onClick={logout} title="Log out" className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-red-400 hover:bg-surface-variant/50 transition-colors cursor-pointer">
                  <LogOut size={18} />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary ml-2 flex items-center justify-center text-background font-bold text-sm cursor-pointer uppercase">
                  {user?.name ? user.name.charAt(0) : (user?.email ? user.email.charAt(0) : 'U')}
              </div>
          </div>
        </div>
      </header>
    </div>
  );
}
