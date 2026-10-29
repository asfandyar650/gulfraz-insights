'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useArticles } from '../../context/ArticlesContext';
import { ArticlesList } from '../../components/ArticlesList';

function ArticlesContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const { articles } = useArticles();

  return <ArticlesList articles={articles} initialCategory={categoryParam} />;
}

export default function ArticlesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ArticlesContent />
    </Suspense>
  );
}
