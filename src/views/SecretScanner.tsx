import { useEffect, useState } from 'react';
import { ShieldAlert, Search, Filter, Key, CheckCircle2, AlertTriangle, ExternalLink, MoreVertical, Bot } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AIChatPanel } from '../components/AIChatPanel';

export default function SecretScanner() {
  const { token } = useAuth();
  const [secrets, setSecrets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatFinding, setChatFinding] = useState<any>(null);

  useEffect(() => {
    const fetchScans = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/scans', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const scans = await res.json();
          let allSecrets: any[] = [];
          scans.forEach((scan: any) => {
            if (scan.findingsDetail) {
              try {
                const findings = JSON.parse(scan.findingsDetail);
                const secretFindings = findings;
                

                secretFindings.forEach((f: any, i: number) => {
                  allSecrets.push({
                    id: `SEC-${scan.id}-${i}`,
                    repo: scan.repository?.name || 'Unknown',
                    repoUrl: scan.repository?.url || '',
                    type: f.type,
                    file: f.file,
                    line: f.line,
                    severity: f.severity.toLowerCase(),
                    match: f.match,
                    date: new Date(scan.createdAt).toLocaleDateString(),
                    status: 'open'
                  });
                });
              } catch (e) {}
            }
          });
          setSecrets(allSecrets);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, [token]);

  const criticalCount = secrets.filter(s => s.severity === 'critical').length;

  return (
    <div className="pt-24 pb-12 px-container-padding-mobile md:px-container-padding-desktop w-full h-full flex flex-col max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold flex items-center gap-3">
            <Key className="text-primary" size={32} />
            Secret Scanner
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Review and manage hardcoded secrets detected across your organization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-xl border border-outline-variant/30 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Key size={64} />
          </div>
          <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-2">Total Exposed Secrets</span>
          <span className="font-display-lg text-4xl font-bold text-on-surface">{secrets.length}</span>
          <span className="text-xs text-warning mt-2 flex items-center gap-1"><AlertTriangle size={12} /> Active findings</span>
        </div>
        <div className="glass-panel p-6 rounded-xl border border-outline-variant/30 flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-critical">
            <ShieldAlert size={64} />
          </div>
          <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-2">Critical Severity</span>
          <span className="font-display-lg text-4xl font-bold text-critical">{criticalCount}</span>
          <span className="text-xs text-on-surface-variant mt-2">Requires immediate rotation</span>
        </div>
        <div className="glass-panel p-6 rounded-xl border border-outline-variant/30 flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-success">
            <CheckCircle2 size={64} />
          </div>
          <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-2">Resolved</span>
          <span className="font-display-lg text-4xl font-bold text-success">0</span>
          <span className="text-xs text-success mt-2">Historically mitigated</span>
        </div>
      </div>

      <div className="glass-panel rounded-xl flex flex-col overflow-hidden shadow-lg border border-outline-variant/30 flex-1">
        <div className="p-4 border-b border-outline-variant/30 flex flex-wrap gap-4 items-center justify-between bg-surface-container-lowest/30">
          <div className="relative flex-1 min-w-[250px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
            <input 
              type="text" 
              placeholder="Search by repository, secret type, or file..." 
              className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-highest border border-outline-variant/30 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
              <Filter size={16} />
              Status: Open
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-highest/20 text-xs uppercase font-label-caps tracking-wider text-on-surface-variant">
                <th className="p-4 font-medium">Secret details</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Severity</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-sm">
              {loading ? (
                 <tr>
                    <td colSpan={5} className="p-12 text-center text-on-surface-variant">Loading secrets...</td>
                 </tr>
              ) : secrets.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="p-12 text-center text-on-surface-variant">No secrets found in recent scans.</td>
                 </tr>
              ) : secrets.map((secret) => (
                <tr key={secret.id} className="hover:bg-surface-variant/20 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-on-surface mb-1">{secret.type}</div>
                    <div className="text-xs text-on-surface-variant flex items-center gap-2">
                       <span className="font-code-sm text-primary">{secret.id}</span>
                       <span>•</span>
                       <span>Found {secret.date}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-on-surface mb-1">{secret.repo}</div>
                    <div className="text-xs text-on-surface-variant font-code-sm">{secret.file} <span className="opacity-50">:{secret.line}</span></div>
                  </td>
                  <td className="p-4">
                    {secret.severity === 'critical' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-critical-subtle text-critical border border-critical/20">CRITICAL</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-warning-subtle text-warning border border-warning/20">{secret.severity.toUpperCase()}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {secret.status === 'open' && (
                       <span className="inline-flex items-center gap-1.5 text-warning font-medium text-xs">
                          <AlertTriangle size={14} /> Open
                       </span>
                    )}
                    {secret.status === 'resolved' && (
                       <span className="inline-flex items-center gap-1.5 text-success font-medium text-xs">
                          <CheckCircle2 size={14} /> Resolved
                       </span>
                    )}
                    {secret.status === 'ignored' && (
                       <span className="inline-flex items-center gap-1.5 text-on-surface-variant font-medium text-xs">
                          <AlertTriangle size={14} className="opacity-50" /> Ignored
                       </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                     <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { 
                            setChatFinding({ file: secret.file, line: secret.line, type: secret.type, match: secret.match || '...', repoUrl: secret.repoUrl }); 
                            setChatOpen(true); 
                          }}
                          className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-medium rounded transition-colors cursor-pointer border border-emerald-500/30 flex items-center gap-1">
                           <Bot size={14} /> Ask AI
                        </button>
                        {secret.status === 'open' && (
                           <button className="px-3 py-1.5 bg-surface-variant hover:bg-surface-variant/80 text-on-surface text-xs font-medium rounded transition-colors cursor-pointer border border-outline-variant/30">
                              Revoke
                           </button>
                        )}
                        <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer rounded hover:bg-surface-variant">
                          <MoreVertical size={16} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <AIChatPanel 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
        finding={chatFinding} 
      />
    </div>
  );
}
