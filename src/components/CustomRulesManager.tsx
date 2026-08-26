import { useState, useEffect } from 'react';
import { Plus, Trash2, ShieldAlert } from 'lucide-react';

export default function CustomRulesManager({ token }: { token: string | null }) {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRule, setNewRule] = useState({ name: '', description: '', pattern: '', severity: 'CRITICAL' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/rules', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRules(data);
      }
    } catch (e) {
      console.error('Failed to fetch rules', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.name || !newRule.pattern) return;
    
    try {
      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newRule)
      });
      if (res.ok) {
        const data = await res.json();
        setRules([data, ...rules]);
        setNewRule({ name: '', description: '', pattern: '', severity: 'CRITICAL' });
        setIsAdding(false);
      }
    } catch (e) {
      console.error('Failed to create rule', e);
    }
  };

  const handleDeleteRule = async (id: number) => {
    try {
      const res = await fetch(`/api/rules/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setRules(rules.filter(r => r.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete rule', e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-on-surface flex items-center gap-2">
          <ShieldAlert size={18} /> Regex Patterns
        </h4>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-primary-container text-white text-sm font-medium rounded hover:bg-primary-container/90 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add Rule
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreateRule} className="p-5 rounded-lg border border-primary/30 bg-primary/5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">Rule Name</label>
              <input 
                type="text" required
                value={newRule.name} onChange={e => setNewRule({...newRule, name: e.target.value})}
                placeholder="e.g. Acme Corp Internal Token"
                className="w-full bg-surface-container border border-outline-variant/30 rounded px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">Severity</label>
              <select 
                value={newRule.severity} onChange={e => setNewRule({...newRule, severity: e.target.value})}
                className="w-full bg-surface-container border border-outline-variant/30 rounded px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="WARNING">Warning</option>
                <option value="INFO">Info</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">Regex Pattern</label>
            <input 
              type="text" required
              value={newRule.pattern} onChange={e => setNewRule({...newRule, pattern: e.target.value})}
              placeholder="e.g. ACME_SEC_[A-Z0-9]{32}"
              className="w-full bg-surface-container border border-outline-variant/30 rounded px-3 py-2 text-sm text-on-surface font-code-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">Description (Optional)</label>
            <input 
              type="text" 
              value={newRule.description} onChange={e => setNewRule({...newRule, description: e.target.value})}
              placeholder="Explains what this token is for..."
              className="w-full bg-surface-container border border-outline-variant/30 rounded px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-primary-container text-white text-sm font-bold rounded-lg hover:bg-primary-container/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 cursor-pointer">
              Save Rule
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-surface-variant/30 rounded-lg"></div>
          <div className="h-16 bg-surface-variant/30 rounded-lg"></div>
        </div>
      ) : rules.length === 0 ? (
        <div className="text-center p-8 text-on-surface-variant border border-dashed border-outline-variant/30 rounded-lg">
          No custom rules defined yet.
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map(rule => (
            <div key={rule.id} className="flex items-start justify-between p-4 rounded-lg border border-outline-variant/30 bg-surface-container-lowest hover:border-primary/30 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded text-white ${rule.severity === 'CRITICAL' ? 'bg-critical' : rule.severity === 'HIGH' ? 'bg-warning' : rule.severity === 'WARNING' ? 'bg-orange-400' : 'bg-blue-500'}`}>
                    {rule.severity}
                  </span>
                  <h4 className="font-semibold text-on-surface text-sm">{rule.name}</h4>
                </div>
                <p className="font-code-sm text-xs text-on-surface-variant mt-2 bg-surface-variant/20 p-2 rounded">
                  {rule.pattern}
                </p>
                {rule.description && (
                  <p className="text-sm text-on-surface-variant mt-2">{rule.description}</p>
                )}
              </div>
              <button 
                onClick={() => handleDeleteRule(rule.id)}
                className="p-2 text-on-surface-variant hover:text-critical hover:bg-critical/10 rounded-full transition-colors"
                title="Delete rule"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
