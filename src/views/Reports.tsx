import { useEffect, useState } from 'react';
import { BarChart, Download, FileText, Calendar, Filter } from 'lucide-react';
import Tooltip from '../components/Tooltip';
import { useAuth } from '../contexts/AuthContext';

export default function Reports() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/reports/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
        
        // Also fetch scans for the reports table
        const scanRes = await fetch('/api/scans', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (scanRes.ok) {
          const scanData = await res.json();
          const generatedReports = scanData.slice(0, 10).map((scan: any) => ({
             id: `rep-${scan.id}`,
             name: `Scan Report - ${scan.repository?.name || 'Unknown'}`,
             date: new Date(scan.createdAt).toLocaleDateString(),
             type: 'JSON',
             size: '12 KB',
             scan: scan
          }));
          setReports(generatedReports);
        }
      } catch (e) {
        console.error("Failed to load reports", e);
      }
    };
    fetchAnalytics();
  }, [token]);



  return (
    <div className="pt-24 pb-12 px-container-padding-mobile md:px-container-padding-desktop w-full h-full flex flex-col max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold flex items-center gap-3">
            <BarChart className="text-primary" size={32} />
            Reports & Analytics
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Generate, schedule, and export security compliance reports.</p>
        </div>
        <button className="bg-primary-container text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-container/90 transition-colors cursor-pointer flex items-center gap-2 shadow-[0_0_10px_rgba(37,99,235,0.2)]">
          Generate New Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 rounded-xl border border-outline-variant/30 cursor-default">
          <h3 className="font-semibold text-on-surface mb-4">Vulnerability Trend (30 Days)</h3>
          <div className="h-32 flex items-end gap-2">
            {analytics?.trend ? analytics.trend.map((height: number, i: number) => (
              <Tooltip key={i} content={`Report ${i + 1}: ${height} issues`}>
                <div className="flex-1 w-full bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-colors cursor-crosshair" style={{ height: `${Math.min(100, Math.max(10, height * 5))}%`, minWidth: '16px' }}></div>
              </Tooltip>
            )) : (
               <div className="flex-1 w-full flex items-center justify-center text-sm text-on-surface-variant">Loading...</div>
            )}
          </div>
          <div className="flex justify-between mt-2 text-xs text-on-surface-variant">
            <span>Past Scans</span>
            <span>Recent</span>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl border border-outline-variant/30 cursor-default">
          <h3 className="font-semibold text-on-surface mb-4">Severity Distribution</h3>
          <div className="flex h-32 items-center justify-center gap-6">
            <Tooltip content={analytics ? `Critical: ${analytics.severity.critical}, High: ${analytics.severity.high}, Medium: ${analytics.severity.medium}` : "Loading"}>
              <div className="relative w-24 h-24 rounded-full border-[8px] border-critical flex items-center justify-center cursor-help">
                <span className="text-xl font-bold text-on-surface">{analytics?.severity?.critical || 0}</span>
              </div>
            </Tooltip>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-critical"></div> Critical</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-warning"></div> High</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-secondary"></div> Medium</div>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-center cursor-default">
           <h3 className="font-semibold text-on-surface mb-2">Scheduled Reports</h3>
           <p className="text-sm text-on-surface-variant mb-4">2 active schedules</p>
           <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-surface-variant/20 rounded border border-outline-variant/20">
                 <span className="text-sm font-medium">Weekly Executive</span>
                 <span className="text-xs text-on-surface-variant flex items-center gap-1"><Calendar size={12}/> Mondays</span>
              </div>
           </div>
        </div>
      </div>

      <div className="glass-card rounded-xl flex flex-col overflow-hidden shadow-lg border border-outline-variant/30 flex-1">
        <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest/30">
          <h3 className="font-semibold text-on-surface">Recent Reports</h3>
          <button className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-highest/20 text-xs uppercase font-label-caps tracking-wider text-on-surface-variant">
                <th className="p-4 font-medium">Report Name</th>
                <th className="p-4 font-medium">Date Generated</th>
                <th className="p-4 font-medium">Format</th>
                <th className="p-4 font-medium">Size</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-sm">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-surface-variant/20 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-on-surface flex items-center gap-2">
                      <FileText size={16} className="text-primary" />
                      {report.name}
                    </div>
                  </td>
                  <td className="p-4 text-on-surface-variant">{report.date}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-surface-variant/50 text-xs font-medium border border-outline-variant/20">{report.type}</span>
                  </td>
                  <td className="p-4 text-on-surface-variant">{report.size}</td>
                  <td className="p-4 text-right">
                    <a href={`/api/scans/${report.scan.id}/export/json`} download className="p-2 hover:bg-surface-variant text-on-surface-variant hover:text-primary rounded transition-colors cursor-pointer inline-flex" title="Download JSON Report">
                      <Download size={18} />
                    </a>
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
