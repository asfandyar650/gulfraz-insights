'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  TrendingUp,
  Laptop,
  Brain,
  Zap,
  ArrowLeft,
  Search,
  Filter,
  Sparkles,
  Compass,
  ArrowRight,
  Clock,
  BookMarked
} from 'lucide-react';
import { Category } from '../../../types';
import { useArticles } from '../../../context/ArticlesContext';
import { ArticleCard } from '../../../components/ArticleCard';
import { categories, normalizeCategory, getCategoryBadgeClass } from '../../../lib/categories';

interface CategoryPageClientProps {
  category: Category;
}

export const CategoryPageClient: React.FC<CategoryPageClientProps> = ({ category }) => {
  const { articles } = useArticles();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'claps'>('latest');

  // Filter articles belonging to this category (only published ones, or all)
  const categoryArticles = useMemo(() => {
    return articles.filter((art) => {
      if (art.status === 'draft') return false;
      const normalized = normalizeCategory(art.category);
      return normalized === category.id || normalized === category.slug;
    });
  }, [articles, category]);

  // Apply search & sort
  const filteredArticles = useMemo(() => {
    let result = categoryArticles;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subtitle?.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q) ||
          (a.tags && a.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
      if (sortBy === 'claps') return (b.claps || 0) - (a.claps || 0);
      // latest
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [categoryArticles, searchQuery, sortBy]);

  // Category Icon Resolver
  const getIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      case 'Laptop':
        return <Laptop className={className} />;
      case 'Brain':
        return <Brain className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      default:
        return <Compass className={className} />;
    }
  };

  // Other categories for footer explorer
  const otherCategories = categories.filter((c) => c.id !== category.id);

  // Stats
  const totalViews = categoryArticles.reduce((sum, a) => sum + (a.views || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 sm:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/articles" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Categories
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium">{category.name}</span>
        </nav>

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 lg:p-12 mb-10 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <span className="text-emerald-600 dark:text-emerald-400">
                {getIcon(category.iconName, 'w-4 h-4')}
              </span>
              <span>Category Hub</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-4">
              {category.name}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {category.description}
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-emerald-500" />
                <span>
                  <strong className="text-slate-900 dark:text-white">{categoryArticles.length}</strong> Curated Essays
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  <strong className="text-slate-900 dark:text-white">{totalViews.toLocaleString()}</strong> Total Readers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>No Artificial Reading Limits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Search inside category */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${categoryArticles.length} essays in ${category.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Tabs */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden md:inline">Sort:</span>
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setSortBy('latest')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  sortBy === 'latest'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  sortBy === 'popular'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Most Read
              </button>
              <button
                onClick={() => setSortBy('claps')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  sortBy === 'claps'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Most Loved
              </button>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="standard" />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 mb-16 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No matching essays found
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              Try adjusting your search terms or view all essays in this category.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Explore Other Categories */}
        <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                Explore Other Categories
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Dive into more wisdom across wealth, psychology, career, and digital income.
              </p>
            </div>
            <Link
              href="/articles"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Browse All Essays <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherCategories.map((other) => {
              const count = articles.filter(
                (a) => normalizeCategory(a.category) === other.id && a.status !== 'draft'
              ).length;

              return (
                <Link
                  key={other.id}
                  href={`/category/${other.slug}`}
                  className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                      {getIcon(other.iconName, 'w-5 h-5')}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {other.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {other.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span>{count} Essays</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-500" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
