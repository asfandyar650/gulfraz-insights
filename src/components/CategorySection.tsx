'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Quote as QuoteIcon, ArrowRight, Sparkles } from 'lucide-react';
import { Article } from '../types';
import { quotes } from '../data/siteData';
import { ArticleCard } from './ArticleCard';

interface CategorySectionProps {
  articles: Article[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({ articles }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered =
    selectedCategory === 'all'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const dailyQuote = quotes[new Date().getDay() % quotes.length];

  return (
    <section className="py-16 sm:py-24 lg:py-28 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Recent Writings
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Latest Insights & Essays
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
            Honest book notes, practical financial lessons, and thoughts on living deliberately.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            All Essays ({articles.length})
          </button>
          <button
            onClick={() => setSelectedCategory('wealth')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === 'wealth'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Wealth & Freedom
          </button>
          <button
            onClick={() => setSelectedCategory('mindset')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === 'mindset'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Mindset & Growth
          </button>
          <button
            onClick={() => setSelectedCategory('psychology')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === 'psychology'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Psychology
          </button>
          <button
            onClick={() => setSelectedCategory('career')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === 'career'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Career & Growth
          </button>
        </div>

        {/* Daily Wisdom Quote Box */}
        <div className="mb-14 sm:mb-20 p-6 sm:p-10 rounded-3xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <QuoteIcon className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3" /> Thought of the Day
              </span>
              <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed">
                &ldquo;{dailyQuote.quote}&rdquo;
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                — <span className="font-semibold text-slate-700 dark:text-slate-300">{dailyQuote.author}</span>,{' '}
                <span className="italic">{dailyQuote.source}</span>
              </p>
            </div>
          </div>
          <Link
            href="/articles"
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            Browse Library <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.slice(0, 9).map((article) => (
            <ArticleCard key={article.id} article={article} variant="standard" />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-14 text-center">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-extrabold text-sm hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-colors shadow-lg"
          >
            Explore All 70+ Essays <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
