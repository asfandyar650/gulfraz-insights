'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, BookOpen, Clock, Sparkles } from 'lucide-react';
import { Article } from '../types';
import { author } from '../data/siteData';
import { ArticleCard } from './ArticleCard';

interface HeroProps {
  featuredArticle: Article;
}

export const Hero: React.FC<HeroProps> = ({ featuredArticle }) => {
  return (
    <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          {/* Author Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-slate-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 mb-6 shadow-sm">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-5 h-5 rounded-full object-cover border border-emerald-500"
            />
            <span>A personal publication by Gulfraz Khan</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-5">
            Smart Ideas.{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 bg-clip-text text-transparent">
              Real Insights.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-8">
            Notes, book breakdowns, and quiet reflections on building financial freedom, mastering your mindset, and understanding human nature. No get-rich-quick noise—just honest ideas that work.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/articles"
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
            >
              Browse All 70+ Essays <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/calculator"
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base flex items-center gap-2 border border-slate-200 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
            >
              <Calculator className="w-4 h-4 text-emerald-500" /> Freedom Calculator
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span>73 Practical Book Notes & Essays</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>5–10 Min Reads, Written for Busy People</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>100% Free & Independent</span>
            </div>
          </div>
        </div>

        {/* Featured Article Card */}
        {featuredArticle && (
          <div className="mt-4">
            <ArticleCard article={featuredArticle} variant="featured" />
          </div>
        )}
      </div>
    </section>
  );
};
