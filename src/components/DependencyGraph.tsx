import { useState, useMemo, useCallback } from 'react';
import { Package, ShieldAlert, Zap, AlertTriangle, ArrowRight, X, GitMerge } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  BackgroundVariant,
  Handle, 
  Position,
  useNodesState,
  useEdgesState,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface DependencyGraphProps {
  dependencies: any[];
}

// Custom Node Components
const RootNode = ({ data }: any) => (
  <div className="bg-surface-container-lowest/95 backdrop-blur-md border-2 border-primary p-4 rounded-2xl shadow-[0_0_40px_rgba(79,70,229,0.4)] flex flex-col items-center gap-2 min-w-[200px]">
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-primary border-none" />
    <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary mb-1">
      <Package size={24} />
    </div>
    <div className="text-center">
      <span className="font-bold text-sm text-on-surface block">{data.label}</span>
      <span className="text-xs text-primary font-code-sm">{data.subtitle}</span>
    </div>
  </div>
);

const ModuleNode = ({ data }: any) => (
  <div className="bg-surface-container-highest/95 backdrop-blur-md border border-outline-variant/50 hover:border-primary/50 transition-colors p-3 rounded-xl shadow-xl flex items-center gap-3 min-w-[180px]">
    <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-outline-variant border-none" />
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-outline-variant border-none" />
    <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant">
       <GitMerge size={16} />
    </div>
    <div>
       <span className="font-semibold text-xs text-on-surface block truncate">{data.label}</span>
       <span className="text-[10px] text-on-surface-variant block">{data.subtitle}</span>
    </div>
  </div>
);

