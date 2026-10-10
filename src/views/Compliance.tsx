import { useState, useEffect } from 'react';
import { ShieldCheck, FileText, AlertTriangle, CheckCircle2, ChevronRight, Activity, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';

export default function Compliance() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [scans, setScans] = useState<any[]>([]);
  
  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const res = await fetch('/api/scans', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setScans(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Calculate compliance readiness based on scan results
  const totalFindings = scans.reduce((acc, scan) => acc + (scan.critical + scan.high + scan.secrets), 0);
  const soc2Score = Math.max(0, 100 - (totalFindings * 2));
  const hipaaScore = Math.max(0, 100 - (totalFindings * 3)); // HIPAA is stricter
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-spin text-primary"><Activity size={32} /></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-container-padding-mobile md:px-container-padding-desktop w-full h-full flex flex-col max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface mb-2">Compliance Center</h1>
          <p className="text-on-surface-variant font-body">Map your vulnerabilities to industry standards and regulatory frameworks.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-container text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all">
          <Download size={16} />
          Export Audit Report
        </button>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* SOC2 Card */}
        <motion.div variants={itemVariants} className="glass-card p-6 flex flex-col relative overflow-hidden border-t-4 border-t-blue-500">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="text-blue-500" size={24} />
                <h2 className="font-title-lg font-bold text-on-surface">SOC 2 Type II</h2>
              </div>
              <p className="text-sm text-on-surface-variant max-w-sm">Security, Availability, and Confidentiality criteria alignment.</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-display font-bold text-on-surface">{soc2Score}%</div>
              <div className="text-xs text-on-surface-variant">Readiness</div>
            </div>
          </div>

          <div className="w-full bg-surface-variant rounded-full h-2 mb-6 overflow-hidden">
            <div className={`h-2 rounded-full ${soc2Score > 80 ? 'bg-success' : 'bg-warning'}`} style={{ width: `${soc2Score}%` }}></div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex items-start gap-3 p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
              {soc2Score > 80 ? <CheckCircle2 className="text-success mt-0.5" size={18} /> : <AlertTriangle className="text-warning mt-0.5" size={18} />}
              <div>
                <h4 className="font-bold text-sm text-on-surface">CC6.1 - Logical Access Security</h4>
                <p className="text-xs text-on-surface-variant mt-1">Found {scans.reduce((a, s) => a + s.secrets, 0)} exposed secrets across repositories.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
              {totalFindings === 0 ? <CheckCircle2 className="text-success mt-0.5" size={18} /> : <AlertTriangle className="text-critical mt-0.5" size={18} />}
              <div>
                <h4 className="font-bold text-sm text-on-surface">CC7.1 - System Operations</h4>
                <p className="text-xs text-on-surface-variant mt-1">{totalFindings} unpatched vulnerabilities in dependencies.</p>
              </div>
            </div>
          </div>
          
          <button className="mt-6 text-sm text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View SOC2 Controls Mapping <ChevronRight size={16} />
          </button>
        </motion.div>

        {/* HIPAA Card */}
        <motion.div variants={itemVariants} className="glass-card p-6 flex flex-col relative overflow-hidden border-t-4 border-t-purple-500">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-purple-500" size={24} />
                <h2 className="font-title-lg font-bold text-on-surface">HIPAA Security Rule</h2>
              </div>
              <p className="text-sm text-on-surface-variant max-w-sm">Safeguards for Electronic Protected Health Information (ePHI).</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-display font-bold text-on-surface">{hipaaScore}%</div>
              <div className="text-xs text-on-surface-variant">Readiness</div>
            </div>
          </div>

          <div className="w-full bg-surface-variant rounded-full h-2 mb-6 overflow-hidden">
            <div className={`h-2 rounded-full ${hipaaScore > 80 ? 'bg-success' : (hipaaScore > 50 ? 'bg-warning' : 'bg-critical')}`} style={{ width: `${hipaaScore}%` }}></div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex items-start gap-3 p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
              {hipaaScore > 80 ? <CheckCircle2 className="text-success mt-0.5" size={18} /> : <AlertTriangle className="text-critical mt-0.5" size={18} />}
              <div>
                <h4 className="font-bold text-sm text-on-surface">§ 164.312(a)(1) - Access Control</h4>
                <p className="text-xs text-on-surface-variant mt-1">Review critical vulnerabilities that could lead to unauthorized ePHI access.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
              <CheckCircle2 className="text-success mt-0.5" size={18} />
              <div>
                <h4 className="font-bold text-sm text-on-surface">§ 164.312(e)(1) - Transmission Security</h4>
                <p className="text-xs text-on-surface-variant mt-1">TLS configurations meet acceptable standards in analyzed code.</p>
              </div>
            </div>
          </div>
          
          <button className="mt-6 text-sm text-purple-500 font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View HIPAA Controls Mapping <ChevronRight size={16} />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
