'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useArticles } from '../context/ArticlesContext';
import { Hero } from '../components/Hero';
import { CategorySection } from '../components/CategorySection';
import { FreedomCalculator } from '../components/FreedomCalculator';

export default function HomePage() {
  const router = useRouter();
  const { articles } = useArticles();

  // If someone lands with hash like #the-secrets-of-millionaire-fastlane..., route them to the article page
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '').replace(/^\//, '');
      if (hash && hash !== 'home' && hash !== '') {
        const found = articles.find((a) => a.slug === hash || a.id === hash);
        if (found) {
          router.push(`/articles/${found.slug}`);
        }
      }
    }
  }, [articles, router]);

  const featured = articles.find((a) => a.featured) || articles[0];

  return (
    <div>
      <Hero featuredArticle={featured} />

      <CategorySection articles={articles} />

      {/* Practical Freedom Calculator section on Home */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Practical Tool
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            How Far Are You from Financial Freedom?
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-lg leading-relaxed">
            A transparent tool to see how saving consistently and investing in index funds affects your timeline. Adjust the numbers below to explore your personal trajectory.
          </p>
        </div>

        <FreedomCalculator />
      </section>
    </div>
  );
}