const VulnNode = ({ data }: any) => {
  const isCritical = data.severity === 'critical';
  return (
    <div className={`p-3 rounded-xl border-2 shadow-2xl flex flex-col items-center gap-2 min-w-[150px] relative overflow-hidden transition-all ${
      isCritical 
        ? 'bg-[#1f1013]/95 border-critical/50 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)]' 
        : 'bg-[#1f1a10]/95 border-warning/50 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)]'
    }`}>
      <Handle type="target" position={Position.Top} className={`w-3 h-3 border-none ${isCritical ? '!bg-critical' : '!bg-warning'}`} />
      <div className={`absolute top-0 w-full h-1 ${isCritical ? 'bg-critical' : 'bg-warning'}`}></div>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-2 ${isCritical ? 'bg-critical/20 text-critical' : 'bg-warning/20 text-warning'}`}>
         {isCritical ? <ShieldAlert size={16} /> : <AlertTriangle size={16} />}
      </div>
      <div className="text-center w-full">
         <span className="text-xs font-bold text-on-surface block truncate" title={data.label}>{data.label}</span>
         <span className="text-[10px] font-code-sm uppercase tracking-wider opacity-80 mt-1 block text-on-surface">{data.severity}</span>
      </div>
    </div>
  );
};

const nodeTypes = {
  root: RootNode,
  module: ModuleNode,
  vulnerability: VulnNode,
};

export default function DependencyGraph({ dependencies }: DependencyGraphProps) {
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);

  // Generate nodes and edges
  const { initialNodes, initialEdges } = useMemo(() => {
    const rootId = 'root';
    const nds: any[] = [
      { 
        id: rootId, 
        type: 'root', 
        position: { x: 400, y: 50 }, 
        data: { label: 'Main Project', subtitle: 'package.json' } 
      }
    ];
    const egs: any[] = [];

    const repos = [...new Set(dependencies.map(d => d.repo))];
    
    repos.forEach((repo, i) => {
      const repoId = `repo-${repo}`;
      const repoX = 100 + (i * 350);
      
      nds.push({
        id: repoId,
        type: 'module',
        position: { x: repoX, y: 250 },
        data: { label: repo, subtitle: 'Core Module' }
      });
      
      egs.push({
        id: `e-${rootId}-${repoId}`,
        source: rootId,
        target: repoId,
        type: 'smoothstep',
        animated: true,
        style: { stroke: 'rgba(79, 70, 229, 0.5)', strokeWidth: 2 }
      });

      const repoDeps = dependencies.filter(d => d.repo === repo);
      repoDeps.forEach((dep, j) => {
        const depId = dep.id;
        const offset = (j - (repoDeps.length - 1) / 2) * 200;
        const isCritical = dep.severity === 'critical';
        
        nds.push({
          id: depId,
          type: 'vulnerability',
          position: { x: repoX + offset, y: 450 + (j % 2 === 0 ? 0 : 50) },
          data: { 
            label: dep.package, 
            severity: dep.severity, 
            cve: dep.cve,
            fullData: dep 
          }
        });
        
        egs.push({
          id: `e-${repoId}-${depId}`,
          source: repoId,
          target: depId,
          type: 'smoothstep',
          animated: true,
          style: { 
            stroke: isCritical ? 'rgba(239, 68, 68, 0.8)' : 'rgba(245, 158, 11, 0.8)', 
            strokeWidth: 3 
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isCritical ? 'rgba(239, 68, 68, 0.8)' : 'rgba(245, 158, 11, 0.8)',
          },
        });
      });
    });

    return { initialNodes: nds, initialEdges: egs };
  }, [dependencies]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((event: any, node: any) => {
    if (node.type === 'vulnerability') {
      setSelectedNodeData(node.data.fullData);
    }
  }, []);

  return (
    <div className="glass-panel rounded-xl border border-outline-variant/30 flex-1 flex overflow-hidden min-h-[700px] relative bg-[#060a14]">
      <div className="absolute inset-0 w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
          className="react-flow-dark-theme"
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={30} 
            size={1.5} 
            color="rgba(79, 70, 229, 0.3)" 
          />
          <Controls 
            className="bg-surface-container-highest border border-outline-variant/30 rounded-lg shadow-lg fill-on-surface" 
          />
        </ReactFlow>
      </div>

      {/* Selected Node Details Sidebar */}
      <AnimatePresence>
        {selectedNodeData && (
          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-[400px] max-w-[100vw] bg-surface-container/95 backdrop-blur-2xl border-l border-outline-variant/30 p-0 z-40 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col"
          >
            <div className="p-6 border-b border-outline-variant/30 bg-surface-container-lowest/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <Zap className="text-primary" size={20} /> Vulnerability Details
              </h3>
              <button onClick={() => setSelectedNodeData(null)} className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant hover:text-on-surface transition-colors">
                 <X size={18} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-5">
              <div className="p-5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 flex items-start justify-between relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${selectedNodeData.severity === 'critical' ? 'bg-critical' : 'bg-warning'}`}></div>
                <div>
                   <div className="text-xs text-on-surface-variant mb-1 uppercase tracking-wider font-semibold">Affected Package</div>
                   <div className="font-code-sm text-primary text-xl font-bold">{selectedNodeData.package}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${selectedNodeData.severity === 'critical' ? 'bg-critical/10 text-critical border border-critical/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
                  {selectedNodeData.severity}
                </div>
              </div>
              
              <div className="p-5 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                <div className="text-xs text-on-surface-variant mb-2 uppercase tracking-wider font-semibold">Identifiers</div>
                <div className="flex items-center gap-2 mb-3">
                   <span className="font-code-sm bg-surface-variant/50 px-2 py-1 rounded text-sm text-on-surface border border-outline-variant/30">{selectedNodeData.cve}</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                   This package introduces a known vulnerability that can be exploited in production environments. Immediate patching is recommended.
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-primary/10 to-transparent rounded-xl border border-primary/30">
                <div className="text-xs text-primary mb-2 uppercase tracking-wider font-semibold flex items-center gap-2">
                   <ArrowRight size={14} /> Remediation Path
                </div>
                <div className="text-sm text-on-surface mb-4 font-medium">Recommended upgrade: <span className="font-code-sm text-primary bg-primary/10 px-1 rounded">{selectedNodeData.fixedIn}</span></div>
                <button className="w-full py-3 bg-primary-container text-white rounded-xl text-sm font-bold hover:bg-primary-container/90 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex justify-center items-center gap-2">
                  Auto-Generate Fix PR <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
