'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Article } from '../types';
import { defaultArticles } from '../data/siteData';

interface ArticlesContextType {
  articles: Article[];
  getArticleBySlug: (slug: string) => Article | undefined;
  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  incrementClaps: (id: string) => void;
  incrementViews: (id: string) => void;
  resetToDefaults: () => void;
}

const ArticlesContext = createContext<ArticlesContextType>({
  articles: defaultArticles,
  getArticleBySlug: () => undefined,
  addArticle: () => {},
  updateArticle: () => {},
  deleteArticle: () => {},
  incrementClaps: () => {},
  incrementViews: () => {},
  resetToDefaults: () => {},
});

export const ArticlesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>(defaultArticles);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gulfraz_active_articles');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge custom articles with default articles if needed
          const custom = parsed.filter((a: Article) => a.id.startsWith('custom-'));
          const merged = [...custom, ...defaultArticles.filter(d => !custom.some(c => c.id === d.id))];
          setArticles(parsed.length >= defaultArticles.length ? parsed : merged);
        }
      }
    } catch (e) {
      console.warn('Error reading stored articles:', e);
    }
    setMounted(true);
  }, []);

  const saveArticles = useCallback((newArticles: Article[]) => {
    try {
      localStorage.setItem('gulfraz_active_articles', JSON.stringify(newArticles));
    } catch (e) {
      console.warn('Error saving articles:', e);
    }
  }, []);

  const getArticleBySlug = useCallback((slug: string) => {
    return articles.find((a) => a.slug === slug || a.id === slug);
  }, [articles]);

  const addArticle = useCallback((article: Article) => {
    setArticles((prev) => {
      const updated = [article, ...prev];
      saveArticles(updated);
      return updated;
    });
  }, [saveArticles]);

  const updateArticle = useCallback((article: Article) => {
    setArticles((prev) => {
      const updated = prev.map((a) => (a.id === article.id ? article : a));
      saveArticles(updated);
      return updated;
    });
  }, [saveArticles]);

  const deleteArticle = useCallback((id: string) => {
    setArticles((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      saveArticles(updated);
      return updated;
    });
  }, [saveArticles]);

  const incrementClaps = useCallback((id: string) => {
    setArticles((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, claps: a.claps + 1 } : a));
      saveArticles(updated);
      return updated;
    });
  }, [saveArticles]);

  const incrementViews = useCallback((id: string) => {
    setArticles((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, views: a.views + 1 } : a));
      saveArticles(updated);
      return updated;
    });
  }, [saveArticles]);

  const resetToDefaults = useCallback(() => {
    setArticles(defaultArticles);
    saveArticles(defaultArticles);
  }, [saveArticles]);

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        getArticleBySlug,
        addArticle,
        updateArticle,
        deleteArticle,
        incrementClaps,
        incrementViews,
        resetToDefaults,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticles = () => useContext(ArticlesContext);
