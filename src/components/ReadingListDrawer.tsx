'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, X, Clock, Trash2, ArrowRight } from 'lucide-react';
import { useReadingList } from '../context/ReadingListContext';
import { useArticles } from '../context/ArticlesContext';

export const ReadingListDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer, bookmarkedIds, removeBookmark } = useReadingList();
  const { articles } = useArticles();

  if (!isDrawerOpen) return null;

  const savedArticles = articles.filter((a) => bookmarkedIds.includes(a.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Bookmark className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">Reading List</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {savedArticles.length} {savedArticles.length === 1 ? 'article' : 'articles'} saved
                </p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Article List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {savedArticles.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Bookmark className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Your reading list is empty
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Click the bookmark icon on any article to save it for offline or later reading.
                </p>
              </div>
            ) : (
              savedArticles.map((article) => (
                <div
                  key={article.id}
                  className="group p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex gap-3.5 items-start"
                >
                  <Link href={`/articles/${article.slug}`} onClick={closeDrawer} className="shrink-0">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-16 h-16 rounded-lg object-cover cursor-pointer group-hover:opacity-90 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                        {article.category}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {article.readTime}
                      </span>
                    </div>
                    <Link
                      href={`/articles/${article.slug}`}
                      onClick={closeDrawer}
                      className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block"
                    >
                      {article.title}
                    </Link>
                    <div className="mt-2.5 flex items-center justify-between">
                      <Link
                        href={`/articles/${article.slug}`}
                        onClick={closeDrawer}
                        className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                      >
                        Read now <ArrowRight className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => removeBookmark(article.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                        title="Remove from list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {savedArticles.length > 0 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/80 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Saved locally on your device for high-speed instant access.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
