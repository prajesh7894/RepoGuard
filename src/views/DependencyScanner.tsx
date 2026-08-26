import { useEffect, useState } from 'react';
import { Search, Filter, ShieldAlert, Network, CheckCircle2, AlertTriangle, ArrowUpRight, MoreVertical, ArrowUpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function DependencyScanner() {
  const { token } = useAuth();
  const [dependencies, setDependencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fixing, setFixing] = useState<Record<string, boolean>>({});

  const handleFixPR = (depId: string) => {
    setFixing(prev => ({ ...prev, [depId]: true }));
    setTimeout(() => {
      setDependencies(prev => prev.map(d => 
        d.id === depId ? { ...d, status: 'patched' } : d
      ));
      setFixing(prev => ({ ...prev, [depId]: false }));
      alert("Mock PR created successfully to update this dependency!");
    }, 1500);
  };

  const [autoPREnabled, setAutoPREnabled] = useState(false);

  useEffect(() => {
    const fetchScans = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/scans', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const scans = await res.json();
          let allDeps: any[] = [];
          scans.forEach((scan: any) => {
            if (scan.findingsDetail) {
              try {
                const findings = JSON.parse(scan.findingsDetail);
                const depFindings = findings.filter((f: any) => 
                  f.type?.toLowerCase().includes('dependency') || 
                  f.type?.toLowerCase().includes('cve') ||
                  !f.type?.toLowerCase().includes('secret')
                );
                
                depFindings.forEach((f: any, i: number) => {
                  allDeps.push({
                    id: `DEP-${scan.id}-${i}`,
                    package: f.match ? f.match.substring(0, 20) + '...' : f.type,
                    version: 'unknown',
                    repo: scan.repository?.name || 'Unknown',
                    cve: f.type,
                    severity: f.severity.toLowerCase(),
                    status: 'vulnerable',
                    fixedIn: 'Upgrade recommended',
                    date: new Date(scan.createdAt).toLocaleDateString()
                  });
                });
              } catch (e) {}
            }
          });
          // Limit to 100 findings to prevent React from lagging/hanging
          setDependencies(allDeps.slice(0, 100));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, [token]);

  const criticalCount = dependencies.filter(d => d.severity === 'critical').length;

  return (
    <div className="pt-24 pb-12 px-container-padding-mobile md:px-container-padding-desktop w-full h-full flex flex-col max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold flex items-center gap-3">
            <Network className="text-secondary" size={32} />
            Dependency Scanner (SCA)
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Manage known vulnerabilities (CVEs) in open-source libraries and packages.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
         <div className="glass-panel p-5 rounded-xl border border-outline-variant/30 flex items-center justify-between col-span-1 lg:col-span-1">
            <div>
               <h3 className="text-on-surface font-semibold mb-1">Automated Fixes</h3>
               <p className="text-sm text-on-surface-variant mb-4">RepoGuard can automatically generate Pull Requests.</p>
               <button 
                 onClick={() => {
                   setAutoPREnabled(!autoPREnabled);
                   alert(autoPREnabled ? "Automated PRs disabled." : "Automated PRs enabled! RepoGuard will now monitor and patch vulnerabilities automatically.");
                 }}
                 className={`${autoPREnabled ? 'bg-success text-on-success hover:bg-success/90' : 'bg-primary-container text-white hover:bg-primary-container/90'} px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2`}
               >
                  {autoPREnabled ? "Auto-PRs Enabled" : "Enable Auto-PRs"}
               </button>
            </div>
         </div>
         <div className="glass-panel p-5 rounded-xl border border-outline-variant/30 flex flex-col justify-center">
            <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-2">Total Vulnerabilities</span>
            <span className="font-display-lg text-4xl font-bold text-on-surface">{dependencies.length}</span>
            <span className="text-xs text-warning mt-2 flex items-center gap-1"><AlertTriangle size={12} /> Active issues</span>
         </div>
         <div className="glass-panel p-6 rounded-xl border border-outline-variant/30 flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-critical">
            <ShieldAlert size={64} />
          </div>
          <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-2">Critical Severity</span>
          <span className="font-display-lg text-4xl font-bold text-critical">{criticalCount}</span>
          <span className="text-xs text-on-surface-variant mt-2">Requires immediate patch</span>
        </div>
        <div className="glass-panel p-6 rounded-xl border border-outline-variant/30 flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-success">
            <CheckCircle2 size={64} />
          </div>
          <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-2">Patched</span>
          <span className="font-display-lg text-4xl font-bold text-success">0</span>
          <span className="text-xs text-success mt-2">Automated PRs merged</span>
        </div>
      </div>

      <div className="glass-panel rounded-xl flex flex-col overflow-hidden shadow-lg border border-outline-variant/30 flex-1">
        <div className="p-4 border-b border-outline-variant/30 flex flex-wrap gap-4 items-center justify-between bg-surface-container-lowest/30">
          <div className="relative flex-1 min-w-[250px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
            <input 
              type="text" 
              placeholder="Search by package, CVE, or repository..." 
              className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-highest border border-outline-variant/30 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
              <Filter size={16} />
              Severity: All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-highest/20 text-xs uppercase font-label-caps tracking-wider text-on-surface-variant">
                <th className="p-4 font-medium">Vulnerability</th>
                <th className="p-4 font-medium">Repository</th>
                <th className="p-4 font-medium">Severity</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-sm">
              {loading ? (
                 <tr>
                    <td colSpan={5} className="p-12 text-center text-on-surface-variant">Loading dependencies...</td>
                 </tr>
              ) : dependencies.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="p-12 text-center text-on-surface-variant">No dependency vulnerabilities found in recent scans.</td>
                 </tr>
              ) : dependencies.map((dep) => (
                <tr key={dep.id} className="hover:bg-surface-variant/20 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-on-surface mb-1 flex items-center gap-2">
                       {dep.package}
                    </div>
                    <div className="text-xs text-on-surface-variant">
                       Current: <span className="font-code-sm">{dep.version}</span> • Fixed in: <span className="font-code-sm text-success">{dep.fixedIn}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-on-surface mb-1">{dep.repo}</div>
                    <div className="text-xs text-on-surface-variant font-code-sm">{dep.cve !== 'None' ? dep.cve : 'No CVE'}</div>
                  </td>
                  <td className="p-4">
                    {dep.severity === 'critical' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-critical-subtle text-critical border border-critical/20">CRITICAL</span>
                    ) : dep.severity === 'high' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-warning-subtle text-warning border border-warning/20">HIGH</span>
                    ) : dep.severity === 'medium' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-secondary-container text-on-secondary-container border border-secondary/20">MEDIUM</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-success-subtle text-success border border-success/20">SAFE</span>
                    )}
                  </td>
                  <td className="p-4">
                    {dep.status === 'vulnerable' && (
                       <span className="inline-flex items-center gap-1.5 text-warning font-medium text-xs">
                          <AlertTriangle size={14} /> Vulnerable
                       </span>
                    )}
                    {dep.status === 'patched' && (
                       <span className="inline-flex items-center gap-1.5 text-success font-medium text-xs">
                          <CheckCircle2 size={14} /> Patched
                       </span>
                    )}
                    {dep.status === 'safe' && (
                       <span className="inline-flex items-center gap-1.5 text-success font-medium text-xs">
                          <CheckCircle2 size={14} /> Secure
                       </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                     <div className="flex justify-end gap-2">
                        {dep.status === 'vulnerable' && (
                           <button 
                             onClick={() => handleFixPR(dep.id)}
                             disabled={fixing[dep.id]}
                             className="px-3 py-1.5 bg-primary-container hover:bg-primary-container/90 text-white text-xs font-medium rounded transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(37,99,235,0.2)] disabled:opacity-50"
                           >
                              {fixing[dep.id] ? 'Fixing...' : 'Fix PR'} {fixing[dep.id] ? null : <ArrowUpRight size={14} />}
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
    </div>
  );
}
