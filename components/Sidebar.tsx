
import React from 'react';
import { MessageSquare, Plus, Trash2, Diamond, Clock } from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  activeSessionId, 
  onSelectSession, 
  onNewChat,
  onDeleteSession
}) => {
  return (
    <div className="w-72 h-screen flex flex-col glass border-r border-white/10 bg-slate-950/40">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center">
            <Diamond className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">Stoxara</span>
        </div>

        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          New Intelligence Session
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-6">
        <div className="px-2 mb-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Clock size={12} /> Recent History
          </span>
        </div>
        
        {sessions.length === 0 ? (
          <div className="px-4 py-8 text-center border border-dashed border-white/5 rounded-2xl">
            <p className="text-xs text-slate-600">No active history found.</p>
          </div>
        ) : (
          sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((session) => (
            <div 
              key={session.id}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                activeSessionId === session.id 
                  ? 'bg-blue-500/10 border-blue-500/30 text-white' 
                  : 'border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => onSelectSession(session.id)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare size={16} className={activeSessionId === session.id ? 'text-blue-400' : 'text-slate-600'} />
                <span className="text-xs font-semibold truncate whitespace-nowrap">
                  {session.title || 'Draft Analysis'}
                </span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-6 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">Alpha User</span>
            <span className="text-[10px] text-slate-500">Institutional Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};
