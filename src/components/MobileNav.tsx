'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Calculator, Bookmark, Menu, Search, Sun, Moon } from 'lucide-react';
import { useReadingList } from '../context/ReadingListContext';
import { useTheme } from '../context/ThemeContext';

interface MobileNavProps {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenMenu, onOpenSearch }) => {
  const pathname = usePathname();
  const { bookmarkedIds, openDrawer } = useReadingList();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] pb-safe transition-colors"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center h-full py-1 gap-1 text-[11px] font-semibold transition-all active:scale-95 ${
            isActive('/') && pathname === '/'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        {/* Essays */}
        <Link
          href="/articles"
          className={`flex flex-col items-center justify-center h-full py-1 gap-1 text-[11px] font-semibold transition-all active:scale-95 ${
            isActive('/articles')
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Essays</span>
        </Link>

        {/* Freedom Calculator */}
        <Link
          href="/calculator"
          className={`flex flex-col items-center justify-center h-full py-1 gap-1 text-[11px] font-semibold transition-all active:scale-95 ${
            isActive('/calculator')
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calculator className="w-5 h-5" />
          <span>Calculator</span>
        </Link>

        {/* Saved Reading List */}
        <button
          onClick={openDrawer}
          className="relative flex flex-col items-center justify-center h-full py-1 gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
        >
          <div className="relative">
            <Bookmark className="w-5 h-5" />
            {bookmarkedIds.length > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] flex items-center justify-center shadow">
                {bookmarkedIds.length}
              </span>
            )}
          </div>
          <span>Saved</span>
        </button>

        {/* More Menu */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center h-full py-1 gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all active:scale-95"
        >
          <Menu className="w-5 h-5" />
          <span>Menu</span>
        </button>
      </div>
    </nav>
  );
};
