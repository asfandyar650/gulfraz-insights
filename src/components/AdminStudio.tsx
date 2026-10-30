'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Layers,
  Clock,
  Compass,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useArticles } from '../context/ArticlesContext';
import { useToast } from '../context/ToastContext';
import { Article, ArticleSection } from '../types';
import { author } from '../data/siteData';
import { ArticleDetail } from './ArticleDetail';

export const AdminStudio: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const { articles, addArticle, updateArticle, deleteArticle, firebaseActive } = useArticles();
  const { showToast } = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview' | 'manage'>('write');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<'wealth' | 'mindset' | 'psychology' | 'career'>('wealth');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1400&q=80'
  );
  const [tags, setTags] = useState('Wealth, Strategy, Mindset');
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>([
    'First core strategic takeaway for readers.',
    'Second actionable principle to apply immediately.',
  ]);

  interface FormSection {
    id: string;
    title: string;
    contentText: string;
    quoteText?: string;
    quoteAuthor?: string;
  }

  const [sections, setSections] = useState<FormSection[]>([
    {
      id: 'section-1',
      title: 'The Core Principle',
      contentText: `Write your main analysis here. Separate paragraphs with a blank line.

Explain the concept clearly and provide real-world examples or frameworks.`,
      quoteText: 'Simplicity and leverage are the ultimate drivers of wealth.',
      quoteAuthor: 'Gulfraz Insights',
    },
  ]);

  const [copiedJson, setCopiedJson] = useState(false);

  const presetPhotos = [
    {
      label: 'Finance & Gold',
      url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1400&q=80',
    },
    {
      label: 'Investment & Charts',
      url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80',
    },
    {
      label: 'Strategy & Focus',
      url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=80',
    },
    {
      label: 'Mindset & Psychology',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
    },
  ];

  useEffect(() => {
    try {
      if (sessionStorage.getItem('gulfraz_admin_session') === 'true') {
        setIsAuthenticated(true);
      }
    } catch {}
  }, []);

  const loadArticleToEdit = (art: Article) => {
    setEditingId(art.id);
    setTitle(art.title);
    setSubtitle(art.subtitle || '');
    setExcerpt(art.excerpt || art.subtitle || '');
    setCategory(art.category);
    setCoverImage(art.coverImage);
    setTags(art.tags.join(', '));
    setKeyTakeaways(art.keyTakeaways && art.keyTakeaways.length > 0 ? art.keyTakeaways : ['']);

    setSections(
      art.sections && art.sections.length > 0
        ? art.sections.map((s, idx) => ({
            id: s.id || `section-${idx + 1}`,
            title: s.title || '',
            contentText: Array.isArray(s.content) ? s.content.join('\n\n') : s.content || '',
            quoteText: s.quote?.text || '',
            quoteAuthor: s.quote?.author || 'Gulfraz Insights',
          }))
        : [
            {
              id: 'section-1',
              title: 'The Core Principle',
              contentText: 'Write your content here...',
            },
          ]
    );

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
    setCategory('wealth');
    setCoverImage(presetPhotos[0].url);
    setTags('Wealth, Strategy, Mindset');
    setKeyTakeaways([
      'First core strategic takeaway for readers.',
      'Second actionable principle to apply immediately.',
    ]);
    setSections([
      {
        id: 'section-1',
        title: 'The Core Principle',
        contentText: 'Write your content here...',
      },
    ]);
    showToast('Editing cancelled. Editor reset for new blog.', 'info');
  };

  // Estimated read time
  const readTimeCalculated = useMemo(() => {
    const totalWords = (
      title +
      ' ' +
      subtitle +
      ' ' +
      sections.map((s) => s.contentText).join(' ')
    )
      .trim()
      .split(/\s+/).length;
    return `${Math.max(1, Math.ceil(totalWords / 180))} min read`;
  }, [title, subtitle, sections]);

  // Article object representation
  const articleDraft = useMemo((): Article => {
    const existing = editingId ? articles.find((a) => a.id === editingId) : null;
    const slugCalculated = (title || 'untitled-insight')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    return {
      id: editingId || `custom-${Date.now()}`,
      slug: slugCalculated,
      title: title || 'Untitled Strategic Insight',
      subtitle: subtitle || 'Brief overview of this insight',
      excerpt: excerpt || subtitle || 'A practical breakdown of key ideas.',
      category,
      author,
      publishedAt:
        existing?.publishedAt ||
        new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      readTime: readTimeCalculated,
      coverImage: coverImage || presetPhotos[0].url,
      tags: tags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean),
      featured: existing?.featured || false,
      trending: existing?.trending || true,
      views: existing?.views || 1,
      claps: existing?.claps || 0,
      keyTakeaways: keyTakeaways.filter((t) => t.trim() !== ''),
      sections: sections.map((s) => ({
        id: s.id,
        title: s.title,
        content: s.contentText.split('\n\n').filter((p) => p.trim() !== ''),
        quote: s.quoteText
          ? {
              text: s.quoteText,
              author: s.quoteAuthor || 'Gulfraz Insights',
            }
          : undefined,
      })),
    };
  }, [
    editingId,
    articles,
    title,
    subtitle,
    excerpt,
    category,
    readTimeCalculated,
    coverImage,
    tags,
    keyTakeaways,
    sections,
  ]);

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
    showToast('You have successfully logged out of Admin Studio.', 'info');
  };

  const handlePublishOrUpdate = () => {
    if (!title.trim()) {
      showToast('Please enter an article title.', 'error');
      return;
    }

    if (editingId) {
      updateArticle(articleDraft);
      showToast('🎉 Blog post updated and saved live!', 'success');
      setEditingId(null);
    } else {
      addArticle(articleDraft);
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch {}
      showToast('🎉 New article published live to website!', 'success');
    }

    router.push(`/articles/${articleDraft.slug}`);
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

  // Section modifiers
  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        id: `section-${prev.length + 1}`,
        title: 'New Section Title',
        contentText: 'Write your content here...',
      },
    ]);
  };

  const removeSection = (idx: number) => {
    if (sections.length <= 1) {
      showToast('At least one section is required.', 'error');
      return;
    }
    setSections((prev) => prev.filter((_, i) => i !== idx));
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
                {title}
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

      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white truncate">
                Gulfraz Insights Admin Studio
              </h1>
              {firebaseActive ? (
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
              {editingId ? 'Updating blog article' : 'Composing new article'} • Instant auto-publishing
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Tab buttons */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('write')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'write'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> {editingId ? 'Edit Post' : 'Write'}
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                activeTab === 'manage'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> All ({articles.length})
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="px-2.5 sm:px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Return to public website view"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden md:inline">View Website</span>
            </Link>

            <button
              onClick={handlePublishOrUpdate}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <Save className="w-3.5 h-3.5" /> {editingId ? 'Update' : 'Publish'}
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0"
              title="Log Out of Admin Panel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Preview Tab */}
      {activeTab === 'preview' ? (
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-4 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> Real-Time Preview
            </span>
            <button
              onClick={handlePublishOrUpdate}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
            >
              {editingId ? 'Looks Great! Update Blog →' : 'Looks Great! Publish Now →'}
            </button>
          </div>
          <ArticleDetail article={articleDraft} />
        </div>
      ) : activeTab === 'manage' ? (
        /* Mode 2: Manage Tab */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                All Published Blogs ({articles.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Edit text, photos, headings, or permanently delete any blog post.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => {
                  handleResetForm();
                  setActiveTab('write');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Compose New Blog
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title="Log Out of Admin Panel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {articles.map((art) => (
              <div
                key={art.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {art.category}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-xs text-slate-400">{art.readTime}</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
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
                    title="Edit blog content, title, or photos"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(art)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                    title="Permanently delete this blog"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Mode 3: Write Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Article Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Mathematics of Asymmetric Wealth Creation"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
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
                  placeholder="e.g. Why linear effort caps your earnings and how to construct compounding systems."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Short Excerpt (For card previews)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A concise 2-sentence summary that hooks readers on social feeds..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Key Takeaways Box */}
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

            {/* Article Body Sections */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Article Body Sections ({sections.length})
                </h3>
                <button
                  type="button"
                  onClick={addSection}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Section
                </button>
              </div>

              {sections.map((section, idx) => (
                <div
                  key={section.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Section {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSection(idx)}
                      className="text-xs text-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => {
                        const next = [...sections];
                        next[idx].title = e.target.value;
                        setSections(next);
                      }}
                      placeholder="Section Heading"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Content Paragraphs (Double Enter for new paragraph)
                    </label>
                    <textarea
                      rows={4}
                      value={section.contentText}
                      onChange={(e) => {
                        const next = [...sections];
                        next[idx].contentText = e.target.value;
                        setSections(next);
                      }}
                      placeholder="Write this section's core insights and text..."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                        Optional Blockquote
                      </label>
                      <input
                        type="text"
                        value={section.quoteText || ''}
                        onChange={(e) => {
                          const next = [...sections];
                          next[idx].quoteText = e.target.value;
                          setSections(next);
                        }}
                        placeholder="Quote text..."
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                        Quote Author / Citation
                      </label>
                      <input
                        type="text"
                        value={section.quoteAuthor || ''}
                        onChange={(e) => {
                          const next = [...sections];
                          next[idx].quoteAuthor = e.target.value;
                          setSections(next);
                        }}
                        placeholder="e.g. Gulfraz Insights"
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Category Pillar
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="wealth">Wealth & Financial Freedom</option>
                  <option value="mindset">Mindset & Self-Mastery</option>
                  <option value="psychology">Psychology & Human Nature</option>
                  <option value="career">Career & Asymmetric Growth</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Cover Photo
                </label>
                <div className="relative rounded-2xl overflow-hidden aspect-video mb-3 border border-slate-200 dark:border-slate-800">
                  <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1.5 mb-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Curated Presets:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {presetPhotos.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setCoverImage(preset.url)}
                        className={`p-1.5 rounded-lg text-[10px] font-semibold border truncate transition-all ${
                          coverImage === preset.url
                            ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border-emerald-500 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Or enter custom image URL..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Tags & Metadata
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Wealth, Strategy, Psychology"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Stats Card */}
              <div className="p-4 rounded-2xl bg-slate-950 text-white space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Reading Time:</span>
                  <span className="font-bold text-emerald-400">{readTimeCalculated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Sections:</span>
                  <span className="font-bold text-white">{sections.length}</span>
                </div>
              </div>

              {/* Publish Action Button */}
              <button
                type="button"
                onClick={handlePublishOrUpdate}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105 active:scale-95"
              >
                {editingId ? (
                  <>
                    <Save className="w-4 h-4" /> Save & Update Blog
                  </>
                ) : (
                  <>
                    Publish Live to Site <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 border border-amber-500/30"
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
