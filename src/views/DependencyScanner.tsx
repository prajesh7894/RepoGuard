import { Network, Search, Filter, ShieldAlert, ArrowUpCircle, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function DependencyScanner() {
  const vulnerabilities = [
    { id: 'CVE-2023-4412', pkg: 'lodash', current: '4.17.20', fixed: '4.17.21', repo: 'acme-corp/payment-gateway', severity: 'critical', type: 'Prototype Pollution' },
    { id: 'CVE-2022-29078', pkg: 'ejs', current: '3.1.6', fixed: '3.1.7', repo: 'frontend-webapp', severity: 'high', type: 'Remote Code Execution' },
    { id: 'CVE-2023-26115', pkg: 'word-wrap', current: '1.2.3', fixed: '1.2.4', repo: 'acme-corp/user-auth-service', severity: 'medium', type: 'ReDoS' },
    { id: 'CVE-2024-28176', pkg: 'jose', current: '4.14.4', fixed: '4.15.5', repo: 'acme-corp/payment-gateway', severity: 'high', type: 'Algorithm Confusion' },
    { id: 'CVE-2021-3918', pkg: 'json-schema', current: '0.2.3', fixed: '0.4.0', repo: 'data-pipeline-etl', severity: 'critical', type: 'Prototype Pollution' },
  ];

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
         <div className="glass-panel p-5 rounded-xl border border-outline-variant/30 flex items-center justify-between col-span-1 lg:col-span-2">
            <div>
               <h3 className="text-on-surface font-semibold mb-1">Automated Fixes</h3>
               <p className="text-sm text-on-surface-variant mb-4">RepoGuard can automatically generate Pull Requests to bump vulnerable dependencies.</p>
               <button className="bg-primary-container text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-container/90 transition-colors cursor-pointer flex items-center gap-2">
                  Enable Auto-PRs
               </button>
            </div>
            <div className="w-24 h-24 bg-primary-container/10 rounded-full flex items-center justify-center border border-primary/20">
               <ArrowUpCircle size={40} className="text-primary" />
            </div>
         </div>
         <div className="glass-panel p-5 rounded-xl border border-outline-variant/30 flex flex-col justify-center">
            <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-1">Vulnerable Packages</span>
            <span className="font-display-lg text-3xl font-bold text-on-surface">42</span>
         </div>
         <div className="glass-panel p-5 rounded-xl border border-outline-variant/30 flex flex-col justify-center">
            <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider mb-1">Critical CVEs</span>
            <span className="font-display-lg text-3xl font-bold text-critical">12</span>
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
                <th className="p-4 font-medium">Package</th>
                <th className="p-4 font-medium">Repository</th>
                <th className="p-4 font-medium">Severity</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-sm">
              {vulnerabilities.map((vuln) => (
                <tr key={vuln.id} className="hover:bg-surface-variant/20 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-on-surface flex items-center gap-2 mb-1">
                       {vuln.id}
                       <a href="#" className="text-primary hover:text-primary-fixed cursor-pointer"><ExternalLink size={12} /></a>
                    </div>
                    <div className="text-xs text-on-surface-variant">{vuln.type}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-code-sm text-on-surface mb-1 bg-surface-container px-2 py-0.5 rounded border border-outline-variant/30 inline-block">{vuln.pkg}</div>
                    <div className="text-xs text-on-surface-variant mt-1">
                       <span className="text-critical">{vuln.current}</span> → <span className="text-success font-medium">{vuln.fixed}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-on-surface">{vuln.repo}</div>
                  </td>
                  <td className="p-4">
                    {vuln.severity === 'critical' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-critical-subtle text-critical border border-critical/20">CRITICAL</span>
                    ) : vuln.severity === 'high' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-warning-subtle text-warning border border-warning/20">HIGH</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-secondary/10 text-secondary border border-secondary/20">MEDIUM</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                     <button className="px-3 py-1.5 bg-surface-variant hover:bg-surface-variant/80 text-on-surface text-xs font-medium rounded transition-colors cursor-pointer border border-outline-variant/30 flex items-center gap-1.5 ml-auto">
                        <ArrowUpCircle size={14} className="text-primary" />
                        Generate PR
                     </button>
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
