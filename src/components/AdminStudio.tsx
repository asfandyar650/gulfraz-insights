'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Download,
  Save,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useArticles } from '../context/ArticlesContext';
import { useToast } from '../context/ToastContext';
import { Article, ArticleSection } from '../types';
import { author } from '../data/siteData';

export const AdminStudio: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const { articles, addArticle, updateArticle, deleteArticle, resetToDefaults } = useArticles();
  const { showToast } = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'manage'>('write');

  // Form state
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<'wealth' | 'mindset' | 'psychology' | 'career'>('wealth');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&q=80');
  const [readTime, setReadTime] = useState('6 min read');
  const [tags, setTags] = useState('wealth, mindset, growth');
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>([
    'Wealth is about creating systems that decouple time from income.',
    'Focus on deep work and continuous high-leverage skill acquisition.',
  ]);
  const [sections, setSections] = useState<ArticleSection[]>([
    {
      title: 'Strategic Foundations',
      content: ['Wealth creation begins with changing your baseline operating paradigm.'],
      quote: { text: 'True freedom is when your time belongs to you.', author: 'Gulfraz Khan' },
    },
  ]);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('gulfraz_admin_session') === 'true') {
        setIsAuthenticated(true);
      }
    } catch {}
  }, []);

  // Handle edit param
  useEffect(() => {
    if (editId && articles.length > 0) {
      const art = articles.find((a) => a.id === editId || a.slug === editId);
      if (art) {
        setEditingArticleId(art.id);
        setTitle(art.title);
        setSubtitle(art.subtitle || '');
        setSlug(art.slug);
        setCategory(art.category);
        setCoverImage(art.coverImage);
        setReadTime(art.readTime);
        setTags(art.tags.join(', '));
        setKeyTakeaways(art.keyTakeaways || []);
        setSections(art.sections || []);
        setActiveTab('write');
      }
    }
  }, [editId, articles]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'gulfraz123') {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('gulfraz_admin_session', 'true');
      } catch {}
      showToast('Welcome to Gulfraz Insights Author Studio.', 'success');
      setPassword('');
    } else {
      showToast('Incorrect passkey. Please try again.', 'error');
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('gulfraz_admin_session');
    } catch {}
    setIsAuthenticated(false);
    showToast('Logged out of Author Studio.', 'info');
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingArticleId) {
      setSlug(generateSlug(val));
    }
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      showToast('Title and Slug are required.', 'error');
      return;
    }

    const tagArray = tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const articleData: Article = {
      id: editingArticleId || `custom-${Date.now()}`,
      slug: slug.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      excerpt: subtitle.trim() || (Array.isArray(sections[0]?.content) ? sections[0].content[0] : sections[0]?.content) || title,
      category,
      author,
      publishedAt: 'Today',
      readTime: readTime.trim() || '5 min read',
      coverImage: coverImage.trim(),
      tags: tagArray.length > 0 ? tagArray : [category],
      views: editingArticleId ? (articles.find((a) => a.id === editingArticleId)?.views || 100) : 100,
      claps: editingArticleId ? (articles.find((a) => a.id === editingArticleId)?.claps || 12) : 12,
      keyTakeaways: keyTakeaways.filter((t) => t.trim().length > 0),
      sections: sections.filter((s) => s.title || (Array.isArray(s.content) ? s.content.length > 0 : s.content)),
    };

    if (editingArticleId) {
      updateArticle(articleData);
      showToast('Article updated successfully!', 'success');
    } else {
      addArticle(articleData);
      showToast('New article published successfully!', 'success');
    }

    // Reset or navigate
    router.push(`/articles/${articleData.slug}`);
  };

  const handleClearEdit = () => {
    setEditingArticleId(null);
    setTitle('');
    setSubtitle('');
    setSlug('');
    setKeyTakeaways(['']);
    setSections([{ title: '', content: [''] }]);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(articles, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'gulfraz_insights_backup.json');
    dlAnchor.click();
    showToast('Exported articles to JSON file.', 'success');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-5 border border-emerald-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Author Publishing Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6">
            Enter the editorial security passkey to access publishing and editing controls.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter passkey (hint: gulfraz123)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" /> Unlock Studio
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Author Publishing Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {editingArticleId ? 'Editing Article' : 'Article Publishing & Management'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('write')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'write'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Plus className="w-3.5 h-3.5 inline mr-1" /> Write / Edit
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'manage'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5 inline mr-1" /> Library ({articles.length})
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Lock & Exit"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Write / Edit Mode */}
      {activeTab === 'write' ? (
        <form onSubmit={handleSaveArticle} className="space-y-8 max-w-4xl">
          {editingArticleId && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-500">
                You are editing existing article: {title}
              </span>
              <button
                type="button"
                onClick={handleClearEdit}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Cancel & Write New
              </button>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Article Meta & Overview
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Article Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. The Secrets of Compounding Returns"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="wealth">Wealth & Financial Freedom</option>
                  <option value="mindset">Mindset & Self-Mastery</option>
                  <option value="psychology">Psychology & Human Nature</option>
                  <option value="career">Career & Asymmetric Growth</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="the-secrets-of-compounding"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Subtitle / Hook Excerpt
              </label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="A brief 1-2 sentence hook explaining the insight..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Estimated Read Time
                </label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="6 min read"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="wealth, investing, compounding"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Key Takeaways Builder */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Key Strategic Takeaways
              </h3>
              <button
                type="button"
                onClick={() => setKeyTakeaways([...keyTakeaways, ''])}
                className="text-xs font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Takeaway
              </button>
            </div>

            {keyTakeaways.map((takeaway, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs flex items-center justify-center shrink-0">
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
                  placeholder="Key strategic takeaway..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                {keyTakeaways.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setKeyTakeaways(keyTakeaways.filter((_, i) => i !== idx))}
                    className="p-2 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit button */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4" />
              {editingArticleId ? 'Save & Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      ) : (
        /* Manage Library Table */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                All Published Insights ({articles.length})
              </h3>
              <p className="text-xs text-slate-500">Manage, edit, or delete articles.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJSON}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export JSON
              </button>
              <button
                onClick={() => {
                  if (confirm('Reset articles to default 73 essays? Any custom blogs will be reset.')) {
                    resetToDefaults();
                    showToast('Articles reset to defaults.', 'info');
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
              >
                Reset Defaults
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4 hidden sm:table-cell">Category</th>
                  <th className="p-4 hidden md:table-cell">Reads</th>
                  <th className="p-4 hidden md:table-cell">Claps</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-white max-w-xs sm:max-w-md truncate">
                      {art.title}
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800">
                        {art.category}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">{art.views}</td>
                    <td className="p-4 hidden md:table-cell">{art.claps}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/articles/${art.slug}`}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 inline-block"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          setEditingArticleId(art.id);
                          setTitle(art.title);
                          setSubtitle(art.subtitle || '');
                          setSlug(art.slug);
                          setCategory(art.category);
                          setCoverImage(art.coverImage);
                          setReadTime(art.readTime);
                          setTags(art.tags.join(', '));
                          setKeyTakeaways(art.keyTakeaways || []);
                          setSections(art.sections || []);
                          setActiveTab('write');
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-500 inline-block"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${art.title}"?`)) {
                            deleteArticle(art.id);
                            showToast('Article deleted.', 'info');
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 inline-block"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
