'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import { ReadingListProvider } from '../context/ReadingListContext';
import { ArticlesProvider } from '../context/ArticlesContext';
import { AudioPlayerProvider, useAudioPlayer } from '../context/AudioPlayerContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ReadingListDrawer } from '../components/ReadingListDrawer';
import { AudioPlayerBar } from '../components/AudioPlayerBar';
import { SearchModal } from '../components/SearchModal';
import { MobileNav } from '../components/MobileNav';

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { currentArticle } = useAudioPlayer();

  useEffect(() => {
    try {
      setIsAdmin(sessionStorage.getItem('gulfraz_admin_session') === 'true');
    } catch {}
  }, [pathname]);

  // Handle Ctrl+Shift+A admin shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        router.push('/admin');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [router]);

  const handleExitAdmin = () => {
    try {
      sessionStorage.removeItem('gulfraz_admin_session');
    } catch {}
    setIsAdmin(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-x-hidden w-full max-w-full">
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {/* Floating Author Mode Badge */}
      {isAdmin && pathname !== '/admin' && (
        <aside
          aria-label="Admin quick actions"
          className={`fixed right-4 sm:right-6 z-40 flex items-center gap-1.5 sm:gap-2 p-1.5 pl-3 sm:pl-3.5 pr-1.5 sm:pr-2 bg-slate-950/95 dark:bg-slate-900/95 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-[calc(100vw-2rem)] ${
            currentArticle ? 'bottom-28 sm:bottom-24' : 'bottom-20 md:bottom-6'
          }`}
        >
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold mr-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-emerald-400 hidden xs:inline">Author Mode</span>
          </div>

          <Link
            href="/admin"
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 shrink-0"
            title="Open Author Publishing Studio"
          >
            <span>Back to Studio</span>
          </Link>

          <button
            onClick={handleExitAdmin}
            className="p-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors shrink-0"
            title="Lock & Exit Author Mode"
          >
            <Lock className="w-4 h-4 shrink-0" />
          </button>
        </aside>
      )}

      <Footer />
      <ReadingListDrawer />
      <AudioPlayerBar />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileNav
        onOpenMenu={() => setMobileMenuOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />
    </div>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ArticlesProvider>
          <ReadingListProvider>
            <AudioPlayerProvider>
              <AppContent>{children}</AppContent>
            </AudioPlayerProvider>
          </ReadingListProvider>
        </ArticlesProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
