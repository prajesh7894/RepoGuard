import { Bell, CheckCircle2, ShieldAlert, ArrowUpCircle, Info, Settings as SettingsIcon } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    { id: 1, type: 'critical', title: 'Critical Vulnerability Found', message: 'CVE-2023-4412 (Prototype Pollution) detected in acme-corp/payment-gateway.', time: '10 minutes ago', unread: true, icon: ShieldAlert },
    { id: 2, type: 'success', title: 'Scan Completed Successfully', message: 'Manual security scan for frontend-webapp finished with 0 critical findings.', time: '2 hours ago', unread: true, icon: CheckCircle2 },
    { id: 3, type: 'info', title: 'Automated PR Created', message: 'RepoGuard automatically opened a PR to bump lodash from 4.17.20 to 4.17.21.', time: '3 hours ago', unread: false, icon: ArrowUpCircle },
    { id: 4, type: 'warning', title: 'New Secret Exposed', message: 'A potential AWS Access Key was found in a recent commit to data-pipeline-etl.', time: '1 day ago', unread: false, icon: ShieldAlert },
    { id: 5, type: 'system', title: 'System Update', message: 'AI Security Review engine was updated to v2.4 with improved logic detection.', time: '2 days ago', unread: false, icon: Info },
  ];

  return (
    <div className="pt-24 pb-12 px-container-padding-mobile md:px-container-padding-desktop w-full h-full flex flex-col max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold flex items-center gap-3">
            <Bell className="text-primary" size={32} />
            Notifications
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Stay updated on security alerts and system activities.</p>
        </div>
        <button className="text-primary hover:text-primary-fixed transition-colors text-sm font-medium">
          Mark all as read
        </button>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden shadow-lg border border-outline-variant/30">
        <div className="divide-y divide-outline-variant/20">
          {notifications.map((note) => (
            <div key={note.id} className={`p-6 flex gap-4 transition-colors ${note.unread ? 'bg-surface-variant/10' : 'hover:bg-surface-container-lowest/30'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${
                note.type === 'critical' || note.type === 'warning' ? 'bg-critical-subtle/20 text-critical border-critical/30' :
                note.type === 'success' ? 'bg-success-subtle/20 text-success border-success/30' :
                'bg-primary-container/20 text-primary border-primary/30'
              }`}>
                <note.icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className={`font-medium ${note.unread ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                    {note.title}
                  </h3>
                  <span className="text-xs text-on-surface-variant shrink-0">{note.time}</span>
                </div>
                <p className="text-sm text-on-surface-variant mb-3">{note.message}</p>
                {note.type === 'critical' && (
                  <button className="text-xs font-medium bg-primary-container text-white px-3 py-1.5 rounded hover:bg-primary-container/90 transition-colors cursor-pointer">
                    View Details
                  </button>
                )}
                {note.type === 'info' && (
                  <button className="text-xs font-medium border border-outline-variant/30 text-on-surface px-3 py-1.5 rounded hover:bg-surface-variant transition-colors cursor-pointer">
                    Review PR
                  </button>
                )}
              </div>
              {note.unread && (
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              )}
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-outline-variant/30 bg-surface-container-lowest/50 text-center">
          <button className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
            View Older Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
