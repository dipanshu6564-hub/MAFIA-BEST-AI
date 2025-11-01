import React from 'react';
import { MenuIcon, SunIcon, MoonIcon } from './icons';

interface HeaderProps {
  toggleSidebar: () => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, theme, setTheme }) => {
  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between bg-[#080C10]/50 dark:bg-[#080C10]/50 light:bg-white/50 backdrop-blur-md border-b border-[#45A29E]/30 dark:border-[#45A29E]/30 light:border-slate-200 px-4 md:px-8">
      <button onClick={toggleSidebar} className="p-2 md:hidden text-[#C5C6C7] dark:text-[#C5C6C7] light:text-slate-600 rounded-full hover:bg-white/10">
        <MenuIcon className="h-6 w-6" />
      </button>
      <div className="flex-1"></div> {/* Spacer */}
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
        className="p-2 text-[#66FCF1] dark:text-[#66FCF1] light:text-[#45A29E] rounded-full hover:bg-white/10 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
      </button>
    </header>
  );
};
