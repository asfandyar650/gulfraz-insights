'use client';

import React from 'react';
import Link from 'next/link';
import { useArticles } from '../../../context/ArticlesContext';
import { ArticleDetail } from '../../../components/ArticleDetail';
import { Article } from '../../../types';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface ArticleDetailClientProps {
  fallbackArticle?: Article;
  slug: string;
}

export const ArticleDetailClient: React.FC<ArticleDetailClientProps> = ({
  fallbackArticle,
  slug,
}) => {
  const { getArticleBySlug } = useArticles();
  const article = getArticleBySlug(slug) || fallbackArticle;

  if (!article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Essay Not Found
        </h1>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          The essay you are looking for might have been moved or doesn&apos;t exist.
        </p>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all Essays
        </Link>
      </div>
    );
  }

  return <ArticleDetail article={article} />;
};
