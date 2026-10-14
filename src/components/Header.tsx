import { Search, Sparkles, LogOut, FolderCode, History, Menu, X, ScanSearch } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import { useAuth } from '../contexts/AuthContext';
import { View } from '../types';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onOpenAiAssistant: () => void;
  setView: (view: View) => void;
  onOpenSidebar?: () => void;
}

export default function Header({ onOpenAiAssistant, setView, onOpenSidebar }: HeaderProps) {
  const { user, token, logout } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{repos: any[], scans: any[]}>({ repos: [], scans: [] });

  useEffect(() => {
    if (!searchQuery.trim() || !token) return;
    const fetchSearch = async () => {
      try {
        const [reposRes, scansRes] = await Promise.all([
          fetch('/api/repos', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/scans', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        const repos = await reposRes.json();
        const scans = await scansRes.json();
        
        const filteredRepos = Array.isArray(repos) ? repos.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];
        const filteredScans = Array.isArray(scans) ? scans.filter(s => s.repository?.name?.toLowerCase().includes(searchQuery.toLowerCase())) : [];
        
        setSearchResults({
          repos: filteredRepos.slice(0, 3),
          scans: filteredScans.slice(0, 3)
        });
      } catch (e) {
        console.error(e);
      }
    };
    
    const timeout = setTimeout(fetchSearch, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, token]);
  
  return (
    <>
    <div className="sticky top-4 mx-4 md:mx-6 z-40 mb-6">
      <header className="glass-panel text-primary font-body-sm text-body-sm h-14 rounded-full flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            className="md:hidden text-on-surface hover:text-primary transition-colors cursor-pointer"
            onClick={() => onOpenSidebar && onOpenSidebar()}
          >
            <Menu size={24} />
          </button>
          
          <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
              <input 
                  className="bg-surface-container-highest border border-outline-variant/30 rounded-full pl-10 pr-4 py-1 text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant/50 w-40 lg:w-48 xl:w-64 input-glow" 
                  placeholder="Search repositories, scans..." 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              />
              
              {isSearchOpen && searchQuery && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-surface-container-high border border-outline-variant/30 rounded-xl shadow-lg overflow-hidden py-2 z-50">
                  {searchResults.repos.length > 0 && (
                    <div className="px-4 py-2">
                      <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Repositories</h4>
                      {searchResults.repos.map((r: any) => (
                        <div key={r.id} onClick={() => setView('repositories')} className="cursor-pointer py-1.5 px-2 hover:bg-surface-variant/50 rounded flex items-center gap-2">
                           <FolderCode size={14} className="text-primary" />
                           <span className="text-sm font-medium truncate">{r.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.scans.length > 0 && (
                    <div className="px-4 py-2">
                      <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Recent Scans</h4>
                      {searchResults.scans.map((s: any) => (
                        <div key={s.id} onClick={() => setView('scan_history')} className="cursor-pointer py-1.5 px-2 hover:bg-surface-variant/50 rounded flex items-center gap-2">
                           <History size={14} className="text-secondary" />
                           <span className="text-sm truncate">Scan on {s.repository?.name || 'Unknown'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.repos.length === 0 && searchResults.scans.length === 0 && (
                    <div className="px-4 py-3 text-sm text-on-surface-variant">No results found for "{searchQuery}"</div>
                  )}
                </div>
              )}
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <nav className="hidden xl:flex gap-6">
              <button onClick={() => setView('product')} className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium cursor-pointer">Product</button>
              <button onClick={() => setView('solutions')} className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium cursor-pointer">Solutions</button>
              <button onClick={() => setView('pricing')} className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium cursor-pointer">Pricing</button>
              <button onClick={() => setView('docs')} className="text-on-surface-variant hover:text-primary transition-all text-sm font-medium cursor-pointer">Docs</button>
          </nav>
          <div className="h-6 w-px bg-outline-variant/30 hidden xl:block"></div>
          <div className="flex items-center gap-2">
              <button 
                  onClick={() => setView('new_scan')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 md:px-4 py-1.5 rounded-full font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center gap-1.5 text-sm cursor-pointer hover:-translate-y-0.5"
                  title="Start a new security scan"
              >
                  <ScanSearch size={16} className="text-white shrink-0" />
                  <span className="font-semibold">Scan</span>
              </button>
              <button onClick={onOpenAiAssistant} className="bg-primary-container text-white hover:bg-primary-container/90 px-3 md:px-4 py-1.5 rounded-full font-bold transition-all shadow-[0_0_10px_rgba(37,99,235,0.4)] hover:shadow-[0_0_15px_rgba(37,99,235,0.6)] flex items-center gap-2 text-sm cursor-pointer hover:-translate-y-0.5">
                  <Sparkles size={16} className="fill-white shrink-0" />
                  <span className="hidden sm:inline">AI Assistant</span>
              </button>
              <NotificationCenter />
              <button onClick={logout} title="Log out" className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-red-400 hover:bg-surface-variant/50 transition-colors cursor-pointer">
                  <LogOut size={18} />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary ml-1 flex items-center justify-center text-background font-bold text-sm cursor-pointer uppercase">
                  {user?.name ? user.name.charAt(0) : (user?.email ? user.email.charAt(0) : 'U')}
              </div>
          </div>
        </div>
      </header>
    </div>
    </>
  );
}
