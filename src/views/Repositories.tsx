import { useState, useEffect } from 'react';
import { Plus, Search, Eye, FileCode, Gauge, ChevronDown, Blocks, Clock, MoreVertical, Bug, Key, RefreshCw, Database } from 'lucide-react';
import RepoDetailsDrawer from '../components/RepoDetailsDrawer';
import { useAuth } from '../contexts/AuthContext';

export default function Repositories() {
  const [selectedRepo, setSelectedRepo] = useState<any | null>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { token } = useAuth();

  const fetchRepos = async () => {
    try {
      const res = await fetch('/api/repos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Failed to fetch repos");
      const data = await res.json();
      setRepos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch repos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRepos();
    }
  }, [token]);

  // Poll for updates if any repo is currently scanning
  useEffect(() => {
    let interval: any;
    if (repos.some(r => r.isScanning)) {
      interval = setInterval(fetchRepos, 3000);
    }
    return () => clearInterval(interval);
  }, [repos]);

  const triggerScan = async (repoId: number) => {
    try {
      setRepos(repos.map(r => r.id === repoId ? { ...r, isScanning: true } : r));
      await fetch('/api/scans', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ repoId })
      });
      // The useEffect above will handle polling until isScanning becomes false
    } catch (error) {
      console.error('Failed to trigger scan:', error);
    }
  };

  const handleConnectNew = async () => {
    const url = prompt("Enter a Git repository URL (e.g., https://github.com/expressjs/express.git):");
    if (url) {
      // Extract repo name from url (e.g. "express" from the above)
      let name = url.split('/').pop() || 'Unknown Repo';
      name = name.replace(/\.git$/, '');
      
      setIsLoading(true);
      await fetch('/api/repos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, url, lang: 'Unknown', visibility: 'Public' })
      });
      fetchRepos();
    }
  };

  return (
    <div className="pt-24 pb-12 px-container-padding-mobile md:px-container-padding-desktop w-full h-full flex flex-col max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Repositories</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Manage and monitor security posture across your connected codebases.</p>
        </div>
        <button onClick={handleConnectNew} className="flex items-center gap-2 bg-primary-container text-white px-5 py-2.5 rounded-lg font-body-sm text-body-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-primary-container/20">
          <Plus size={20} />
          Connect New Repo
        </button>
      </div>

      <div className="surface-1 rounded-xl p-4 mb-8 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input 
            className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-lg pl-10 pr-4 py-2 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
            placeholder="Search repositories..." 
            type="text" 
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-highest border border-outline-variant/30 font-body-sm text-body-sm text-on-surface-variant hover:border-outline-variant transition-colors">
            <Eye size={18} />
            Visibility
            <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-highest border border-outline-variant/30 font-body-sm text-body-sm text-on-surface-variant hover:border-outline-variant transition-colors">
            <FileCode size={18} />
            Provider
            <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-highest border border-outline-variant/30 font-body-sm text-body-sm text-on-surface-variant hover:border-outline-variant transition-colors">
            <Gauge size={18} />
            Score
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12 text-on-surface-variant">Loading repositories...</div>
        ) : repos.map(repo => (
        <div key={repo.id} className={`surface-1 rounded-xl overflow-hidden relative group hover:-translate-y-1 transition-transform duration-300 cursor-pointer ${repo.scoreColor === 'red-500' ? 'glow-critical' : repo.scoreColor === 'yellow-500' ? 'glow-medium' : ''}`} onClick={() => setSelectedRepo(repo)}>
          <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${repo.scoreColor} ${repo.isScanning ? 'opacity-50' : ''}`}></div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container-lowest/50 border border-outline-variant/30 flex items-center justify-center">
                  <Blocks className="text-on-surface" size={20} />
                </div>
                <div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold group-hover:text-primary transition-colors">{repo.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant">{repo.visibility}</span>
                    <span className="text-outline text-xs">•</span>
                    <span className="font-body-sm text-body-sm text-outline flex items-center gap-1"><Clock size={14} /> {repo.lang}</span>
                  </div>
                </div>
              </div>
              <button className="text-outline hover:text-on-surface transition-colors"><MoreVertical size={20} /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-surface-container-lowest/50 rounded-lg p-3 border border-outline-variant/20 flex items-center gap-3">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-surface-variant" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                    <path className={`text-${repo.scoreColor.split('-')[0]}-500 score-circle`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${repo.score}, 100`} strokeLinecap="round" strokeWidth="3"></path>
                  </svg>
                  <span className={`absolute font-label-caps text-label-caps font-bold text-${repo.scoreColor.split('-')[0]}-500`}>{repo.score}</span>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-outline uppercase">Health</p>
                  <p className={`font-body-sm text-body-sm text-${repo.scoreColor.split('-')[0]}-400 font-medium`}>{repo.status}</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest/50 rounded-lg p-3 border border-outline-variant/20 flex flex-col justify-center">
                <div className={`flex items-center gap-2 text-${repo.findings.crit > 0 ? 'red' : repo.findings.high > 0 ? 'yellow' : 'outline'}-400 mb-1`}>
                  <Bug size={16} />
                  <span className="font-body-sm text-body-sm font-bold">{repo.findings.crit > 0 ? `${repo.findings.crit} Crit` : repo.findings.high > 0 ? `${repo.findings.high} High` : '0 Vulns'}</span>
                </div>
                <div className={`flex items-center gap-2 ${repo.findings.secrets > 0 ? 'text-orange-400' : 'text-outline'}`}>
                  <Key size={16} />
                  <span className="font-body-sm text-body-sm font-bold">{repo.findings.secrets} Secrets</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-outline-variant/20 pt-4">
              {repo.isScanning ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 font-label-caps text-label-caps border border-blue-500/20">
                  <RefreshCw size={14} className="animate-spin" /> Scanning...
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 font-label-caps text-label-caps border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Scanned
                </span>
              )}
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-md font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-variant transition-colors cursor-pointer">Report</button>
                <button 
                  onClick={(e) => { e.stopPropagation(); triggerScan(repo.id); }}
                  disabled={repo.isScanning}
                  className={`px-3 py-1.5 rounded-md bg-primary-container/10 text-primary font-body-sm text-body-sm font-medium hover:bg-primary-container/20 transition-colors ${repo.isScanning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  Scan Now
                </button>
              </div>
            </div>
          </div>
        </div>
        ))}
      </div>
      
      <RepoDetailsDrawer repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
    </div>
  );
}
