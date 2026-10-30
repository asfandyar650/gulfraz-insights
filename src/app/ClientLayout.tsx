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
