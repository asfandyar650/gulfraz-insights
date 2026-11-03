'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Article, SeoAnalysisResult } from '../types';
import { defaultArticles } from '../data/siteData';
import { analyzeArticleSeo } from '../lib/seoAnalyzer';
import {
  isFirebaseConfigured,
  getFirebaseArticles,
  publishArticleToFirebase,
  deleteArticleFromFirebase,
  subscribeToArticles,
  syncAllArticlesToFirebase,
  getActiveFirebaseConfig,
} from '../lib/firebase';

interface ArticlesContextType {
  articles: Article[];
  getArticleBySlug: (slug: string) => Article | undefined;
  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  incrementClaps: (id: string) => void;
  incrementViews: (id: string) => void;
  resetToDefaults: () => void;
  firebaseActive: boolean;
  refreshFromFirebase: () => Promise<void>;
  syncAllToFirebase: () => Promise<{ success: boolean; count: number }>;
  mongoActive: boolean;
  refreshFromMongo: () => Promise<void>;
  syncAllToMongo: () => Promise<{ success: boolean; count: number; error?: string }>;
  reanalyzeArticle: (id: string) => SeoAnalysisResult | null;
  reanalyzeAllArticles: () => Promise<number>;
  togglePinArticle: (id: string) => void;
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
  firebaseActive: false,
  refreshFromFirebase: async () => {},
  syncAllToFirebase: async () => ({ success: false, count: 0 }),
  mongoActive: false,
  refreshFromMongo: async () => {},
  syncAllToMongo: async () => ({ success: false, count: 0 }),
  reanalyzeArticle: () => null,
  reanalyzeAllArticles: async () => 0,
  togglePinArticle: () => {},
});

