
import React, { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { BentoGrid } from './components/BentoGrid';
import { Sidebar } from './components/Sidebar';
import { Diamond, ArrowRight, Menu, X } from 'lucide-react';
import { ChatSession, Message } from './types';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('stoxara_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSessions(parsed);
      if (parsed.length > 0) {
        setActiveSessionId(parsed[0].id);
      } else {
        createNewChat();
      }
    } else {
      createNewChat();
    }
  }, []);

  // Save history on change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('stoxara_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      updatedAt: new Date().toISOString(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleUpdateSession = (updated: ChatSession) => {
    setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleDeleteSession = (id: string) => {
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      if (filtered.length > 0) {
        setActiveSessionId(filtered[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const activeSession = sessions.find(s => s.id === activeSessionId) || {
    id: 'fallback',
    title: 'New Chat',
    messages: [],
    updatedAt: new Date().toISOString()
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex overflow-hidden selection:bg-blue-500/30">
      
      {/* Sidebar Integration */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-0 overflow-hidden'}`}>
        <Sidebar 
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onNewChat={createNewChat}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-screen overflow-y-auto relative flex flex-col">
        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-6 left-6 z-50 p-2 glass rounded-lg hover:bg-white/5 transition-all md:flex hidden"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Hero & Chat Integration */}
        <main className="flex-1 pt-24 pb-20">
          <div className="max-w-6xl mx-auto px-6 relative">
            <div className="absolute top-0 -left-24 w-96 h-96 bg-blue-600/5 rounded-full blur-[128px] -z-10" />
            <div className="absolute bottom-0 -right-24 w-96 h-96 bg-emerald-600/5 rounded-full blur-[128px] -z-10" />
            
            <div className="text-center mb-16 relative">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass border-white/10 mb-8">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Analysis Core V5.0</span>
              </div>
              
              <h1 className="text-4xl md:text-7xl font-[900] tracking-tighter mb-6 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent leading-[1.1]">
                Institutional Intelligence <br /> Refined.
              </h1>
              
              <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                Smarter insights. Deeper analysis. Stoxara provides 
                <span className="text-white font-bold px-2">real-time economic wisdom</span> via high-performance grounding.
              </p>
            </div>

            <div className="relative z-10 mb-20">
              <ChatInterface 
                activeSession={activeSession} 
                onUpdateSession={handleUpdateSession} 
              />
            </div>

            <BentoGrid />
          </div>
        </main>

        <footer className="border-t border-white/5 py-12 px-6 bg-slate-950/20">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-500 text-[10px] font-bold uppercase tracking-widest gap-8">
            <div className="flex items-center space-x-2">
              <Diamond size={16} />
              <span>© 2024 Stoxara Intelligence Systems.</span>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="hover:text-white transition-colors">Strategic Ops</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
            <div>
              Status: <span className="text-emerald-500">Synchronized</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
