import { useState } from 'react';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';

export default function AiAssistantDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: 'Hello! I am your RepoGuard AI Security Assistant. How can I help you secure your codebase today?' }
  ]);
  const [input, setInput] = useState('');

  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages
        })
      });
      
      if (!response.ok) throw new Error('API error');
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/50 z-[100] backdrop-blur-sm transition-opacity" onClick={onClose} />
      )}
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[400px] max-w-[100vw] bg-surface-container-highest border-l border-outline-variant/30 shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 bg-surface/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
              <Sparkles size={16} />
            </div>
            <h2 className="font-title-md font-semibold text-on-surface">Security Assistant</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-on-primary' : 'bg-surface-variant text-primary'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-primary text-on-primary rounded-tr-sm' : 'bg-surface-variant text-on-surface rounded-tl-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-surface-variant text-primary">
                <Bot size={16} />
              </div>
              <div className="p-3 rounded-2xl max-w-[80%] text-sm bg-surface-variant text-on-surface rounded-tl-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-outline-variant/30 bg-surface/50 backdrop-blur-md">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about a vulnerability..." 
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface"
              disabled={isTyping}
            />
            <button onClick={handleSend} disabled={isTyping} className="absolute right-2 p-2 rounded-full bg-primary-container text-white shadow-[0_0_10px_rgba(37,99,235,0.4)] hover:shadow-[0_0_15px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              <Send size={18} className={isTyping ? "opacity-50" : ""} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
