'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2, TrendingUp, Compass, Brain, Zap, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../context/ToastContext';
import { useReadingList } from '../context/ReadingListContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();
  const { openDrawer } = useReadingList();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    try {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.85 } });
    } catch {}
    setSubscribed(true);
    showToast('Welcome to Gulfraz Insights! Thanks for joining.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Sunday Reader Letter Newsletter Box */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-950 p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden mb-12">
          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <Mail className="w-3.5 h-3.5" /> Sunday Reader Letter
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              A few thoughtful ideas in your inbox every Sunday.
            </h3>
            <p className="text-slate-400 text-sm sm:text-base mt-2 mb-6 leading-relaxed">
              Every Sunday morning, I send a short personal letter sharing 2 or 3 of the most valuable ideas I came across that week—book quotes, financial principles, and mental models. Free, concise, and no spam ever.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium">
                  Thank you for subscribing! The next letter will be in your inbox on Sunday.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address..."
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 shrink-0"
                >
                  Join Free <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold">
                GI
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Gulfraz Insights</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Independent publication dedicated to wealth building, financial freedom frameworks, cognitive psychology, and strategic self-mastery.
            </p>
          </div>

          {/* Publication links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Publication</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  About Gulfraz
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1.5">
                  Support Gulfraz 💛
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Contact &amp; Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/articles?category=wealth" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Wealth & Freedom
                </Link>
              </li>
              <li>
                <Link href="/articles?category=mindset" className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-500" /> Mindset & Mastery
                </Link>
              </li>
              <li>
                <Link href="/articles?category=psychology" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-indigo-500" /> Human Psychology
                </Link>
              </li>
              <li>
                <Link href="/articles?category=career" className="text-slate-400 hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-violet-500" /> Career & Growth
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Notes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Tools & Notes</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/calculator" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Freedom Calculator
                </Link>
              </li>
              <li>
                <button onClick={openDrawer} className="text-slate-400 hover:text-emerald-400 transition-colors text-left">
                  Saved Reading List
                </button>
              </li>
              <li>
                <Link href="/articles" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Explore All Essays
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Gulfraz Insights. Written &amp; curated by Gulfraz Khan.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">
              Terms &amp; Conditions
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/support" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              Support 💛
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-emerald-400 transition-colors">
              Editorial Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
