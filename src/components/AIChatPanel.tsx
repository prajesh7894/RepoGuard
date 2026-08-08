import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface Finding {
  file: string;
  line: number;
  type: string;
  match: string;
  repoUrl?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  finding: Finding | null;
}

export function AIChatPanel({ isOpen, onClose, finding }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && finding && messages.length === 0) {
      setMessages([{
        role: 'model',
        text: `Hello! I'm your AI Security Architect. I see you're looking at a **${finding.type}** vulnerability in \`${finding.file}\` on line ${finding.line}.\n\nHow can I help you? You can ask me to explain it, or click the **Auto-Fix (PR)** button above to automatically generate a fix.`
      }]);
    }
  }, [isOpen, finding]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: 'user', text };
    const currentHistory = [...messages];
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: text,
          history: currentHistory
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFix = async () => {
    if (!finding) return;
    setIsFixing(true);
    
    // Add optimistic message
    setMessages(prev => [...prev, { role: 'user', text: "Generate a patch and open a Pull Request to fix this automatically." }]);
    setMessages(prev => [...prev, { role: 'model', text: "Working on it... Generating patch and connecting to GitHub..." }]);
    
    try {
      const response = await fetch('/api/remediate/pr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ finding, repo_url: finding.repoUrl })
      });

      if (!response.ok) {
        if (response.status === 401) {
           setMessages(prev => [...prev, { role: 'model', text: "⚠️ You need to link your GitHub account first. Please go to the Repositories page and click 'Sync with GitHub'." }]);
           setIsFixing(false);
           return;
        }
        throw new Error('Failed to create PR');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: `✅ **Success!** I have created a pull request with the fix.\n\n[View Pull Request](${data.url})\n\n**Generated Patch:**\n\`\`\`\n${data.patch}\n\`\`\`` 
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: '❌ Failed to create Pull Request. Make sure your GitHub account is linked and you have access to the repository.' }]);
    } finally {
      setIsFixing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Chat Panel */}
      <div className="relative w-full max-w-md h-full bg-[#0a0a0f]/95 border-l border-emerald-500/20 shadow-2xl shadow-emerald-500/10 flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Security Architect</h3>
              <p className="text-xs text-emerald-400/80">RepoGuard Advanced Interactivity</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoFix}
              disabled={isFixing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2ea043] hover:bg-[#2c974b] text-white text-xs font-medium rounded-md transition-colors shadow-lg disabled:opacity-50"
            >
              {isFixing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <div className="i-lucide-github" style={{width: 14, height: 14}}></div>}
              {isFixing ? 'Fixing...' : 'Auto-Fix (PR)'}
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border ${
                msg.role === 'user' 
                  ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                  : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600/20 text-blue-100 border border-blue-500/20'
                  : 'bg-white/5 text-slate-200 border border-white/10'
              }`}>
                <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-a:text-emerald-400 text-sm">
                  <ReactMarkdown
                    components={{
                      code({node, inline, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            {...props}
                            children={String(children).replace(/\n$/, '')}
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg !bg-[#1e1e1e] !my-2 border border-white/10 text-xs"
                          />
                        ) : (
                          <code {...props} className="bg-black/30 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-xs">
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 shrink-0 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="bg-white/5 rounded-2xl px-4 py-3 border border-white/10 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="text-sm text-slate-400">Analyzing code...</span>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-emerald-500/20 bg-[#0a0a0f]">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a follow up question..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-12 shrink-0 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 rounded-xl flex items-center justify-center transition-colors"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
