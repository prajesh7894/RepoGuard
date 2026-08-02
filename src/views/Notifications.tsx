import { useEffect, useState } from 'react';
import { Bell, CheckCircle2, ShieldAlert, ArrowUpCircle, Info, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  unread: boolean;
}

export default function Notifications() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const markAllAsRead = async () => {
    if (!token) return;
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    if (type === 'critical' || type === 'warning') return ShieldAlert;
    if (type === 'success') return CheckCircle2;
    if (type === 'info') return ArrowUpCircle;
    return Info;
  };

  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

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
        <button onClick={markAllAsRead} className="text-primary hover:text-primary-fixed transition-colors text-sm font-medium">
          Mark all as read
        </button>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden shadow-lg border border-outline-variant/30">
        <div className="divide-y divide-outline-variant/20">
          {loading ? (
             <div className="p-12 text-center text-on-surface-variant">Loading notifications...</div>
          ) : notifications.length === 0 ? (
             <div className="p-12 text-center text-on-surface-variant">No notifications to show.</div>
          ) : notifications.map((note) => {
            const Icon = getIcon(note.type);
            return (
            <div key={note.id} className={`p-6 flex gap-4 transition-colors ${note.unread ? 'bg-surface-variant/10' : 'hover:bg-surface-container-lowest/30'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${
                note.type === 'critical' || note.type === 'warning' ? 'bg-critical-subtle/20 text-critical border-critical/30' :
                note.type === 'success' ? 'bg-success-subtle/20 text-success border-success/30' :
                'bg-primary-container/20 text-primary border-primary/30'
              }`}>
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className={`font-medium ${note.unread ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                    {note.title}
                  </h3>
                  <span className="text-xs text-on-surface-variant shrink-0">{getTimeAgo(note.createdAt)}</span>
                </div>
                <p className="text-sm text-on-surface-variant mb-3">{note.message}</p>
              </div>
              {note.unread && (
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              )}
            </div>
            );
          })}
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
