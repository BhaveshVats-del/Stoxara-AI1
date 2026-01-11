
import React, { useState, useRef, useEffect } from 'react';
import { Send, TrendingUp, Cpu, Info, Loader2, ExternalLink, Calendar } from 'lucide-react';
import { stoxara } from '../services/gemini';
import { Message, ChatSession } from '../types';

interface ChatInterfaceProps {
  activeSession: ChatSession;
  onUpdateSession: (updatedSession: ChatSession) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ activeSession, onUpdateSession }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession.messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...activeSession.messages, userMsg];
    
    // Optimistically update session with user message
    onUpdateSession({
      ...activeSession,
      messages: newMessages,
      title: activeSession.title === 'New Chat' ? input.slice(0, 30) : activeSession.title,
      updatedAt: new Date().toISOString()
    });

    setInput('');
    setIsLoading(true);

    const history = newMessages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const { text, sources } = await stoxara.generateResponse(input, history);
    
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: text,
      timestamp: new Date().toISOString(),
      sources: sources && sources.length > 0 ? sources : undefined
    };

    onUpdateSession({
      ...activeSession,
      messages: [...newMessages, aiMsg],
      title: activeSession.title === 'New Chat' ? input.slice(0, 30) : activeSession.title,
      updatedAt: new Date().toISOString()
    });
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[600px] flex flex-col glass rounded-3xl overflow-hidden shadow-2xl glow-blue border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-bold uppercase tracking-widest text-slate-300">Analysis Console</span>
        </div>
        <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-400 font-bold uppercase tracking-tighter mr-2">
               <Calendar className="w-3 h-3 mr-1" /> {new Date().toLocaleDateString()}
            </div>
            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Grounding Active</div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {activeSession.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-12">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Initiate Market Analysis</h3>
            <p className="text-slate-500 text-sm max-w-xs">
              Provide a query or economic indicator to begin institutional-grade analysis.
            </p>
          </div>
        ) : (
          activeSession.messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                msg.role === 'user' 
                  ? 'bg-blue-600/20 border border-blue-500/30 text-blue-50' 
                  : 'bg-white/5 border border-white/10 text-slate-200'
              }`}>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i} className="text-emerald-400 font-bold">{part}</strong> : part
                  )}
                </div>
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Verified Sources</span>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 hover:bg-blue-500/20 transition-colors"
                        >
                          {source.title.slice(0, 30)}{source.title.length > 30 ? '...' : ''} <ExternalLink className="w-2 h-2 ml-1" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`mt-2 text-[10px] opacity-40 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center space-x-3">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              <span className="text-xs text-slate-400 font-medium">Synthesizing intelligence...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Inquire about global macro trends or economic shifts..."
            className="w-full bg-slate-900/50 border border-white/10 focus:border-blue-500/50 rounded-2xl py-4 pl-6 pr-16 outline-none transition-all duration-300 text-sm placeholder:text-slate-600 focus:ring-1 focus:ring-blue-500/20"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
        <div className="mt-4 flex items-center justify-center space-x-6 text-[10px] text-slate-500 font-medium uppercase tracking-widest">
            <span className="flex items-center gap-1"><TrendingUp size={12}/> Analysis Hub</span>
            <span className="flex items-center gap-1"><Cpu size={12}/> Neural Engine</span>
            <span className="flex items-center gap-1"><Info size={12}/> Strategic Mode</span>
        </div>
      </div>
    </div>
  );
};
