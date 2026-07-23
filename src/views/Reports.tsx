import { BarChart, Download, FileText, Calendar, Filter } from 'lucide-react';
import Tooltip from '../components/Tooltip';

export default function Reports() {
  const reports = [
    { id: 'rep-001', name: 'Weekly Security Summary', date: 'Oct 24, 2026', type: 'PDF', size: '2.4 MB' },
    { id: 'rep-002', name: 'Compliance Audit - SOC2', date: 'Oct 20, 2026', type: 'CSV', size: '1.1 MB' },
    { id: 'rep-003', name: 'Dependency Vulnerability Trend', date: 'Oct 15, 2026', type: 'PDF', size: '3.8 MB' },
    { id: 'rep-004', name: 'Exposed Secrets Ledger', date: 'Oct 10, 2026', type: 'CSV', size: '542 KB' },
  ];

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
            {[35, 42, 28, 45, 52, 38, 25, 20, 15, 12].map((height, i) => (
              <Tooltip key={i} content={`Oct ${i * 3 + 1}: ${height} issues`}>
                <div className="flex-1 w-full bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-colors cursor-crosshair" style={{ height: `${height}%`, minWidth: '16px' }}></div>
              </Tooltip>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-on-surface-variant">
            <span>Oct 1</span>
            <span>Oct 30</span>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl border border-outline-variant/30 cursor-default">
          <h3 className="font-semibold text-on-surface mb-4">Severity Distribution</h3>
          <div className="flex h-32 items-center justify-center gap-6">
            <Tooltip content="Critical: 12, High: 25, Medium: 43">
              <div className="relative w-24 h-24 rounded-full border-[8px] border-critical flex items-center justify-center cursor-help">
                <span className="text-xl font-bold text-on-surface">12</span>
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
                    <button className="p-2 hover:bg-surface-variant text-on-surface-variant hover:text-primary rounded transition-colors cursor-pointer inline-flex">
                      <Download size={18} />
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
