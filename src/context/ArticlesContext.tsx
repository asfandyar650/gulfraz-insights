'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Article } from '../types';
import { defaultArticles } from '../data/siteData';
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
      setArticles((prev) => {
        const updated = [article, ...prev];
        saveArticlesLocally(updated);
        return updated;
      });

      if (isFirebaseConfigured()) {
        publishArticleToFirebase(article).catch(console.error);
      }

      // Also persist to MongoDB Atlas via API
      fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article }),
      }).catch((e) => console.warn('MongoDB auto-sync notice:', e));
    },
    [saveArticlesLocally]
  );

  const updateArticle = useCallback(
    (article: Article) => {
      setArticles((prev) => {
        const updated = prev.map((a) => (a.id === article.id ? article : a));
        saveArticlesLocally(updated);
        return updated;
      });

      if (isFirebaseConfigured()) {
        publishArticleToFirebase(article).catch(console.error);
      }

      // Also persist to MongoDB Atlas via API
      fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article }),
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
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticles = () => useContext(ArticlesContext);
