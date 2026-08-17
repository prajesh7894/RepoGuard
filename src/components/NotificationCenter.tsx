import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info, ShieldAlert, CheckCircle2, AlertTriangle, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, unread: false })));
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle2 className="text-success" size={20} />;
      case 'critical': return <ShieldAlert className="text-critical" size={20} />;
      case 'warning': return <AlertTriangle className="text-warning" size={20} />;
      case 'system': return <Settings className="text-primary" size={20} />;
      default: return <Info className="text-primary" size={20} />;
    }
  };

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-variant/50 transition-colors cursor-pointer"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface animate-pulse shadow-critical-glow"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 max-h-96 bg-surface-container-highest border border-outline-variant/30 rounded-xl shadow-2xl overflow-hidden flex flex-col z-50 glass-card"
          >
            <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container">
              <h3 className="font-title-md font-semibold text-on-surface">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer">
                  <Check size={14} /> Mark all read
                </button>
              )}
            </div>
            
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant flex flex-col items-center">
                  <Bell size={32} className="opacity-20 mb-3" />
                  <p className="text-sm">You're all caught up!</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 border-b border-outline-variant/10 flex gap-3 hover:bg-surface-variant/20 transition-colors ${notif.unread ? 'bg-primary-container/5' : ''}`}>
                    <div className="mt-0.5 flex-shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${notif.unread ? 'font-semibold text-on-surface' : 'font-medium text-on-surface-variant'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-on-surface-variant/80 mt-1 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-on-surface-variant/50 mt-2 font-mono">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>
                    {notif.unread && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
