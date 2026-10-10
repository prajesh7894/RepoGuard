import { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Download, 
  User, 
  Settings, 
  Key, 
  ShieldCheck, 
  GitMerge, 
  Activity,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

// Mock data for Audit Logs
const mockLogs = [
  {
    id: 'log-1',
    timestamp: '2026-09-05T14:32:45Z',
    actor: 'admin@repoguard.dev',
    event: 'secrets.auto_rotate',
    resource: 'AWS_ACCESS_KEY_ID',
    ipAddress: '192.168.1.105',
    status: 'success'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-05T12:15:10Z',
    actor: 'system',
    event: 'scan.completed',
    resource: 'frontend-monorepo',
    ipAddress: 'internal',
    status: 'success'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-05T09:45:22Z',
    actor: 'j.doe@company.com',
    event: 'settings.updated',
    resource: 'compliance.soc2',
    ipAddress: '10.0.0.42',
    status: 'success'
  },
  {
    id: 'log-4',
    timestamp: '2026-09-04T18:20:05Z',
    actor: 'admin@repoguard.dev',
    event: 'pr.merged',
    resource: 'PR #42 - Bump lodash',
    ipAddress: '192.168.1.105',
    status: 'success'
  },
  {
    id: 'log-5',
    timestamp: '2026-09-04T15:10:33Z',
    actor: 'unknown',
    event: 'auth.login.failed',
    resource: 'admin@repoguard.dev',
    ipAddress: '45.22.11.89',
    status: 'failure'
  }
];

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const getEventIcon = (event: string) => {
    if (event.includes('secrets')) return <Key size={16} className="text-primary" />;
    if (event.includes('scan')) return <Activity size={16} className="text-secondary" />;
    if (event.includes('settings')) return <Settings size={16} className="text-on-surface-variant" />;
    if (event.includes('pr')) return <GitMerge size={16} className="text-primary" />;
    if (event.includes('auth')) return <User size={16} className="text-warning" />;
    return <ShieldCheck size={16} className="text-primary" />;
  };

  const filteredLogs = mockLogs.filter(log => 
    log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-6 px-4 md:px-8 max-w-7xl mx-auto space-y-6 flex-1 flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
            <ClipboardList className="text-primary" />
            Audit Logs
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Immutable ledger of all user actions and system events. Required for SOC2 compliance.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg border border-outline-variant/30 text-on-surface text-sm font-medium hover:bg-surface-variant transition-colors">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-container text-white rounded-lg border border-primary text-sm font-bold shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-panel p-4 rounded-xl border border-outline-variant/30 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
          <input
            type="text"
            placeholder="Search logs by event, actor, or resource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/30 rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="text-sm font-code-sm text-on-surface-variant bg-surface-variant px-3 py-1.5 rounded-lg border border-outline-variant/30">
          Total Entries: {mockLogs.length}
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-xl border border-outline-variant/30 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container/50">
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Event</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Actor</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Resource</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredLogs.map((log, index) => (
                <motion.tr 
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-surface-variant/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="font-code-sm text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-surface-container border border-outline-variant/30 flex items-center justify-center">
                        {getEventIcon(log.event)}
                      </div>
                      <span className="font-code-sm text-sm text-on-surface">{log.event}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center">
                        <User size={12} className="text-on-surface-variant" />
                      </div>
                      <span className="text-sm font-medium text-on-surface">{log.actor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant truncate max-w-[200px]" title={log.resource}>
                    {log.resource}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-code-sm text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded border border-outline-variant/30">
                      {log.ipAddress}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {log.status === 'success' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-secondary/10 text-secondary border border-secondary/20">
                        Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-critical/10 text-critical border border-critical/20">
                        <AlertCircle size={12} />
                        Failed
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                    No logs found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