export const ArticlesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>(defaultArticles);
  const [mounted, setMounted] = useState(false);
  const [firebaseActive, setFirebaseActive] = useState(false);
  const [mongoActive, setMongoActive] = useState(false);

  const saveArticlesLocally = useCallback((newArticles: Article[]) => {
    try {
      localStorage.setItem('gulfraz_active_articles', JSON.stringify(newArticles));
    } catch (e) {
      console.warn('Error saving articles locally:', e);
    }
  }, []);

  const refreshFromFirebase = useCallback(async () => {
    if (!isFirebaseConfigured()) return;
    try {
      const remoteArticles = await getFirebaseArticles();
      if (remoteArticles.length > 0) {
        setArticles((prev) => {
          const remoteIds = new Set(remoteArticles.map((r) => r.id));
          const nonOverridden = prev.filter((p) => !remoteIds.has(p.id));
          const merged = [...remoteArticles, ...nonOverridden];
          saveArticlesLocally(merged);
          return merged;
        });
        setFirebaseActive(true);
      }
    } catch (err) {
      console.warn('Manual Firebase refresh error:', err);
    }
  }, [saveArticlesLocally]);

  const refreshFromMongo = useCallback(async () => {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const data = await res.json();
        if (data.configured && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
          saveArticlesLocally(data.articles);
          setMongoActive(true);
        } else if (data.configured) {
          setMongoActive(true);
        }
      }
    } catch (err) {
      console.warn('Manual MongoDB refresh error:', err);
    }
  }, [saveArticlesLocally]);

  const syncAllToMongo = useCallback(async (): Promise<{ success: boolean; count: number; error?: string }> => {
    try {
      const res = await fetch('/api/articles/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles }),
      });
      const data = await res.json();
      if (data.success) {
        setMongoActive(true);
        return { success: true, count: data.count || articles.length };
      }
      return { success: false, count: 0, error: data.error || 'Failed to sync' };
    } catch (err: any) {
      return { success: false, count: 0, error: err?.message || 'Network error' };
    }
  }, [articles]);

  useEffect(() => {
    // 1. Load from local cache first
    try {
      const stored = localStorage.getItem('gulfraz_active_articles');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const custom = parsed.filter((a: Article) => a.id.startsWith('custom-'));
          const merged = [...custom, ...defaultArticles.filter((d) => !custom.some((c) => c.id === d.id))];
          setArticles(parsed.length >= defaultArticles.length ? parsed : merged);
        }
      }
    } catch (e) {
      console.warn('Error reading stored articles:', e);
    }

    // 2. Check if MongoDB has articles available
    refreshFromMongo();

    // 3. Setup real-time listener if Firebase is configured
    if (isFirebaseConfigured()) {
      setFirebaseActive(true);
      const unsubscribe = subscribeToArticles((remoteArticles) => {
        setArticles((prev) => {
          const remoteIds = new Set(remoteArticles.map((r) => r.id));
          const nonOverridden = prev.filter((p) => !remoteIds.has(p.id));
          const merged = [...remoteArticles, ...nonOverridden];
          saveArticlesLocally(merged);
          return merged;
        });
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }

    setMounted(true);
  }, [saveArticlesLocally, refreshFromMongo]);

  const getArticleBySlug = useCallback(
    (slug: string) => {
      return articles.find((a) => a.slug === slug || a.id === slug);
    },
    [articles]
  );

  const addArticle = useCallback(
    (article: Article) => {
      // Automatically evaluate SEO score and heuristics
      const analysis = analyzeArticleSeo(article);
      const enriched: Article = {
        ...article,
        seoScore: analysis.score,
        seoAnalysis: analysis,
        seoIssues: analysis.issues,
        seoSuggestions: analysis.suggestions,
        lastAnalyzedAt: analysis.analyzedAt,
        pinned: article.pinned || false,
      };

      setArticles((prev) => {
        const updated = [enriched, ...prev];
        saveArticlesLocally(updated);
        return updated;
      });

      if (isFirebaseConfigured()) {
        publishArticleToFirebase(enriched).catch(console.error);
      }

      // Also persist to MongoDB Atlas via API
      fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: enriched }),
      }).catch((e) => console.warn('MongoDB auto-sync notice:', e));
    },
    [saveArticlesLocally]
  );

  const updateArticle = useCallback(
    (article: Article) => {
      // Automatically evaluate SEO score and heuristics
      const analysis = analyzeArticleSeo(article);
      const enriched: Article = {
        ...article,
        seoScore: analysis.score,
        seoAnalysis: analysis,
        seoIssues: analysis.issues,
        seoSuggestions: analysis.suggestions,
        lastAnalyzedAt: analysis.analyzedAt,
      };

      setArticles((prev) => {
        const updated = prev.map((a) => (a.id === article.id ? enriched : a));
        saveArticlesLocally(updated);
        return updated;
      });

      if (isFirebaseConfigured()) {
        publishArticleToFirebase(enriched).catch(console.error);
      }

      // Also persist to MongoDB Atlas via API
      fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: enriched }),
      }).catch((e) => console.warn('MongoDB auto-sync notice:', e));
    },
    [saveArticlesLocally]
  );

  const deleteArticle = useCallback(
    (id: string) => {
      setArticles((prev) => {
        const updated = prev.filter((a) => a.id !== id);
        saveArticlesLocally(updated);
        return updated;
      });

      if (isFirebaseConfigured()) {
        deleteArticleFromFirebase(id).catch(console.error);
      }

      // Also delete from MongoDB Atlas via API
      fetch(`/api/articles?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }).catch((e) => console.warn('MongoDB delete notice:', e));
    },
    [saveArticlesLocally]
  );

  // Re-analyze a single article's SEO quality
  const reanalyzeArticle = useCallback(
    (id: string): SeoAnalysisResult | null => {
      const target = articles.find((a) => a.id === id);
      if (!target) return null;

      const analysis = analyzeArticleSeo(target);
      const updatedArticle: Article = {
        ...target,
        seoScore: analysis.score,
        seoAnalysis: analysis,
        seoIssues: analysis.issues,
        seoSuggestions: analysis.suggestions,
        lastAnalyzedAt: analysis.analyzedAt,
      };

      setArticles((prev) => {
        const updated = prev.map((a) => (a.id === id ? updatedArticle : a));
        saveArticlesLocally(updated);
        return updated;
      });

      if (isFirebaseConfigured()) {
        publishArticleToFirebase(updatedArticle).catch(console.error);
      }

      fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: updatedArticle }),
      }).catch((e) => console.warn('MongoDB auto-sync notice:', e));

      return analysis;
    },
    [articles, saveArticlesLocally]
  );

  // Re-analyze all articles in batch
  const reanalyzeAllArticles = useCallback(async (): Promise<number> => {
    const updatedArticles = articles.map((art) => {
      const analysis = analyzeArticleSeo(art);
      return {
        ...art,
        seoScore: analysis.score,
        seoAnalysis: analysis,
        seoIssues: analysis.issues,
        seoSuggestions: analysis.suggestions,
        lastAnalyzedAt: analysis.analyzedAt,
      };
    });

    setArticles(updatedArticles);
    saveArticlesLocally(updatedArticles);

    if (isFirebaseConfigured()) {
      syncAllArticlesToFirebase(updatedArticles).catch(console.error);
    }

    fetch('/api/articles/sync-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articles: updatedArticles }),
    }).catch((e) => console.warn('MongoDB batch sync notice:', e));

    return updatedArticles.length;
  }, [articles, saveArticlesLocally]);

  // Toggle admin pin override (pin to #1 position or unpin)
  const togglePinArticle = useCallback(
    (id: string) => {
      setArticles((prev) => {
        const updated = prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a));
        saveArticlesLocally(updated);

        const target = updated.find((a) => a.id === id);
        if (target) {
          if (isFirebaseConfigured()) {
            publishArticleToFirebase(target).catch(console.error);
          }
          fetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ article: target }),
          }).catch((e) => console.warn('MongoDB sync notice:', e));
        }

        return updated;
      });
    },
    [saveArticlesLocally]
  );

  const syncAllToFirebase = useCallback(async () => {
    return await syncAllArticlesToFirebase(articles);
  }, [articles]);

  const incrementClaps = useCallback(
    (id: string) => {
      setArticles((prev) => {
        const updated = prev.map((a) => (a.id === id ? { ...a, claps: a.claps + 1 } : a));
        saveArticlesLocally(updated);
        return updated;
      });
    },
    [saveArticlesLocally]
  );

  const incrementViews = useCallback(
    (id: string) => {
      setArticles((prev) => {
        const updated = prev.map((a) => (a.id === id ? { ...a, views: a.views + 1 } : a));
        saveArticlesLocally(updated);
        return updated;
      });
    },
    [saveArticlesLocally]
  );

  const resetToDefaults = useCallback(() => {
    try {
      localStorage.removeItem('gulfraz_active_articles');
    } catch {}
    setArticles(defaultArticles);
  }, []);

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
        firebaseActive,
        refreshFromFirebase,
        syncAllToFirebase,
        mongoActive,
        refreshFromMongo,
        syncAllToMongo,
        reanalyzeArticle,
        reanalyzeAllArticles,
        togglePinArticle,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticles = () => useContext(ArticlesContext);
