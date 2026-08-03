import { useState, useEffect } from 'react';
import { Search, Filter, Download, ChevronDown, MoreHorizontal, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ScanHistory() {
  const [scans, setScans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { token } = useAuth();

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await fetch('/api/scans', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch scans");
        const data = await res.json();
        setScans(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch scans:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      fetchScans();
    }
  }, [token]);

  return (
    <div className="pt-24 pb-12 px-container-padding-mobile md:px-container-padding-desktop w-full h-full flex flex-col max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Scan History</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Review past security audits and export compliance reports.</p>
        </div>
        <button className="flex items-center gap-2 bg-surface-variant text-on-surface px-5 py-2.5 rounded-lg font-body-sm text-body-sm font-medium hover:bg-surface-variant/80 transition-colors border border-outline-variant/30 cursor-pointer">
          <Download size={18} />
          Export All (CSV)
        </button>
      </div>

      <div className="glass-panel rounded-xl flex flex-col overflow-hidden shadow-lg border border-outline-variant/30">
        <div className="p-4 border-b border-outline-variant/30 flex flex-wrap gap-4 items-center justify-between bg-surface-container-lowest/30">
          <div className="relative flex-1 min-w-[250px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
            <input 
              type="text" 
              placeholder="Search by repository, hash, or status..." 
              className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-highest border border-outline-variant/30 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
              <Filter size={16} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-highest border border-outline-variant/30 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
              Date: Last 30 Days
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-highest/20 text-xs uppercase font-label-caps tracking-wider text-on-surface-variant">
                <th className="p-4 font-medium">Scan ID / Date</th>
                <th className="p-4 font-medium">Repository</th>
                <th className="p-4 font-medium">Branch/Ref</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Findings</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                    Loading scan history...
                  </td>
                </tr>
              ) : scans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                    No scan history available.
                  </td>
                </tr>
              ) : scans.map((scan) => {
                const date = new Date(scan.createdAt);
                
                return (
                <tr key={scan.id} className="hover:bg-surface-variant/20 transition-colors">
                  <td className="p-4">
                    <div className="font-code-sm text-primary">SCN-{scan.id.toString().padStart(4, '0')}</div>
                    <div className="text-xs text-on-surface-variant mt-1">{date.toLocaleString()}</div>
                  </td>
                  <td className="p-4 font-medium text-on-surface">{scan.repository?.name || 'Unknown'}</td>
                  <td className="p-4">
                    <span className="font-code-sm px-2 py-1 bg-surface-variant rounded text-xs text-on-surface-variant">main</span>
                  </td>
                  <td className="p-4">
                    {scan.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium border border-success/20">
                        <CheckCircle2 size={14} />
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-critical/10 text-critical text-xs font-medium border border-critical/20">
                        <XCircle size={14} />
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {scan.critical > 0 && <span className="text-xs font-bold text-critical bg-critical/10 px-2 py-0.5 rounded border border-critical/20">{scan.critical} C</span>}
                      {scan.high > 0 && <span className="text-xs font-bold text-warning bg-warning/10 px-2 py-0.5 rounded border border-warning/20">{scan.high} H</span>}
                      {scan.critical === 0 && scan.high === 0 && <span className="text-xs text-on-surface-variant">-</span>}
                    </div>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-1">
                    <a 
                      href={`/api/scans/${scan.id}/export/json`} 
                      download
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer rounded-full hover:bg-surface-variant inline-block"
                      title="Download JSON Report"
                    >
                      <Download size={16} />
                    </a>
                    <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer rounded-full hover:bg-surface-variant">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-outline-variant/30 flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-container-lowest/30 text-sm text-on-surface-variant">
          <div>Showing 1 to {scans.length} of {scans.length} results</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border border-outline-variant/30 hover:bg-surface-variant transition-colors cursor-pointer disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 rounded border border-outline-variant/30 hover:bg-surface-variant transition-colors cursor-pointer">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
