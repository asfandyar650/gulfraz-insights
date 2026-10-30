'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bookmark,
  Sun,
  Moon,
  Menu,
  X,
  ArrowRight,
  TrendingUp,
  Compass,
  Brain,
  Zap,
  Lock,
  ExternalLink,
  BookOpen,
  Calculator,
  Mail,
  User,
  Heart,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useReadingList } from '../context/ReadingListContext';

interface HeaderProps {
  onOpenSearch: () => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  mobileMenuOpen: externalMenuOpen,
  setMobileMenuOpen: externalSetMenuOpen,
}) => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { bookmarkedIds, openDrawer } = useReadingList();
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isMenuOpen = externalMenuOpen !== undefined ? externalMenuOpen : internalMenuOpen;
  const setMenuOpen = externalSetMenuOpen !== undefined ? externalSetMenuOpen : setInternalMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  const navItems = [
    { id: '/', label: 'Home', icon: BookOpen },
    { id: '/articles', label: 'Essays', icon: BookOpen },
    { id: '/calculator', label: 'Freedom Calculator', icon: Calculator },
    { id: '/support', label: 'Support 💛', icon: Heart, isSupport: true },
    { id: '/about', label: 'About', icon: User },
    { id: '/contact', label: 'Contact', icon: Mail },
  ];

  const categoryShortcuts = [
    { id: 'wealth', label: 'Wealth & Freedom', icon: TrendingUp, color: 'text-emerald-500' },
    { id: 'mindset', label: 'Mindset & Self-Mastery', icon: Compass, color: 'text-amber-500' },
    { id: 'psychology', label: 'Human Psychology', icon: Brain, color: 'text-indigo-500' },
    { id: 'career', label: 'Career Leverage', icon: Zap, color: 'text-violet-500' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-sm border-b border-slate-200/80 dark:border-slate-800/80 py-2.5 sm:py-3'
            : 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 20L12 4L20 20M7 15H17" />
                <circle cx="19" cy="5" r="2.2" fill="#fbbf24" stroke="none" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1 leading-none">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  Gulfraz
                </span>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-emerald-600 dark:text-emerald-400">
                  Insights
                </span>
              </div>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 mt-0.5 hidden xs:block">
                Smart Ideas. Real Insights.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3">
            {navItems.map((item) => {
              const active = isActive(item.id);
              if (item.isSupport) {
                return (
                  <Link
                    key={item.id}
                    href={item.id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      active
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'text-amber-700 dark:text-amber-300 bg-amber-50/90 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/80 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>Support</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={item.id}
                  href={item.id}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/60 font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors shadow-sm min-h-[40px]"
              title="Search insights (Cmd+K)"
            >
              <Search className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline font-medium text-slate-500 dark:text-slate-400">Search</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
                ⌘K
              </kbd>
            </button>

            {/* Reading List Drawer Button */}
            <button
              onClick={openDrawer}
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all min-w-[40px] min-h-[40px] flex items-center justify-center"
              title="Reading List"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkedIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-md animate-in zoom-in">
                  {bookmarkedIds.length}
                </span>
              )}
            </button>

            {/* Theme Toggle (Switch between White Background and Black Background) */}
            <button
              onClick={toggleTheme}
              className="flex p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all min-w-[40px] min-h-[40px] items-center justify-center shadow-sm active:scale-95"
              title={theme === 'dark' ? 'Make Background White (Light Mode)' : 'Make Background Black (Dark Mode)'}
              aria-label={theme === 'dark' ? 'Switch to White Background' : 'Switch to Black Background'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-800" />
              )}
            </button>

            {/* Generous, highly clickable Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all min-w-[44px]"
              aria-label={isMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {isMenuOpen ? (
                <>
                  <X className="w-5 h-5 stroke-[2.5]" />
                  <span className="hidden xs:inline">Close</span>
                </>
              ) : (
                <>
                  <Menu className="w-5 h-5 stroke-[2.5]" />
                  <span className="hidden xs:inline">Menu</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Featured Mobile Slide-Over Drawer Sheet */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow">
                    GI
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      Gulfraz Insights
                    </h3>
                    <p className="text-[10px] text-slate-400">Navigation &amp; Controls</p>
                  </div>
                </div>

                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Search Quick Button */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-emerald-500" />
                    <span>Search all 73 essays...</span>
                  </span>
                  <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-[10px] border border-slate-200 dark:border-slate-700">
                    Search
                  </kbd>
                </button>

                {/* Main Nav Links */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
                    Main Pages
                  </span>
                  <div className="space-y-1">
                    {navItems.map((item) => {
                      const active = isActive(item.id);
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.id}
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                            active
                              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${active ? 'text-emerald-500' : 'text-slate-400'}`} />
                            <span>{item.label}</span>
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Category Explorer */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
                    Categories
                  </span>
                  <div className="space-y-1">
                    {categoryShortcuts.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.id}
                          href={`/articles?category=${cat.id}`}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${cat.color}`} />
                            <span>{cat.label}</span>
                          </span>
                          <span className="text-slate-400">→</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Preferences */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
                    Display Preferences
                  </span>

                  {/* Theme Switcher Button */}
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200 active:scale-95 transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      {theme === 'dark' ? (
                        <Sun className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Moon className="w-4 h-4 text-slate-700" />
                      )}
                      <span>Background: {theme === 'dark' ? 'Black (Dark Mode)' : 'White (Light Mode)'}</span>
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {theme === 'dark' ? 'Make White' : 'Make Black'}
                    </span>
                  </button>

                  {/* Reading List Drawer shortcut */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      openDrawer();
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    <span className="flex items-center gap-2.5">
                      <Bookmark className="w-4 h-4 text-emerald-500" />
                      <span>Saved Reading List</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px]">
                      {bookmarkedIds.length} saved
                    </span>
                  </button>
                </div>

                {/* Legal & Information */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
                    Information &amp; Legal
                  </span>
                  <Link
                    href="/terms"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>Terms &amp; Conditions</span>
                    </span>
                    <span className="text-slate-400">→</span>
                  </Link>
                  <Link
                    href="/privacy"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-slate-400" />
                      <span>Privacy Policy</span>
                    </span>
                    <span className="text-slate-400">→</span>
                  </Link>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400 text-[11px]">
                  Smart Ideas. Real Insights.
                </span>
                <span className="text-slate-400 text-[10px]">Gulfraz Khan © 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
