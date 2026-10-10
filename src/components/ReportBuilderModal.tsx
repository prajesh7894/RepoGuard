import { useState } from 'react';
import { FileText, X, Check, Download, Layers, ShieldCheck, Activity, Users, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportBuilderModalProps {
  scanId: number;
  onClose: () => void;
}

export default function ReportBuilderModal({ scanId, onClose }: ReportBuilderModalProps) {
  const [sections, setSections] = useState({
    executiveSummary: true,
    vulnerabilityDetails: true,
    complianceMatrix: true,
    developerContext: false,
    remediationSteps: true
  });
  
  const [reportTheme, setReportTheme] = useState<'light' | 'dark' | 'brand'>('brand');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Build query params based on configuration
    const params = new URLSearchParams();
    Object.entries(sections).forEach(([key, value]) => {
      if (value) params.append('include', key);
    });
    params.append('theme', reportTheme);
    
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      window.location.href = `/api/scans/${scanId}/export/pdf?${params.toString()}`;
      onClose();
    }, 1500);
  };

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl max-h-full bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/50 overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side: Configuration Builder */}
        <div className="w-full md:w-[400px] flex flex-col border-r border-outline-variant/30 bg-surface-container-highest/20 h-full max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between sticky top-0 bg-surface-container-lowest z-10">
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <Settings className="text-primary" size={24} /> Report Builder
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors md:hidden">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 flex-1 flex flex-col gap-8">
            {/* Sections Toggle */}
            <div>
              <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers size={16} /> Include Sections
              </h3>
              
              <div className="flex flex-col gap-3">
                <div 
                  onClick={() => toggleSection('executiveSummary')}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${sections.executiveSummary ? 'bg-primary/10 border-primary/30' : 'bg-surface border-outline-variant/30 hover:border-outline-variant'}`}
                >
                  <div className="flex items-center gap-3">
                    <Activity className={sections.executiveSummary ? 'text-primary' : 'text-on-surface-variant'} size={18} />
                    <span className={`font-medium ${sections.executiveSummary ? 'text-primary' : 'text-on-surface'}`}>Executive Summary</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${sections.executiveSummary ? 'bg-primary border-primary text-white' : 'border-outline-variant'}`}>
                    {sections.executiveSummary && <Check size={12} />}
                  </div>
                </div>

                <div 
                  onClick={() => toggleSection('vulnerabilityDetails')}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${sections.vulnerabilityDetails ? 'bg-primary/10 border-primary/30' : 'bg-surface border-outline-variant/30 hover:border-outline-variant'}`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className={sections.vulnerabilityDetails ? 'text-primary' : 'text-on-surface-variant'} size={18} />
                    <span className={`font-medium ${sections.vulnerabilityDetails ? 'text-primary' : 'text-on-surface'}`}>Vulnerability Details</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${sections.vulnerabilityDetails ? 'bg-primary border-primary text-white' : 'border-outline-variant'}`}>
                    {sections.vulnerabilityDetails && <Check size={12} />}
                  </div>
                </div>

                <div 
                  onClick={() => toggleSection('complianceMatrix')}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${sections.complianceMatrix ? 'bg-primary/10 border-primary/30' : 'bg-surface border-outline-variant/30 hover:border-outline-variant'}`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className={sections.complianceMatrix ? 'text-primary' : 'text-on-surface-variant'} size={18} />
                    <span className={`font-medium ${sections.complianceMatrix ? 'text-primary' : 'text-on-surface'}`}>SOC2 / HIPAA Matrix</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${sections.complianceMatrix ? 'bg-primary border-primary text-white' : 'border-outline-variant'}`}>
                    {sections.complianceMatrix && <Check size={12} />}
                  </div>
                </div>

                <div 
                  onClick={() => toggleSection('developerContext')}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${sections.developerContext ? 'bg-primary/10 border-primary/30' : 'bg-surface border-outline-variant/30 hover:border-outline-variant'}`}
                >
                  <div className="flex items-center gap-3">
                    <Users className={sections.developerContext ? 'text-primary' : 'text-on-surface-variant'} size={18} />
                    <span className={`font-medium ${sections.developerContext ? 'text-primary' : 'text-on-surface'}`}>Developer Context & Commits</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${sections.developerContext ? 'bg-primary border-primary text-white' : 'border-outline-variant'}`}>
                    {sections.developerContext && <Check size={12} />}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Theme Selection */}
            <div>
              <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
                Report Theme
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setReportTheme('light')}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors flex flex-col items-center gap-2 ${reportTheme === 'light' ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-outline-variant/30 text-on-surface hover:border-outline-variant'}`}
                >
                  <div className="w-full h-8 bg-gray-100 rounded border border-gray-200"></div>
                  Light
                </button>
                <button 
                  onClick={() => setReportTheme('dark')}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors flex flex-col items-center gap-2 ${reportTheme === 'dark' ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-outline-variant/30 text-on-surface hover:border-outline-variant'}`}
                >
                  <div className="w-full h-8 bg-gray-900 rounded border border-gray-700"></div>
                  Dark
                </button>
                <button 
                  onClick={() => setReportTheme('brand')}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors flex flex-col items-center gap-2 ${reportTheme === 'brand' ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-outline-variant/30 text-on-surface hover:border-outline-variant'}`}
                >
                  <div className="w-full h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded"></div>
                  Brand
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-outline-variant/30 sticky bottom-0 bg-surface-container-lowest">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 bg-primary-container text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container/90 transition-all shadow-lg shadow-primary-container/20 disabled:opacity-70"
            >
              {isGenerating ? (
                <>Generating PDF...</>
              ) : (
                <><Download size={18} /> Download Custom PDF</>
              )}
            </button>
          </div>
        </div>
        
        {/* Right Side: Live Preview */}
        <div className="hidden md:flex flex-1 bg-surface-variant/20 p-8 flex-col items-center justify-center relative overflow-y-auto max-h-[80vh]">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors z-10">
            <X size={24} />
          </button>
          
          <div className="w-full max-w-[500px] aspect-[1/1.414] bg-white rounded shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ease-in-out" style={{ 
            backgroundColor: reportTheme === 'dark' ? '#1e293b' : reportTheme === 'brand' ? '#f8fafc' : '#ffffff',
            color: reportTheme === 'dark' ? '#f1f5f9' : '#0f172a'
          }}>
            {/* PDF Header Preview */}
            <div className={`p-8 ${reportTheme === 'brand' ? 'bg-blue-600 text-white' : 'border-b border-gray-200'}`}>
              <h1 className="text-2xl font-bold tracking-tight mb-2">Security Scan Report</h1>
              <div className={`text-sm opacity-80 flex justify-between`}>
                <span>Target: my-repo</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            {/* PDF Content Preview */}
            <div className="p-8 flex flex-col gap-6">
              <AnimatePresence>
                {sections.executiveSummary && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-3">
                    <div className={`h-4 w-32 rounded ${reportTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'}`}></div>
                    <div className="flex gap-4">
                      <div className={`w-16 h-16 rounded-full ${reportTheme === 'dark' ? 'border-[4px] border-slate-700' : 'border-[4px] border-gray-200'}`}></div>
                      <div className="flex-1 flex flex-col gap-2 justify-center">
                         <div className={`h-2 w-full rounded ${reportTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
                         <div className={`h-2 w-3/4 rounded ${reportTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {sections.vulnerabilityDetails && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-3 pt-4 border-t border-gray-200/20">
                    <div className={`h-4 w-40 rounded ${reportTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'}`}></div>
                    <div className={`h-8 w-full rounded ${reportTheme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'} mb-1`}></div>
                    <div className={`h-8 w-full rounded ${reportTheme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'} mb-1`}></div>
                    <div className={`h-8 w-full rounded ${reportTheme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}></div>
                  </motion.div>
                )}
                
                {sections.complianceMatrix && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-3 pt-4 border-t border-gray-200/20">
                    <div className={`h-4 w-48 rounded ${reportTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'}`}></div>
                    <div className="grid grid-cols-2 gap-2">
                       <div className={`h-12 rounded ${reportTheme === 'dark' ? 'border border-slate-700' : 'border border-gray-200'}`}></div>
                       <div className={`h-12 rounded ${reportTheme === 'dark' ? 'border border-slate-700' : 'border border-gray-200'}`}></div>
                    </div>
                  </motion.div>
                )}
                
                {sections.developerContext && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-3 pt-4 border-t border-gray-200/20">
                    <div className={`h-4 w-36 rounded ${reportTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'}`}></div>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${reportTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
                      <div className={`h-3 w-40 rounded ${reportTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-6 text-on-surface-variant font-medium text-sm flex items-center gap-2">
            <Check size={16} className="text-success" /> Live Preview Updates Automatically
          </div>
        </div>
      </motion.div>
    </div>
  );
}
