import { useState } from 'react';
import { Brain, Code, Play, ShieldAlert, CheckCircle2, ChevronRight, Zap, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AiSecurityReview() {
  const [code, setCode] = useState(`app.post('/api/users', (req, res) => {
  const { username, email, role } = req.body;
  
  // Create new user in database
  const query = \`INSERT INTO users (username, email, role) VALUES ('\${username}', '\${email}', '\${role}')\`;
  
  db.execute(query, (err, result) => {
    if (err) {
      res.status(500).send('Error creating user');
      return;
    }
    res.status(201).json({ message: 'User created successfully', id: result.insertId });
  });
});`);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const { token } = useAuth();

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    setResults(null);
    
    try {
      const res = await fetch('/api/ai-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch AI analysis');
      }
      
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setResults({ vulns: [] });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-container-padding-mobile md:px-container-padding-desktop w-full h-full flex flex-col max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold flex items-center gap-3">
            <Brain className="text-primary" size={32} />
            AI Security Review
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary/20 text-primary uppercase tracking-wider mb-1">Pro</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Paste a code snippet to analyze it for complex logic flaws and vulnerabilities using LLMs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        {/* Code Input Area */}
        <div className="glass-panel rounded-xl flex flex-col overflow-hidden border border-outline-variant/30 shadow-lg">
          <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest/30">
            <div className="flex items-center gap-2 font-medium text-on-surface text-sm">
              <Code size={18} className="text-secondary" />
              Source Code
            </div>
            <button 
              className="flex items-center gap-2 bg-primary-container text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-primary-container/90 transition-colors disabled:opacity-50 cursor-pointer shadow-[0_0_10px_rgba(37,99,235,0.3)]"
              onClick={analyzeCode}
              disabled={isAnalyzing || !code.trim()}
            >
              {isAnalyzing ? (
                <><RefreshCw size={16} className="animate-spin" /> Analyzing...</>
              ) : (
                <><Play size={16} fill="currentColor" /> Run AI Analysis</>
              )}
            </button>
          </div>
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full bg-surface-container-lowest p-4 font-code-sm text-sm text-on-surface resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
            spellCheck="false"
            placeholder="Paste your code here..."
          ></textarea>
        </div>

        {/* Results Area */}
        <div className="glass-panel rounded-xl flex flex-col overflow-hidden border border-outline-variant/30 shadow-lg">
          <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest/30">
            <div className="flex items-center gap-2 font-medium text-on-surface text-sm">
              <Zap size={18} className="text-primary" />
              Analysis Results
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-surface-container-lowest/50 p-6">
            {!isAnalyzing && !results && (
              <div className="h-full flex flex-col items-center justify-center text-on-surface-variant opacity-60">
                <Brain size={48} className="mb-4" />
                <p>Paste code and run analysis to see AI insights.</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center text-on-surface-variant animate-pulse">
                <Brain size={48} className="mb-4 text-primary" />
                <p>Analyzing code structure and data flow...</p>
              </div>
            )}

            {results && results.vulns.map((vuln: any, idx: number) => (
              <div key={idx} className="animate-fade-in-up">
                <div className="flex items-start gap-3 mb-4">
                  <div className="mt-1 bg-critical/20 p-2 rounded-full text-critical">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-critical">{vuln.title}</h3>
                    <p className="text-sm text-on-surface-variant mt-1">Found near line {vuln.line}</p>
                  </div>
                </div>
                
                <p className="text-sm text-on-surface mb-6 leading-relaxed">
                  {vuln.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-label-caps text-xs uppercase text-on-surface-variant mb-2">Recommendation</h4>
                  <div className="flex items-start gap-2 bg-surface-variant/30 p-3 rounded-lg border border-outline-variant/20">
                    <CheckCircle2 size={16} className="text-success mt-0.5 shrink-0" />
                    <p className="text-sm text-on-surface">{vuln.recommendation}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-label-caps text-xs uppercase text-on-surface-variant mb-2 flex items-center justify-between">
                    Suggested Fix
                    <button className="text-primary hover:underline lowercase font-body-sm normal-case flex items-center gap-1 cursor-pointer">
                      Apply Fix <ChevronRight size={14} />
                    </button>
                  </h4>
                  <div className="rounded-lg overflow-hidden border border-success/30 bg-success/5 font-code-sm text-xs">
                    <div className="p-4 overflow-x-auto text-on-surface whitespace-pre">
                      {vuln.fixedCode}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {results && results.vulns.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-success">
                <CheckCircle2 size={48} className="mb-4" />
                <h3 className="text-lg font-semibold">No critical vulnerabilities found</h3>
                <p className="text-sm opacity-80 mt-1">The code appears to be secure based on current patterns.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
