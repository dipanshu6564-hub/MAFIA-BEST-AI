import React from 'react';
import { PlusIcon, MafiaIcon } from './icons';

interface SidebarProps {
  startNewChat: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ startNewChat, isOpen, setIsOpen }) => {
  return (
    <>
      <div className={`fixed inset-0 z-30 bg-black/60 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`absolute md:relative z-40 flex h-full w-64 flex-col bg-[#0f141a] dark:bg-[#0f141a] light:bg-slate-100 p-4 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center gap-2 mb-8">
            <MafiaIcon className="w-8 h-8 text-[#66FCF1]" />
            <h1 className="text-xl font-bold text-white dark:text-white light:text-slate-800 text-glow">MAFIA AI</h1>
        </div>
        <button 
          onClick={startNewChat}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-semibold border border-[#45A29E] bg-[#45A29E]/20 text-[#66FCF1] transition-all duration-300 hover:bg-[#45A29E]/40 hover:shadow-[0_0_15px_rgba(102,252,241,0.4)]"
        >
          <PlusIcon className="w-4 h-4" />
          New Chat
        </button>
        <div className="mt-auto text-xs text-slate-500 dark:text-slate-500 light:text-slate-400 text-center">
            <p>&copy; 2024 Mafia AI. All rights reserved.</p>
        </div>
      </aside>
    </>
  );
};
