import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info';
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleAddToast = (e: CustomEvent<Toast>) => {
      const newToast = { ...e.detail, id: Math.random().toString(36).substring(7) };
      setToasts((prev) => [...prev, newToast]);
      
      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 5000);
    };

    const handleScanUpdate = (e: CustomEvent) => {
      const { type, repoId, critical, high } = e.detail;
      if (type === 'SCAN_COMPLETED') {
        let toastType: 'success' | 'error' | 'info' = 'success';
        let title = 'Scan Completed';
        let message = `Scan finished successfully with 0 critical findings.`;
        
        if (critical > 0) {
          toastType = 'error';
          title = 'Critical Vulnerabilities Found';
          message = `Scan finished. Found ${critical} critical and ${high} high vulnerabilities.`;
        } else if (high > 0) {
          toastType = 'info';
          title = 'Vulnerabilities Found';
          message = `Scan finished. Found ${high} high vulnerabilities.`;
        }
        
        const newToast: Toast = {
          id: Math.random().toString(36).substring(7),
          type: toastType,
          title,
          message,
        };
        
        setToasts((prev) => [...prev, newToast]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, 5000);
      }
    };

    window.addEventListener('add_toast' as any, handleAddToast as any);
    window.addEventListener('scan_update' as any, handleScanUpdate as any);
    
    return () => {
      window.removeEventListener('add_toast' as any, handleAddToast as any);
      window.removeEventListener('scan_update' as any, handleScanUpdate as any);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 w-80 p-4 rounded-xl shadow-lg border backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-success/10 border-success/20 text-success shadow-success/10' 
                : toast.type === 'error'
                  ? 'bg-critical/10 border-critical/20 text-critical shadow-critical/10'
                  : 'bg-primary/10 border-primary/20 text-primary shadow-primary/10'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <div className="p-1 rounded-full bg-success/20 shadow-inner"><CheckCircle2 size={18} className="text-success" /></div>}
              {toast.type === 'error' && <div className="p-1 rounded-full bg-critical/20 shadow-inner"><AlertCircle size={18} className="text-critical" /></div>}
              {toast.type === 'info' && <div className="p-1 rounded-full bg-info/20 shadow-inner"><Info size={18} className="text-info" /></div>}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm tracking-tight">{toast.title}</h4>
              {toast.message && <p className="text-xs mt-1 opacity-90 leading-relaxed">{toast.message}</p>}
            </div>
            
            <button 
              onClick={() => removeToast(toast.id)}
              className="shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer p-1 -m-1"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
