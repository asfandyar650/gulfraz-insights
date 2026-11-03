'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Save,
  X,
  FileText,
  Clock,
  ArrowLeft,
  LogOut,
  Database,
  RefreshCw,
  UploadCloud,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Quote as QuoteIcon,
  Heading,
  List,
  ListOrdered,
  Minus,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  FileDown,
  BookOpen,
  Calendar,
  Globe,
  Sliders,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle2,
  Pin,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useArticles } from '../context/ArticlesContext';
import { useToast } from '../context/ToastContext';
import { Article, CategoryId, ContentBlock, ContentBlockType, SeoAnalysisResult, SeoGrade } from '../types';
import { author } from '../data/siteData';
import { ArticleDetail } from './ArticleDetail';
import { categories, normalizeCategory, getCategoryLabel, getCategoryBadgeClass } from '../lib/categories';
import { ensureContentBlocks, contentBlocksToSections, createEmptyBlock } from '../lib/contentBlocks';
import {
  analyzeArticleSeo,
  sortArticlesBySeoRank,
  getSeoGradeBadge,
  getSeoScoreColor,
  getSeoBarColor
} from '../lib/seoAnalyzer';
import {
  saveFirebaseConfig,
  clearFirebaseConfig,
  getActiveFirebaseConfig,
  isFirebaseConfigured,
} from '../lib/firebase';

