'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Eye, Heart, Bookmark, Volume2, Pause, ArrowRight } from 'lucide-react';
import { Article } from '../types';
import { useReadingList } from '../context/ReadingListContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';

interface ArticleCardProps {
  article: Article;
  variant?: 'standard' | 'featured' | 'compact' | 'list';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'standard' }) => {
  const { isBookmarked, toggleBookmark } = useReadingList();
  const { playArticle, currentArticle, isPlaying } = useAudioPlayer();

  const bookmarked = isBookmarked(article.id);
  const isAudioActive = currentArticle?.id === article.id && isPlaying;

  const categoryStyles: Record<string, string> = {
    wealth: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60',
    mindset: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60',
    psychology: 'text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/60',
    career: 'text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-800/60',
  };

  const badgeClass = categoryStyles[article.category] || categoryStyles.wealth;

  if (variant === 'featured') {
    return (
      <div className="group relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 w-full max-w-full">
        {/* Image */}
        <Link
          href={`/articles/${article.slug}`}
          className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto overflow-hidden cursor-pointer block"
        >
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent lg:hidden" />
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-md">
              Featured Insight
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${badgeClass}`}>
                {article.category}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" /> {article.readTime}
              </span>
            </div>

            <Link href={`/articles/${article.slug}`}>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors tracking-tight line-clamp-3">
                {article.title}
              </h2>
            </Link>

            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
              {article.subtitle || article.excerpt}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" /> {article.claps}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {article.views}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  playArticle(article);
                }}
                className={`p-2 rounded-xl border transition-all ${
                  isAudioActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                }`}
                title={isAudioActive ? 'Pause Narration' : 'Listen with Audio Narration'}
              >
                {isAudioActive ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleBookmark(article.id);
                }}
                className={`p-2 rounded-xl border transition-all ${
                  bookmarked
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                }`}
                title="Bookmark article"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              </button>

              <Link
                href={`/articles/${article.slug}`}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-colors shadow"
              >
                Read <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 hover:shadow-lg transition-all flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
        <Link href={`/articles/${article.slug}`} className="w-full sm:w-48 h-40 sm:h-32 shrink-0 rounded-xl overflow-hidden block">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeClass}`}>
                {article.category}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {article.readTime}
              </span>
            </div>
            <Link href={`/articles/${article.slug}`}>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                {article.title}
              </h3>
            </Link>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {article.subtitle || article.excerpt}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" /> {article.claps}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {article.views}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => playArticle(article)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Listen"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleBookmark(article.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Save"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-emerald-500 text-emerald-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Card
  return (
    <div className="group flex flex-col justify-between rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 h-full">
      {/* Thumbnail */}
      <div className="relative">
        <Link href={`/articles/${article.slug}`} className="block h-48 sm:h-52 overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${badgeClass}`}>
            {article.category}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={() => playArticle(article)}
            className={`p-1.5 rounded-lg backdrop-blur-md shadow-sm transition-all ${
              isAudioActive
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-900/70 hover:bg-slate-900 text-white'
            }`}
            title="Listen to Narration"
          >
            {isAudioActive ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => toggleBookmark(article.id)}
            className={`p-1.5 rounded-lg backdrop-blur-md shadow-sm transition-all ${
              bookmarked
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900/70 hover:bg-slate-900 text-white'
            }`}
            title="Save to Reading List"
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-2.5">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {article.readTime}
            </span>
            <span>•</span>
            <span>{article.publishedAt}</span>
          </div>

          <Link href={`/articles/${article.slug}`}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h3>
          </Link>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {article.subtitle || article.excerpt}
          </p>
        </div>

        {/* Card Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" /> {article.claps}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Eye className="w-3.5 h-3.5" /> {article.views}
            </span>
          </div>

          <Link
            href={`/articles/${article.slug}`}
            className="font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
          >
            Read <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