export const AdminStudio: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const {
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    firebaseActive,
    refreshFromFirebase,
    syncAllToFirebase,
    mongoActive,
    refreshFromMongo,
    syncAllToMongo,
    reanalyzeArticle,
    reanalyzeAllArticles,
    togglePinArticle,
  } = useArticles();
  const { showToast } = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview' | 'manage' | 'seo' | 'database'>('write');
  const [editingId, setEditingId] = useState<string | null>(null);

  // SEO Ranking System States
  const [reanalyzingAll, setReanalyzingAll] = useState(false);
  const [analyzingSingleId, setAnalyzingSingleId] = useState<string | null>(null);
  const [seoSearchQuery, setSeoSearchQuery] = useState('');
  const [seoGradeFilter, setSeoGradeFilter] = useState<'all' | 'excellent' | 'good' | 'needs-improvement' | 'poor' | 'pinned'>('all');
  const [expandedBreakdownId, setExpandedBreakdownId] = useState<string | null>(null);

  // Database mode (Firebase primary, MongoDB Atlas alternative)
  const [dbMode, setDbMode] = useState<'firebase' | 'mongodb'>('firebase');
  const [mongoUri, setMongoUri] = useState('');
  const [testingMongo, setTestingMongo] = useState(false);
  const [syncingMongo, setSyncingMongo] = useState(false);
  const [mongoDocCount, setMongoDocCount] = useState<number | null>(null);

  // Firebase Config states
  const [fbApiKey, setFbApiKey] = useState('AIzaSyA9R4nsloyP65CSa01Bx8rIJ-F6xj-Frow');
  const [fbProjectId, setFbProjectId] = useState('gulfraz-insights');
  const [fbAuthDomain, setFbAuthDomain] = useState('gulfraz-insights.firebaseapp.com');
  const [fbStorageBucket, setFbStorageBucket] = useState('gulfraz-insights.firebasestorage.app');
  const [fbSenderId, setFbSenderId] = useState('149272727698');
  const [fbAppId, setFbAppId] = useState('1:149272727698:web:865fd8fe28e547a04f564b');
  const [rawConfigText, setRawConfigText] = useState('');
  const [syncingAll, setSyncingAll] = useState(false);

  // Publishing & SEO metadata
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<CategoryId>('wealth-investing');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1400&q=80'
  );
  const [tags, setTags] = useState('Wealth, Strategy, Psychology');
  const [authorName, setAuthorName] = useState(author.name);
  const [publishedDate, setPublishedDate] = useState(
    new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  );
  const [customSlug, setCustomSlug] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>([
    'First strategic takeaway for readers.',
    'Second actionable principle to apply immediately.',
  ]);

  // Block-based content system (UNLIMITED paragraphs, headings, quotes, images, etc.)
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    {
      id: 'blk-init-h1',
      type: 'heading',
      text: 'The Core Principle',
      level: 2,
    },
    {
      id: 'blk-init-p1',
      type: 'paragraph',
      text: 'Write your opening insights and introduction here. There is no artificial limit on the number of paragraphs you can write.',
    },
    {
      id: 'blk-init-q1',
      type: 'quote',
      quoteText: 'Simplicity and leverage are the ultimate drivers of wealth.',
      quoteAuthor: 'Gulfraz Khan',
      quoteSource: 'Gulfraz Insights',
    },
    {
      id: 'blk-init-p2',
      type: 'paragraph',
      text: 'Continue with further analysis, practical takeaways, and lessons. You can insert quotes or images between any paragraphs at any time.',
    },
  ]);

  const [copiedJson, setCopiedJson] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const DEFAULT_COVER_IMAGE =
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1400&q=80';

  useEffect(() => {
    try {
      if (sessionStorage.getItem('gulfraz_admin_session') === 'true') {
        setIsAuthenticated(true);
      }
    } catch {}

    // Pre-fill existing MongoDB URI if saved
    try {
      const savedMongo = localStorage.getItem('gulfraz_mongodb_uri');
      const activeUri = savedMongo || 'mongodb+srv://abaseerkhan9_db_user:ynPsDjBcCwHyZgLs@cluster0.d7r2bt3.mongodb.net/gulfraz_insights?retryWrites=true&w=majority';
      setMongoUri(activeUri);

      // Auto-check connection
      fetch('/api/articles/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri: activeUri }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setMongoDocCount(data.count ?? 73);
        })
        .catch(() => {});
    } catch {}

    // Pre-fill existing Firebase credentials if configured
    const currentConfig = getActiveFirebaseConfig();
    if (currentConfig) {
      setFbApiKey(currentConfig.apiKey || '');
      setFbProjectId(currentConfig.projectId || '');
      setFbAuthDomain(currentConfig.authDomain || '');
      setFbStorageBucket(currentConfig.storageBucket || '');
      setFbSenderId(currentConfig.messagingSenderId || '');
      setFbAppId(currentConfig.appId || '');
    }
  }, []);

  // Block management functions
  const handleAddBlock = (type: ContentBlockType, atIndex?: number) => {
    const newBlock = createEmptyBlock(type);
    if (typeof atIndex === 'number' && atIndex >= 0 && atIndex <= blocks.length) {
      const updated = [...blocks];
      updated.splice(atIndex + 1, 0, newBlock);
      setBlocks(updated);
    } else {
      setBlocks((prev) => [...prev, newBlock]);
    }
    showToast(`Added ${type} block`, 'info');
  };

  const handleUpdateBlock = (index: number, updates: Partial<ContentBlock>) => {
    setBlocks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const handleDeleteBlock = (index: number) => {
    if (blocks.length <= 1) {
      showToast('At least one content block is required.', 'error');
      return;
    }
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setBlocks(updated);
  };

  const handleDuplicateBlock = (index: number) => {
    const original = blocks[index];
    const duplicated: ContentBlock = {
      ...JSON.parse(JSON.stringify(original)),
      id: 'blk-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    };
    const updated = [...blocks];
    updated.splice(index + 1, 0, duplicated);
    setBlocks(updated);
    showToast('Block duplicated', 'info');
  };

  // Image Upload handler for content block
  const handleImageUploadForBlock = (e: React.ChangeEvent<HTMLInputElement>, blockIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      handleUpdateBlock(blockIndex, { url: dataUrl });
      showToast('Image uploaded successfully from your computer!', 'success');
    };
    reader.onerror = () => {
      showToast('Failed to read image file.', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Image Upload for cover image
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImage(reader.result as string);
      showToast('Cover image updated from your computer!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Estimated read time calculation
  const readTimeCalculated = useMemo(() => {
    let wordCount = (title + ' ' + subtitle + ' ' + excerpt).split(/\s+/).filter(Boolean).length;
    blocks.forEach((b) => {
      if (b.text) wordCount += b.text.split(/\s+/).filter(Boolean).length;
      if (b.quoteText) wordCount += b.quoteText.split(/\s+/).filter(Boolean).length;
      if (b.items) wordCount += b.items.join(' ').split(/\s+/).filter(Boolean).length;
    });
    return `${Math.max(1, Math.ceil(wordCount / 180))} min read`;
  }, [title, subtitle, excerpt, blocks]);

  // Derived slug
  const finalSlug = useMemo(() => {
    if (customSlug.trim()) {
      return customSlug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    return (title || 'untitled-essay')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }, [customSlug, title]);

  // Full article draft object
  const articleDraft = useMemo((): Article => {
    const existing = editingId ? articles.find((a) => a.id === editingId) : null;

    return {
      id: editingId || `custom-${Date.now()}`,
      slug: finalSlug,
      title: title || 'Untitled Strategic Insight',
      subtitle: subtitle || 'Brief overview of this insight',
      excerpt: excerpt || subtitle || 'A practical breakdown of key ideas.',
      category: normalizeCategory(category),
      author: {
        ...author,
        name: authorName || author.name,
      },
      publishedAt: publishedDate || existing?.publishedAt || new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      readTime: readTimeCalculated,
      coverImage: coverImage || DEFAULT_COVER_IMAGE,
      tags: tags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean),
      featured: existing?.featured || false,
      trending: existing?.trending || true,
      views: existing?.views || 1,
      claps: existing?.claps || 0,
      keyTakeaways: keyTakeaways.filter((t) => t.trim() !== ''),
      contentBlocks: blocks,
      sections: contentBlocksToSections(blocks),
      status,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt || subtitle,
      updatedAt: new Date().toISOString(),
    };
  }, [
    editingId,
    articles,
    finalSlug,
    title,
    subtitle,
    excerpt,
    category,
    authorName,
    publishedDate,
    readTimeCalculated,
    coverImage,
    tags,
    keyTakeaways,
    blocks,
    status,
    seoTitle,
    seoDescription,
  ]);

  // Live real-time SEO analysis of currently edited draft
  const draftSeoAnalysis = useMemo(() => {
    try {
      return analyzeArticleSeo(articleDraft);
    } catch {
      return null;
    }
  }, [articleDraft]);

  // Ranked articles according to intelligent SEO system (including drafts with rank indicators)
  const rankedArticles = useMemo(() => {
    return sortArticlesBySeoRank(articles, true);
  }, [articles]);

  // Overall SEO Health Stats
  const seoStats = useMemo(() => {
    const published = articles.filter((a) => a.status !== 'draft');
    if (published.length === 0) {
      return { average: 0, excellent: 0, good: 0, needsImprovement: 0, poor: 0, total: 0, pinned: 0 };
    }
    const scores = published.map((a) => (typeof a.seoScore === 'number' ? a.seoScore : 0));
    const average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const excellent = published.filter((a) => (a.seoScore || 0) >= 90).length;
    const good = published.filter((a) => (a.seoScore || 0) >= 75 && (a.seoScore || 0) < 90).length;
    const needsImprovement = published.filter((a) => (a.seoScore || 0) >= 50 && (a.seoScore || 0) < 75).length;
    const poor = published.filter((a) => (a.seoScore || 0) < 50).length;
    const pinned = published.filter((a) => a.pinned).length;
    return { average, excellent, good, needsImprovement, poor, total: published.length, pinned };
  }, [articles]);

  // Filtered ranked articles for SEO Management tab
  const filteredRankedArticles = useMemo(() => {
    return rankedArticles.filter((art) => {
      // Filter by search query
      if (seoSearchQuery.trim()) {
        const q = seoSearchQuery.toLowerCase();
        const matches =
          art.title.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q) ||
          (art.seoAnalysis?.targetKeyword && art.seoAnalysis.targetKeyword.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Filter by grade
      if (seoGradeFilter === 'all') return true;
      if (seoGradeFilter === 'pinned') return !!art.pinned;
      const score = typeof art.seoScore === 'number' ? art.seoScore : 0;
      if (seoGradeFilter === 'excellent') return score >= 90;
      if (seoGradeFilter === 'good') return score >= 75 && score < 90;
      if (seoGradeFilter === 'needs-improvement') return score >= 50 && score < 75;
      if (seoGradeFilter === 'poor') return score < 50;
      return true;
    });
  }, [rankedArticles, seoSearchQuery, seoGradeFilter]);

  // Handle re-analyzing all articles in batch
  const handleReanalyzeAll = async () => {
    setReanalyzingAll(true);
    showToast('Re-analyzing SEO across all published essays...', 'info');
    try {
      const count = await reanalyzeAllArticles();
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      } catch {}
      showToast(`🎉 Successfully evaluated & ranked all ${count} essays!`, 'success');
    } catch (err: any) {
      showToast(`Re-analysis notice: ${err?.message || 'Done'}`, 'error');
    } finally {
      setReanalyzingAll(false);
    }
  };

  // Handle re-analyzing a single article
  const handleAnalyzeSingle = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAnalyzingSingleId(id);
    const result = reanalyzeArticle(id);
    setAnalyzingSingleId(null);
    if (result) {
      showToast(`📊 Re-analyzed! New SEO Score: ${result.score}/100 (${result.grade.toUpperCase()})`, 'success');
    } else {
      showToast('Could not re-analyze this article.', 'error');
    }
  };

  // Handle toggle pin / override ranking
  const handleTogglePin = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    togglePinArticle(id);
    const art = articles.find((a) => a.id === id);
    const willPin = !art?.pinned;
    showToast(
      willPin
        ? '📌 Article pinned to #1 position on homepage!'
        : '📌 Article unpinned; restored to automatic SEO score ranking.',
      'info'
    );
  };

  // Load article for editing
  const loadArticleToEdit = (art: Article) => {
    setEditingId(art.id);
    setTitle(art.title);
    setSubtitle(art.subtitle || '');
    setExcerpt(art.excerpt || art.subtitle || '');
    setCategory(normalizeCategory(art.category));
    setCoverImage(art.coverImage);
    setTags(art.tags ? art.tags.join(', ') : 'Wealth, Strategy');
    setAuthorName(art.author?.name || author.name);
    setPublishedDate(art.publishedAt);
    setCustomSlug(art.slug);
    setSeoTitle(art.seoTitle || art.title);
    setSeoDescription(art.seoDescription || art.subtitle || art.excerpt);
    setStatus(art.status || 'published');
    setKeyTakeaways(art.keyTakeaways && art.keyTakeaways.length > 0 ? art.keyTakeaways : ['']);

    // Ensure content blocks
    const loadedBlocks = ensureContentBlocks(art);
    setBlocks(loadedBlocks);

    setActiveTab('write');
    showToast(`Loaded "${art.title.slice(0, 30)}..." for editing`, 'info');
  };

  useEffect(() => {
    if (editId && articles.length > 0) {
      const art = articles.find((a) => a.id === editId || a.slug === editId);
      if (art) {
        loadArticleToEdit(art);
      }
    }
  }, [editId, articles]);

  const handleResetForm = () => {
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setExcerpt('');
    setCategory('wealth-investing');
    setCoverImage(DEFAULT_COVER_IMAGE);
    setTags('Wealth, Strategy, Mindset');
    setCustomSlug('');
    setSeoTitle('');
    setSeoDescription('');
    setStatus('published');
    setKeyTakeaways([
      'First strategic takeaway for readers.',
      'Second actionable principle to apply immediately.',
    ]);
    setBlocks([
      {
        id: 'blk-init-h1',
        type: 'heading',
        text: 'The Core Principle',
        level: 2,
      },
      {
        id: 'blk-init-p1',
        type: 'paragraph',
        text: 'Write your opening insights and introduction here...',
      },
    ]);
    showToast('Editor reset for new blog.', 'info');
  };

  const handleSaveOrPublish = (publishStatus: 'published' | 'draft') => {
    if (!title.trim()) {
      showToast('Please enter an article title.', 'error');
      return;
    }

    const payload: Article = {
      ...articleDraft,
      status: publishStatus,
    };

    if (editingId) {
      updateArticle(payload);
      showToast(
        publishStatus === 'draft'
          ? '💾 Saved blog as draft!'
          : '🎉 Blog post updated and published live!',
        'success'
      );
      setEditingId(null);
    } else {
      addArticle(payload);
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch {}
      showToast(
        publishStatus === 'draft'
          ? '💾 Blog saved to drafts!'
          : '🎉 New article published live to website!',
        'success'
      );
    }

    if (publishStatus === 'published') {
      router.push(`/articles/${payload.slug}`);
    } else {
      setActiveTab('manage');
    }
  };

  const handleDelete = (art: Article) => {
    if (window.confirm(`Are you sure you want to permanently delete "${art.title}"?`)) {
      deleteArticle(art.id);
      if (editingId === art.id) {
        handleResetForm();
      }
      showToast(`Deleted "${art.title.slice(0, 25)}..."`, 'info');
    }
  };

  const handleCopyJSON = () => {
    const jsonStr = JSON.stringify(articleDraft, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedJson(true);
    showToast('Article JSON copied to clipboard!', 'success');
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'gulfraz123') {
      sessionStorage.setItem('gulfraz_admin_session', 'true');
      setIsAuthenticated(true);
      setPassword('');
      showToast('Welcome to Gulfraz Insights Studio!', 'success');
    } else {
      showToast('Incorrect access code.', 'error');
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('gulfraz_admin_session');
    } catch {}
    setIsAuthenticated(false);
    setPassword('');
    showToast('You have logged out of Admin Studio.', 'info');
  };

  // MongoDB & Firebase handlers
  const handleTestAndSaveMongo = async () => {
    if (!mongoUri.trim()) {
      showToast('Please enter your MongoDB Atlas connection string.', 'error');
      return;
    }
    setTestingMongo(true);
    showToast('Testing MongoDB Atlas connection...', 'info');
    try {
      const res = await fetch('/api/articles/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri: mongoUri.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMongoDocCount(data.count ?? 0);
        try {
          localStorage.setItem('gulfraz_mongodb_uri', mongoUri.trim());
        } catch {}
        await refreshFromMongo();
        try {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        } catch {}
        showToast(`🍃 Successfully connected to MongoDB Atlas! (${data.count} blogs in collection)`, 'success');
      } else {
        showToast(data.error || 'Failed to connect to MongoDB Atlas.', 'error');
      }
    } catch (err: any) {
      showToast(`Connection error: ${err?.message || 'Check network'}`, 'error');
    } finally {
      setTestingMongo(false);
    }
  };

  const handleDisconnectMongo = () => {
    if (window.confirm('Disconnect from MongoDB Atlas?')) {
      try {
        localStorage.removeItem('gulfraz_mongodb_uri');
      } catch {}
      setMongoUri('');
      setMongoDocCount(null);
      showToast('MongoDB Atlas connection cleared.', 'info');
    }
  };

  const handleSyncAllToMongo = async () => {
    setSyncingMongo(true);
    showToast('Uploading all 73 essays into MongoDB Atlas database...', 'info');
    try {
      const res = await syncAllToMongo();
      if (res.success) {
        setMongoDocCount(res.count);
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
        } catch {}
        showToast(`🎉 Successfully uploaded ${res.count} essays to MongoDB Atlas database!`, 'success');
      } else {
        showToast(res.error || 'Failed to sync essays to MongoDB Atlas.', 'error');
      }
    } catch (err: any) {
      showToast(`Sync error: ${err?.message || 'Check connection'}`, 'error');
    } finally {
      setSyncingMongo(false);
    }
  };

  const handleAutoParseFirebase = (text: string) => {
    setRawConfigText(text);
    try {
      const extract = (key: string) => {
        const regex = new RegExp(`['"]?${key}['"]?\\s*:\\s*['"]([^'"]+)['"]`, 'i');
        const match = text.match(regex);
        return match ? match[1] : '';
      };
      const apiKey = extract('apiKey');
      const projectId = extract('projectId');
      const authDomain = extract('authDomain');
      const storageBucket = extract('storageBucket');
      const messagingSenderId = extract('messagingSenderId');
      const appId = extract('appId');

      if (apiKey) setFbApiKey(apiKey);
      if (projectId) setFbProjectId(projectId);
      if (authDomain) setFbAuthDomain(authDomain);
      if (storageBucket) setFbStorageBucket(storageBucket);
      if (messagingSenderId) setFbSenderId(messagingSenderId);
      if (appId) setFbAppId(appId);

      if (apiKey && projectId) {
        showToast('Successfully extracted Firebase credentials!', 'success');
      }
    } catch {}
  };

  const handleSaveFirebaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbApiKey || !fbProjectId) {
      showToast('Please provide at least the API Key and Project ID.', 'error');
      return;
    }
    const config = {
      apiKey: fbApiKey.trim(),
      projectId: fbProjectId.trim(),
      authDomain: fbAuthDomain.trim(),
      storageBucket: fbStorageBucket.trim(),
      messagingSenderId: fbSenderId.trim(),
      appId: fbAppId.trim(),
    };
    saveFirebaseConfig(config);
    showToast('Firebase configuration saved! Connecting to Firestore...', 'info');
    try {
      await refreshFromFirebase();
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      showToast('🔥 Connected to Firebase Firestore successfully!', 'success');
    } catch (err: any) {
      showToast(`Saved locally. Network/Auth error: ${err?.message || 'Check Firestore Rules'}`, 'error');
    }
  };

  const handleDisconnectFirebase = () => {
    if (window.confirm('Are you sure you want to disconnect from Firebase?')) {
      clearFirebaseConfig();
      setFbApiKey('');
      setFbProjectId('');
      setFbAuthDomain('');
      setFbStorageBucket('');
      setFbSenderId('');
      setFbAppId('');
      setRawConfigText('');
      showToast('Firebase connection cleared.', 'info');
    }
  };

  const handleSyncAllEssaysFirebase = async () => {
    if (!isFirebaseConfigured()) {
      showToast('Please connect your Firebase credentials first.', 'error');
      return;
    }
    setSyncingAll(true);
    showToast('Syncing all 73 essays into Firestore database...', 'info');
    try {
      const result = await syncAllToFirebase();
      if (result.success) {
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
        } catch {}
        showToast(`🎉 Successfully uploaded ${result.count} essays to Firebase Firestore!`, 'success');
      } else {
        showToast('Sync failed or partially completed. Please ensure Firestore rules allow read/write.', 'error');
      }
    } catch (err: any) {
      showToast(`Sync error: ${err?.message || 'Check Firestore rules'}`, 'error');
    } finally {
      setSyncingAll(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Author Publishing Studio
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Enter the author passkey to write, edit, and manage essays on Gulfraz Insights.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter passkey"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" /> Unlock Studio
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-emerald-500 transition-colors inline-flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Editing Banner */}
      {editingId && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Edit3 className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Editing Existing Blog Post
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-xl">
                {title || 'Untitled Post'}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetForm}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Cancel Edit (New Post)
          </button>
        </div>
      )}

      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/assets/gulfraz-logo.png"
            alt="Gulfraz Logo"
            className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 dark:border-slate-800 shadow-sm shrink-0 p-0.5"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white truncate">
                Gulfraz Insights Content Studio
              </h1>
              {mongoActive ? (
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                  🍃 MongoDB Live
                </span>
              ) : firebaseActive ? (
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                  🔥 Firebase Live
                </span>
              ) : (
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                  ⚡ Auto-Publish Live
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 truncate">
              Unlimited Paragraphs • Quotes Anywhere • Unlimited Local Images
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Tab buttons */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'write'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> {editingId ? 'Edit Post' : 'Block Editor'}
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'manage'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> All Essays ({articles.length})
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'seo'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>SEO Ranking</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Smart
              </span>
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'database'
                  ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-500" />
              <span>Databases</span>
              {(firebaseActive || mongoActive) && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleSaveOrPublish('draft')}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Save as Draft"
            >
              <FileDown className="w-3.5 h-3.5" /> Save Draft
            </button>

            <button
              onClick={() => handleSaveOrPublish('published')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <Save className="w-3.5 h-3.5" /> {editingId ? 'Update & Publish' : 'Publish Live'}
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0"
              title="Log Out of Admin Panel"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Live Preview Tab */}
      {activeTab === 'preview' ? (
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-4 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> Live Production Reading Preview
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSaveOrPublish('draft')}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSaveOrPublish('published')}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
              >
                {editingId ? 'Update & Publish Live →' : 'Publish Live to Website →'}
              </button>
            </div>
          </div>
          <ArticleDetail article={articleDraft} />
        </div>
      ) : activeTab === 'manage' ? (
        /* Mode 2: Manage Tab */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                All Published Essays ({articles.length})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Manage, edit in block editor, or remove essays from your collection.
              </p>
            </div>
            <button
              onClick={() => {
                handleResetForm();
                setActiveTab('write');
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-md"
            >
              <Plus className="w-4 h-4" /> Create New Essay
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {articles.map((art) => (
              <div
                key={art.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-slate-50 dark:hover:bg-slate-850/50 p-3 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadgeClass(art.category)}`}>
                        {getCategoryLabel(art.category)}
                      </span>
                      {art.status === 'draft' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                          Draft
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{art.publishedAt}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{art.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    href={`/articles/${art.slug}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => loadArticleToEdit(art)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-bold border border-amber-500/30 flex items-center gap-1 transition-colors"
                    title="Edit blog in block editor"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Blocks
                  </button>
                  <button
                    onClick={() => handleDelete(art)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                    title="Delete this blog"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'seo' ? (
        /* Mode: SEO Quality & Automatic Blog Ranking */
        <div className="space-y-6">
          {/* SEO Header & Algorithm Explainer */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> Intelligent Ranking Engine
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  SEO Quality & Automatic Blog Ranking
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1.5 leading-relaxed">
                  Every blog is evaluated across 9 weighted factors out of 100. The blog with the highest score automatically appears first on your homepage, followed by the second and third. Recalculates automatically upon creating or editing a blog.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleReanalyzeAll}
                  disabled={reanalyzingAll}
                  className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
                >
                  <RefreshCw className={`w-4 h-4 ${reanalyzingAll ? 'animate-spin' : ''}`} />
                  {reanalyzingAll ? 'Analyzing All Blogs...' : `Re-Analyze All Blogs (${articles.length})`}
                </button>
              </div>
            </div>

            {/* Overview KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              {/* Average Score */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Average SEO Score
                </span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black ${getSeoScoreColor(seoStats.average)}`}>
                    {seoStats.average}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className={`h-full ${getSeoBarColor(seoStats.average)} transition-all duration-500`}
                    style={{ width: `${seoStats.average}%` }}
                  />
                </div>
              </div>

              {/* Excellent */}
              <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/30 border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Excellent (90–100)
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {seoStats.excellent}
                  </span>
                  <span className="text-xs text-slate-400">essays</span>
                </div>
                <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                  Top tier • Ranked #1 candidates
                </p>
              </div>

              {/* Good */}
              <div className="p-4 rounded-2xl bg-blue-500/5 dark:bg-blue-950/30 border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Good (75–89)
                  </span>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                    {seoStats.good}
                  </span>
                  <span className="text-xs text-slate-400">essays</span>
                </div>
                <p className="text-[11px] text-blue-600/70 dark:text-blue-400/70 mt-1">
                  High quality & relevance
                </p>
              </div>

              {/* Needs Improvement */}
              <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-950/30 border border-amber-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Needs Improvement
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
                    {seoStats.needsImprovement + seoStats.poor}
                  </span>
                  <span className="text-xs text-slate-400">essays</span>
                </div>
                <p className="text-[11px] text-amber-600/70 dark:text-amber-400/70 mt-1">
                  Has fixable SEO suggestions
                </p>
              </div>
            </div>

            {/* Criteria Weight Explainer Pill Bar */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Weighted Scoring Breakdown (Total: 100 Points):
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  Content Quality: <strong className="text-emerald-500">25 pts</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  Keyword Relevance: <strong className="text-emerald-500">15 pts</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  Title & Meta: <strong className="text-emerald-500">15 pts</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  Heading Structure: <strong className="text-emerald-500">10 pts</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  Readability: <strong className="text-emerald-500">10 pts</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  Originality: <strong className="text-emerald-500">10 pts</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  Image Optimization: <strong className="text-emerald-500">5 pts</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  Internal Linking: <strong className="text-emerald-500">5 pts</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  Search Intent: <strong className="text-emerald-500">5 pts</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Search, Filter & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={seoSearchQuery}
                onChange={(e) => setSeoSearchQuery(e.target.value)}
                placeholder="Search by blog title, keyword, or category..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setSeoGradeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  seoGradeFilter === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                All ({rankedArticles.length})
              </button>
              <button
                onClick={() => setSeoGradeFilter('excellent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  seoGradeFilter === 'excellent'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Excellent ({seoStats.excellent})
              </button>
              <button
                onClick={() => setSeoGradeFilter('good')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  seoGradeFilter === 'good'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Good ({seoStats.good})
              </button>
              <button
                onClick={() => setSeoGradeFilter('needs-improvement')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  seoGradeFilter === 'needs-improvement'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Needs Fixes ({seoStats.needsImprovement + seoStats.poor})
              </button>
              <button
                onClick={() => setSeoGradeFilter('pinned')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  seoGradeFilter === 'pinned'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                📌 Pinned ({seoStats.pinned || 0})
              </button>
            </div>
          </div>

          {/* Ranked Blog Cards List */}
          <div className="space-y-4">
            {filteredRankedArticles.map((art, idx) => {
              const score = typeof art.seoScore === 'number' ? art.seoScore : 0;
              const grade: SeoGrade =
                score >= 90 ? 'excellent' : score >= 75 ? 'good' : score >= 50 ? 'needs-improvement' : 'poor';
              const badge = getSeoGradeBadge(grade);
              const rankPosition = idx + 1;
              const isExpanded = expandedBreakdownId === art.id;
              const isAnalyzingThis = analyzingSingleId === art.id;

              return (
                <div
                  key={art.id}
                  className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all ${
                    art.pinned
                      ? 'border-emerald-500 shadow-lg shadow-emerald-500/10'
                      : rankPosition === 1
                      ? 'border-amber-400 shadow-md shadow-amber-500/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Rank, Image & Details */}
                      <div className="flex items-start sm:items-center gap-4 min-w-0">
                        {/* Rank Badge */}
                        <div className="flex flex-col items-center justify-center shrink-0">
                          {art.pinned ? (
                            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-slate-950 flex flex-col items-center justify-center font-black shadow-md">
                              <Pin className="w-4 h-4 fill-current" />
                              <span className="text-[9px] uppercase font-bold">PIN</span>
                            </div>
                          ) : rankPosition === 1 ? (
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex flex-col items-center justify-center font-black shadow-md">
                              <Award className="w-4 h-4" />
                              <span className="text-[10px] font-black leading-none">#1</span>
                            </div>
                          ) : rankPosition <= 3 ? (
                            <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-extrabold text-sm">
                              #{rankPosition}
                            </div>
                          ) : (
                            <div className="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-slate-850 text-slate-400 flex items-center justify-center font-bold text-xs">
                              #{rankPosition}
                            </div>
                          )}
                        </div>

                        {/* Article Cover Image */}
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />

                        {/* Title & Metadata */}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadgeClass(art.category)}`}>
                              {getCategoryLabel(art.category)}
                            </span>
                            {art.pinned && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                                <Pin className="w-2.5 h-2.5" /> Pinned Override
                              </span>
                            )}
                            {art.status === 'draft' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                                Draft (Not Ranked Publicly)
                              </span>
                            )}
                            <span className="text-xs text-slate-400 font-medium">
                              Published: {art.publishedAt}
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                            {art.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
                            {art.seoAnalysis?.targetKeyword && (
                              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                                🎯 &ldquo;{art.seoAnalysis.targetKeyword}&rdquo;
                              </span>
                            )}
                            <span>•</span>
                            <span>{art.seoAnalysis?.wordCount || 850} words</span>
                            <span>•</span>
                            <span>
                              Last analyzed:{' '}
                              {art.lastAnalyzedAt
                                ? new Date(art.lastAnalyzedAt).toLocaleDateString()
                                : 'Recent'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Score Gauge & Action Buttons */}
                      <div className="flex flex-wrap items-center gap-4 shrink-0 justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                        {/* Score Gauge */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="flex items-baseline justify-end gap-1">
                              <span className={`text-2xl font-black ${getSeoScoreColor(score)}`}>
                                {score}
                              </span>
                              <span className="text-xs text-slate-400">/100</span>
                            </div>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${badge.badgeClass}`}>
                              {badge.label}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5">
                          {/* Pin / Unpin button */}
                          <button
                            onClick={(e) => handleTogglePin(art.id, e)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                              art.pinned
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                            title={art.pinned ? 'Unpin from top' : 'Pin to top of homepage'}
                          >
                            <Pin className="w-3.5 h-3.5" />
                            {art.pinned ? 'Pinned' : 'Pin #1'}
                          </button>

                          {/* Re-analyze single article */}
                          <button
                            onClick={(e) => handleAnalyzeSingle(art.id, e)}
                            disabled={isAnalyzingThis}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
                            title="Re-analyze this blog"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzingThis ? 'animate-spin' : ''}`} />
                            Analyze
                          </button>

                          {/* Toggle Breakdown drawer */}
                          <button
                            onClick={() =>
                              setExpandedBreakdownId(isExpanded ? null : art.id)
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 transition-colors ${
                              isExpanded
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-transparent'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <span>Breakdown</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Edit blocks */}
                          <button
                            onClick={() => loadArticleToEdit(art)}
                            className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 transition-colors"
                            title="Edit this blog in Block Editor"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable 9-Factor Breakdown Drawer */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-emerald-500" />
                            9-Factor SEO Analysis Breakdown:
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* 1. Content Quality */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  Content Quality & Usefulness
                                </span>
                                <span className="text-xs font-black text-emerald-500">
                                  {art.seoAnalysis?.breakdown?.contentQuality?.score || 21} / 25
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {art.seoAnalysis?.breakdown?.contentQuality?.notes ||
                                  'Depth, word count, actionable lessons'}
                              </p>
                            </div>

                            {/* 2. Keyword Relevance */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  Keyword Relevance & Placement
                                </span>
                                <span className="text-xs font-black text-emerald-500">
                                  {art.seoAnalysis?.breakdown?.keywordRelevance?.score || 13} / 15
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {art.seoAnalysis?.breakdown?.keywordRelevance?.notes ||
                                  'Title, intro, headings, density'}
                              </p>
                            </div>

                            {/* 3. Title & Meta Description */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  Title & Meta Description
                                </span>
                                <span className="text-xs font-black text-emerald-500">
                                  {art.seoAnalysis?.breakdown?.titleMeta?.score || 13} / 15
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {art.seoAnalysis?.breakdown?.titleMeta?.notes ||
                                  'Optimal snippet lengths for Google CTR'}
                              </p>
                            </div>

                            {/* 4. Heading Structure */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  Heading Structure (H2, H3)
                                </span>
                                <span className="text-xs font-black text-emerald-500">
                                  {art.seoAnalysis?.breakdown?.headingStructure?.score || 9} / 10
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {art.seoAnalysis?.breakdown?.headingStructure?.notes ||
                                  'Logical H2/H3 concept segmentation'}
                              </p>
                            </div>

                            {/* 5. Readability */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  Readability & Paragraphs
                                </span>
                                <span className="text-xs font-black text-emerald-500">
                                  {art.seoAnalysis?.breakdown?.readability?.score || 8} / 10
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {art.seoAnalysis?.breakdown?.readability?.notes ||
                                  'Paragraph length & quote variety'}
                              </p>
                            </div>

                            {/* 6. Originality */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  Originality & Diversity
                                </span>
                                <span className="text-xs font-black text-emerald-500">
                                  {art.seoAnalysis?.breakdown?.originality?.score || 9} / 10
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {art.seoAnalysis?.breakdown?.originality?.notes ||
                                  'Lexical richness and unique phrasing'}
                              </p>
                            </div>

                            {/* 7. Image Optimization */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  Image Optimization & ALT
                                </span>
                                <span className="text-xs font-black text-emerald-500">
                                  {art.seoAnalysis?.breakdown?.imageOptimization?.score || 5} / 5
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {art.seoAnalysis?.breakdown?.imageOptimization?.notes ||
                                  'Descriptive ALT text and captions'}
                              </p>
                            </div>

                            {/* 8. Internal Linking */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  Internal Linking
                                </span>
                                <span className="text-xs font-black text-emerald-500">
                                  {art.seoAnalysis?.breakdown?.internalLinking?.score || 3} / 5
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {art.seoAnalysis?.breakdown?.internalLinking?.notes ||
                                  'Topic authority linking across essays'}
                              </p>
                            </div>

                            {/* 9. Search Intent */}
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  Search Intent Matching
                                </span>
                                <span className="text-xs font-black text-emerald-500">
                                  {art.seoAnalysis?.breakdown?.searchIntent?.score || 5} / 5
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {art.seoAnalysis?.breakdown?.searchIntent?.notes ||
                                  'Query phrasing and category alignment'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Issues & Suggestions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Identified Issues */}
                          <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Detected Issues ({art.seoAnalysis?.issues?.length || 0}):
                            </h5>
                            {art.seoAnalysis?.issues && art.seoAnalysis.issues.length > 0 ? (
                              <ul className="space-y-1.5 text-xs text-rose-700 dark:text-rose-300">
                                {art.seoAnalysis.issues.map((iss, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="text-rose-500 font-bold">•</span>
                                    <span>{iss}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                No critical issues detected! Excellent quality.
                              </p>
                            )}
                          </div>

                          {/* Actionable Suggestions */}
                          <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5" />
                              Improvement Suggestions ({art.seoAnalysis?.suggestions?.length || 0}):
                            </h5>
                            {art.seoAnalysis?.suggestions && art.seoAnalysis.suggestions.length > 0 ? (
                              <ul className="space-y-1.5 text-xs text-amber-700 dark:text-amber-300">
                                {art.seoAnalysis.suggestions.map((sug, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="text-amber-500 font-bold">•</span>
                                    <span>{sug}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                Fully optimized for maximum search visibility!
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : activeTab === 'database' ? (
        /* Mode 3: Databases Tab */
        <div className="space-y-8">
          {/* Engine Selector */}
          <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
            <button
              onClick={() => setDbMode('firebase')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                dbMode === 'firebase'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🔥 Firebase Firestore</span>
              {firebaseActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
            </button>
            <button
              onClick={() => setDbMode('mongodb')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                dbMode === 'mongodb'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🍃 MongoDB Atlas & Compass</span>
              {mongoActive && <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>}
            </button>
          </div>

          {/* MongoDB Panel */}
          {dbMode === 'mongodb' ? (
            <div className="space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                      🍃
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                          MongoDB Atlas Cloud Database
                        </h2>
                        {mongoActive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                            Connected & Live ({mongoDocCount ?? articles.length} documents)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
                            Local Mode
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                        Store and query all essays directly in MongoDB Atlas and MongoDB Compass.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        refreshFromMongo();
                        showToast('Refreshed data from MongoDB Atlas', 'info');
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
                    </button>
                    {mongoActive && (
                      <button
                        type="button"
                        onClick={handleDisconnectMongo}
                        className="px-3.5 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold"
                      >
                        Disconnect
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      1-Click Initial Sync to MongoDB Atlas
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Syncs all 73 essays with the new 5 categories to <code className="text-emerald-500 font-mono">gulfraz_insights.articles</code>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSyncAllToMongo}
                    disabled={syncingMongo}
                    className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2"
                  >
                    {syncingMongo ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    <span>Upload 73 Essays to MongoDB Atlas</span>
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    MongoDB Atlas Connection URI
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={mongoUri}
                      onChange={(e) => setMongoUri(e.target.value)}
                      placeholder="mongodb+srv://..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleTestAndSaveMongo}
                      disabled={testingMongo}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                    >
                      {testingMongo ? 'Connecting...' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Firebase Panel */
            <div className="space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg bg-amber-500/10 text-amber-500 border border-amber-500/30">
                      <Database className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                          Firebase Cloud Firestore Database
                        </h2>
                        {firebaseActive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                            Connected & Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400">
                            Local Mode
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                        Store and sync all your blogs in Google Firebase Cloud Firestore.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        refreshFromFirebase();
                        showToast('Refreshed data from Firebase Firestore', 'info');
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
                    </button>
                    {firebaseActive && (
                      <button
                        type="button"
                        onClick={handleDisconnectFirebase}
                        className="px-3.5 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold"
                      >
                        Disconnect
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      1-Click Sync All Essays to Firebase
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Syncs all 73 essays with the 5 new categories to Firestore.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSyncAllEssaysFirebase}
                    disabled={syncingAll}
                    className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2"
                  >
                    {syncingAll ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    <span>Sync All 73 Essays to Firebase</span>
                  </button>
                </div>

                <form onSubmit={handleSaveFirebaseConfig} className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
                      ⚡ Quick Paste (Auto-Detector)
                    </label>
                    <textarea
                      rows={2}
                      value={rawConfigText}
                      onChange={(e) => handleAutoParseFirebase(e.target.value)}
                      placeholder="Paste firebaseConfig code here..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">API Key</label>
                      <input
                        type="text"
                        value={fbApiKey}
                        onChange={(e) => setFbApiKey(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Project ID</label>
                      <input
                        type="text"
                        value={fbProjectId}
                        onChange={(e) => setFbProjectId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                  >
                    Save & Connect Firebase
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Mode 4: Advanced Block-Based Editor (Very Important) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Essential Metadata Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Essay Title <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Secrets of Millionaire Fastlane: Core Values to Riches"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg sm:text-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Subtitle / Deck
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. A deep dive into scalable wealth systems, key takeaways, and mental models."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Short Excerpt (Card Summary)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Concise 2-sentence summary for previews..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>

            {/* Strategic Key Takeaways Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    Key Strategic Takeaways
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setKeyTakeaways((prev) => [...prev, ''])}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Takeaway
                </button>
              </div>

              <div className="space-y-3">
                {keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={takeaway}
                      onChange={(e) => {
                        const next = [...keyTakeaways];
                        next[idx] = e.target.value;
                        setKeyTakeaways(next);
                      }}
                      placeholder="Actionable takeaway..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setKeyTakeaways((prev) => prev.filter((_, i) => i !== idx))}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                      title="Remove takeaway"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOCK-BASED ARTICLE BUILDER */}
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg border border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-4 z-20">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Add Content Block:
                  </span>
                  <span className="text-xs text-slate-400">({blocks.length} blocks total)</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAddBlock('paragraph')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Add unlimited paragraphs"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" /> Paragraph
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('heading')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Add Heading (H1, H2, H3)"
                  >
                    <Heading className="w-3.5 h-3.5 text-cyan-400" /> Heading
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('subheading')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Add Subheading"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-400" /> Subheading
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('image')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Add image anywhere (upload or URL)"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Image
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('quote')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Insert quote anywhere"
                  >
                    <QuoteIcon className="w-3.5 h-3.5 text-rose-400" /> Quote
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('bullet-list')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Add Bullet List"
                  >
                    <List className="w-3.5 h-3.5 text-violet-400" /> Bullets
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('numbered-list')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Add Numbered List"
                  >
                    <ListOrdered className="w-3.5 h-3.5 text-teal-400" /> Numbers
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('divider')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Add Divider"
                  >
                    <Minus className="w-3.5 h-3.5 text-slate-400" /> Divider
                  </button>
                </div>
              </div>

              {/* Render Every Block */}
              <div className="space-y-4">
                {blocks.map((block, index) => {
                  return (
                    <div
                      key={block.id || index}
                      className="group bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                    >
                      {/* Block Header Controls */}
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold flex items-center justify-center text-[11px]">
                            {index + 1}
                          </span>
                          <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {block.type.toUpperCase()} BLOCK
                          </span>
                        </div>

                        {/* Order & Action Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveBlock(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Move Block Up"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveBlock(index, 'down')}
                            disabled={index === blocks.length - 1}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Move Block Down"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateBlock(index)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-500 transition-colors"
                            title="Duplicate Block"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlock(index)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete Block"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Block Specific Form Elements */}
                      {block.type === 'paragraph' && (
                        <div>
                          <textarea
                            rows={4}
                            value={block.text || ''}
                            onChange={(e) => handleUpdateBlock(index, { text: e.target.value })}
                            placeholder="Write your paragraph here. You can add as many paragraphs as you want without limits..."
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      )}

                      {block.type === 'heading' && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">Heading Level:</span>
                            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
                              {[1, 2, 3].map((lvl) => (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() => handleUpdateBlock(index, { level: lvl as 1 | 2 | 3 })}
                                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                                    (block.level || 2) === lvl
                                      ? 'bg-emerald-600 text-white shadow-sm'
                                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                  }`}
                                >
                                  H{lvl}
                                </button>
                              ))}
                            </div>
                          </div>
                          <input
                            type="text"
                            value={block.text || ''}
                            onChange={(e) => handleUpdateBlock(index, { text: e.target.value })}
                            placeholder="Heading Text (e.g., The Psychology of Market Cycles)..."
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      )}

                      {block.type === 'subheading' && (
                        <div>
                          <input
                            type="text"
                            value={block.text || ''}
                            onChange={(e) => handleUpdateBlock(index, { text: e.target.value })}
                            placeholder="Subheading / section lead..."
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm italic font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      )}

                      {block.type === 'image' && (
                        <div className="space-y-4">
                          {/* Image preview */}
                          {block.url ? (
                            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-72 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <img
                                src={block.url}
                                alt={block.alt || 'Block Image'}
                                className="w-full h-auto max-h-72 object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => handleUpdateBlock(index, { url: '' })}
                                className="absolute top-3 right-3 p-1.5 rounded-xl bg-slate-900/80 text-white hover:bg-red-600 transition-colors shadow"
                                title="Remove Image"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3">
                              <ImageIcon className="w-10 h-10 text-slate-400 mx-auto" />
                              <div>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                  Upload Image from Computer or Enter URL
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  Supports PNG, JPG, WebP, GIF. Unlimited images allowed anywhere.
                                </p>
                              </div>

                              <div className="flex items-center justify-center gap-3 pt-2">
                                <label className="cursor-pointer px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Upload from Computer</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageUploadForBlock(e, index)}
                                  />
                                </label>
                              </div>
                            </div>
                          )}

                          {/* Image URL input fallback */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                              Image URL (Or replace uploaded photo)
                            </label>
                            <input
                              type="url"
                              value={block.url || ''}
                              onChange={(e) => handleUpdateBlock(index, { url: e.target.value })}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                            />
                          </div>

                          {/* Caption & Alt text */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                                Caption (Optional)
                              </label>
                              <input
                                type="text"
                                value={block.caption || ''}
                                onChange={(e) => handleUpdateBlock(index, { caption: e.target.value })}
                                placeholder="e.g. Compound interest curve over 30 years"
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                                ALT Text (SEO Friendly)
                              </label>
                              <input
                                type="text"
                                value={block.alt || ''}
                                onChange={(e) => handleUpdateBlock(index, { alt: e.target.value })}
                                placeholder="e.g. Visual illustration of wealth compounding"
                                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                              />
                            </div>
                          </div>

                          {/* Alignment & Sizing */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            <div>
                              <span className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">
                                Image Alignment:
                              </span>
                              <div className="flex gap-1.5">
                                {[
                                  { val: 'left', icon: AlignLeft, label: 'Left' },
                                  { val: 'center', icon: AlignCenter, label: 'Center' },
                                  { val: 'right', icon: AlignRight, label: 'Right' },
                                  { val: 'full', icon: Maximize2, label: 'Full' },
                                ].map((item) => (
                                  <button
                                    key={item.val}
                                    type="button"
                                    onClick={() => handleUpdateBlock(index, { alignment: item.val as any })}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all ${
                                      (block.alignment || 'center') === item.val
                                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 border-emerald-500 font-bold'
                                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                                    }`}
                                  >
                                    <item.icon className="w-3 h-3" /> {item.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <span className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">
                                Image Size:
                              </span>
                              <div className="flex gap-1.5">
                                {['small', 'medium', 'large', 'full'].map((sz) => (
                                  <button
                                    key={sz}
                                    type="button"
                                    onClick={() => handleUpdateBlock(index, { size: sz as any })}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                                      (block.size || 'large') === sz
                                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 border-emerald-500 font-bold'
                                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                                    }`}
                                  >
                                    {sz}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {block.type === 'quote' && (
                        <div className="space-y-3">
                          {/* Live Quote Styled Preview */}
                          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-50 to-transparent dark:from-emerald-950/40 dark:via-slate-850 border-l-4 border-emerald-500">
                            <QuoteIcon className="w-6 h-6 text-emerald-500 mb-2 opacity-70" />
                            <textarea
                              rows={2}
                              value={block.quoteText || ''}
                              onChange={(e) => handleUpdateBlock(index, { quoteText: e.target.value })}
                              placeholder="Enter the quote text here..."
                              className="w-full bg-transparent border-0 text-base italic text-slate-900 dark:text-white focus:outline-none resize-none placeholder:text-slate-400"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                              <input
                                type="text"
                                value={block.quoteAuthor || ''}
                                onChange={(e) => handleUpdateBlock(index, { quoteAuthor: e.target.value })}
                                placeholder="Author name (e.g., M.J. DeMarco)"
                                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                              />
                              <input
                                type="text"
                                value={block.quoteSource || ''}
                                onChange={(e) => handleUpdateBlock(index, { quoteSource: e.target.value })}
                                placeholder="Source (e.g., The Millionaire Fastlane)"
                                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {block.type === 'bullet-list' && (
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-slate-500">Bullet Points:</span>
                          {(block.items || ['']).map((item, iIdx) => (
                            <div key={iIdx} className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const items = [...(block.items || [''])];
                                  items[iIdx] = e.target.value;
                                  handleUpdateBlock(index, { items });
                                }}
                                placeholder="Bullet point text..."
                                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const items = (block.items || ['']).filter((_, i) => i !== iIdx);
                                  handleUpdateBlock(index, { items: items.length > 0 ? items : [''] });
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const items = [...(block.items || ['']), ''];
                              handleUpdateBlock(index, { items });
                            }}
                            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Point
                          </button>
                        </div>
                      )}

                      {block.type === 'numbered-list' && (
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-slate-500">Numbered Items:</span>
                          {(block.items || ['']).map((item, iIdx) => (
                            <div key={iIdx} className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center justify-center shrink-0">
                                {iIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const items = [...(block.items || [''])];
                                  items[iIdx] = e.target.value;
                                  handleUpdateBlock(index, { items });
                                }}
                                placeholder="Numbered item text..."
                                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const items = (block.items || ['']).filter((_, i) => i !== iIdx);
                                  handleUpdateBlock(index, { items: items.length > 0 ? items : [''] });
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const items = [...(block.items || ['']), ''];
                              handleUpdateBlock(index, { items });
                            }}
                            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Numbered Item
                          </button>
                        </div>
                      )}

                      {block.type === 'divider' && (
                        <div className="py-3 flex items-center justify-center gap-3">
                          <div className="h-px w-24 bg-slate-300 dark:bg-slate-700" />
                          <Sparkles className="w-4 h-4 text-emerald-500" />
                          <div className="h-px w-24 bg-slate-300 dark:bg-slate-700" />
                        </div>
                      )}

                      {/* Quick insert button beneath this block */}
                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between opacity-80 group-hover:opacity-100">
                        <span className="text-[10px] text-slate-400">Insert block below:</span>
                        <div className="flex items-center gap-1 text-[11px]">
                          <button
                            type="button"
                            onClick={() => handleAddBlock('paragraph', index)}
                            className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                          >
                            + Paragraph
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddBlock('heading', index)}
                            className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                          >
                            + Heading
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddBlock('quote', index)}
                            className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                          >
                            + Quote
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddBlock('image', index)}
                            className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                          >
                            + Image
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Big Add Block Menu */}
              <div className="p-6 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3 bg-white/40 dark:bg-slate-900/40">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Append New Content Block
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddBlock('paragraph')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 transition-transform"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Paragraph
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('heading')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 transition-transform"
                  >
                    <Heading className="w-3.5 h-3.5" /> Add Heading
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('quote')}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 transition-transform"
                  >
                    <QuoteIcon className="w-3.5 h-3.5" /> Add Quote Anywhere
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('image')}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 transition-transform"
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Add Image Anywhere
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('bullet-list')}
                    className="px-3 py-2 rounded-xl bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <List className="w-3.5 h-3.5" /> Bullet List
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('numbered-list')}
                    className="px-3 py-2 rounded-xl bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <ListOrdered className="w-3.5 h-3.5" /> Numbered List
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddBlock('divider')}
                    className="px-3 py-2 rounded-xl bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Minus className="w-3.5 h-3.5" /> Divider
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Publishing & Metadata (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              {/* Category Selection (5 New Categories) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Main Category <span className="text-emerald-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-400">
                  {categories.find((c) => c.id === category)?.description}
                </p>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Publishing Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('published')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      status === 'published'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    Published Live
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('draft')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      status === 'draft'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    Draft Only
                  </button>
                </div>
              </div>

              {/* Featured Cover Photo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Cover Photo
                </label>
                <div className="relative rounded-2xl overflow-hidden aspect-video mb-3 border border-slate-200 dark:border-slate-800">
                  <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                </div>

                <div className="flex gap-2 mb-3">
                  <label className="flex-1 cursor-pointer px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors">
                    <Upload className="w-3.5 h-3.5" /> Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      ref={coverFileInputRef}
                      className="hidden"
                      onChange={handleCoverImageUpload}
                    />
                  </label>
                </div>

                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Or enter custom image URL..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Author & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Publish Date
                  </label>
                  <input
                    type="text"
                    value={publishedDate}
                    onChange={(e) => setPublishedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                  />
                </div>
              </div>

              {/* URL Slug */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  URL Slug
                </label>
                <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-400">/articles/</span>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder={finalSlug}
                    className="flex-1 bg-transparent text-slate-900 dark:text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* SEO Title & Description */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  SEO & Search Optimization
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title || 'Custom SEO title...'}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    SEO Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder={excerpt || subtitle || 'Custom SEO description...'}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs resize-none"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Wealth, Strategy, Mindset"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              {/* Live SEO Score Gauge in Editor Sidebar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Live SEO Score
                  </span>
                  {draftSeoAnalysis && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${getSeoGradeBadge(draftSeoAnalysis.grade).badgeClass}`}>
                      {draftSeoAnalysis.grade}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-black ${draftSeoAnalysis ? getSeoScoreColor(draftSeoAnalysis.score) : 'text-slate-400'}`}>
                      {draftSeoAnalysis ? draftSeoAnalysis.score : '--'}
                    </span>
                    <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {draftSeoAnalysis?.wordCount || 0} words
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${draftSeoAnalysis ? getSeoBarColor(draftSeoAnalysis.score) : 'bg-slate-400'}`}
                    style={{ width: `${draftSeoAnalysis ? draftSeoAnalysis.score : 0}%` }}
                  />
                </div>

                {draftSeoAnalysis && draftSeoAnalysis.issues.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
                      Quick SEO Tips:
                    </span>
                    {draftSeoAnalysis.issues.slice(0, 2).map((iss, i) => (
                      <p key={i} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                        <span>{iss}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats Card */}
              <div className="p-4 rounded-2xl bg-slate-950 text-white space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Reading Time:</span>
                  <span className="font-bold text-emerald-400">{readTimeCalculated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Content Blocks:</span>
                  <span className="font-bold text-white">{blocks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Category:</span>
                  <span className="font-bold text-emerald-400">{getCategoryLabel(category)}</span>
                </div>
              </div>

              {/* Publish Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveOrPublish('published')}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105 active:scale-95"
                >
                  {editingId ? (
                    <>
                      <Save className="w-4 h-4" /> Save & Update Live
                    </>
                  ) : (
                    <>
                      Publish Live to Website <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveOrPublish('draft')}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5" /> Save as Draft
                </button>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 border border-amber-500/30"
                >
                  <X className="w-3.5 h-3.5" /> Cancel Edit (New Post)
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyJSON}
                className="w-full py-2 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copied JSON!' : 'Copy Article JSON'}</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors mt-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out of Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
