'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Eye,
  Heart,
  Bookmark,
  Volume2,
  Pause,
  Play,
  Type,
  Share2,
  Check,
  Copy,
  MessageSquare,
  Sparkles,
  Quote as QuoteIcon,
  Twitter,
  Linkedin,
  Send,
  Edit3,
  QrCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Article, Comment } from '../types';
import { useReadingList } from '../context/ReadingListContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { useToast } from '../context/ToastContext';
import { useArticles } from '../context/ArticlesContext';
import { ArticleCard } from './ArticleCard';

interface ArticleDetailProps {
  article: Article;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ article }) => {
  const router = useRouter();
  const { isBookmarked, toggleBookmark } = useReadingList();
  const { playArticle, currentArticle, isPlaying } = useAudioPlayer();
  const { showToast } = useToast();
  const { articles, incrementClaps, incrementViews } = useArticles();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [claps, setClaps] = useState(article.claps);
  const [hasClapped, setHasClapped] = useState(false);
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      author: 'Hamza Malik',
      date: 'Yesterday at 4:12 PM',
      text: 'This breakdown really hit home. The comparison between trading time for money versus building scalable assets made me re-evaluate how I spend my evenings.',
    },
    {
      id: 'c2',
      author: 'Sarah J.',
      date: '2 days ago',
      text: 'Great summary. What I appreciate most about this blog is how clear and honest the lessons are without all the usual internet hype.',
    },
  ]);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    try {
      setIsAdmin(sessionStorage.getItem('gulfraz_admin_session') === 'true');
    } catch {}
  }, []);

  useEffect(() => {
    // Record view
    incrementViews(article.id);
  }, [article.id, incrementViews]);

  useEffect(() => {
    const handleScroll = () => {
      const top = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        setScrollProgress((top / height) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClap = () => {
    setClaps((prev) => prev + 1);
    incrementClaps(article.id);
    setHasClapped(true);
    showToast('Appreciated! Clapped for this insight.', 'success');
    try {
      confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
    } catch {}
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('Link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) {
      showToast('Please enter both your name and comment.', 'error');
      return;
    }
    const newComment: Comment = {
      id: Math.random().toString(),
      author: commentAuthor.trim(),
      date: 'Just now',
      text: commentText.trim(),
    };
    setComments((prev) => [newComment, ...prev]);
    setCommentAuthor('');
    setCommentText('');
    showToast('Comment submitted successfully!', 'success');
  };

  const related = articles
    .filter((a) => a.id !== article.id && (a.category === article.category || a.trending))
    .slice(0, 3);

  const bookmarked = isBookmarked(article.id);
  const isAudioActive = currentArticle?.id === article.id && isPlaying;
  const isAudioLoaded = currentArticle?.id === article.id;

  return (
    <article className="min-h-screen pb-24 transition-colors">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-2 group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to all Insights
        </Link>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs mb-4">
          <span className="font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shrink-0">
            {article.category}
          </span>
          <span className="flex items-center gap-1 text-slate-500 shrink-0">
            <Clock className="w-3.5 h-3.5 text-emerald-500" /> {article.readTime}
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <span className="flex items-center gap-1 text-slate-500 shrink-0">
            <Calendar className="w-3.5 h-3.5" /> {article.publishedAt}
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <span className="flex items-center gap-1 text-slate-500 shrink-0">
            <Eye className="w-3.5 h-3.5" /> {article.views.toLocaleString()} reads
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-snug sm:leading-tight mb-4 break-words">
          {article.title}
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-6 sm:mb-8 break-words">
          {article.subtitle}
        </p>

        {/* Author & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 w-full max-w-full">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-emerald-500 shrink-0"
            />
            <div className="min-w-0">
              <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                {article.author.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {article.author.role} • Gulfraz Insights
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 w-full sm:w-auto">
            {/* Audio Button */}
            <button
              onClick={() => playArticle(article)}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shrink-0 min-h-[42px] ${
                isAudioActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : isAudioLoaded
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {isAudioActive ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Narration</span>
                </>
              ) : isAudioLoaded ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Narration</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen to Audio</span>
                </>
              )}
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleBookmark(article.id)}
              className={`p-2.5 rounded-xl text-xs transition-colors shrink-0 min-w-[42px] min-h-[42px] flex items-center justify-center ${
                bookmarked
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              title={bookmarked ? 'Saved to reading list' : 'Bookmark for later'}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Font Size Toggle */}
            <button
              onClick={() => setIsLargeFont(!isLargeFont)}
              className={`p-2.5 rounded-xl text-xs transition-colors shrink-0 min-w-[42px] min-h-[42px] flex items-center justify-center ${
                isLargeFont
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              title="Toggle reading font size"
            >
              <Type className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-10 border border-slate-200 dark:border-slate-800 aspect-[16/9] sm:aspect-[21/9]">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Key Takeaways Box */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Key Takeaways & Summary
              </h3>
            </div>
            <ul className="space-y-3">
              {article.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-700 dark:text-slate-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Body Sections */}
        <div
          className={`space-y-10 leading-relaxed font-serif text-slate-800 dark:text-slate-200 ${
            isLargeFont ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
          }`}
        >
          {article.sections &&
            article.sections.map((section, sIdx) => (
              <section key={section.id || sIdx} className="space-y-5">
                {section.title && (
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white pt-4 tracking-tight">
                    {section.title}
                  </h2>
                )}

                {/* Section Content Paragraphs or Images */}
                {Array.isArray(section.content) ? (
                  section.content.map((pText, pIdx) => {
                    if (pText.startsWith('IMAGE::')) {
                      const imgUrl = pText.replace('IMAGE::', '');
                      return (
                        <div key={pIdx} className="my-8 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
                          <img src={imgUrl} alt={section.title || article.title} className="w-full h-auto object-cover" />
                        </div>
                      );
                    }
                    return (
                      <p key={pIdx} className="leading-relaxed">
                        {pText}
                      </p>
                    );
                  })
                ) : typeof section.content === 'string' ? (
                  section.content.startsWith('IMAGE::') ? (
                    <div className="my-8 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
                      <img
                        src={section.content.replace('IMAGE::', '')}
                        alt={section.title || article.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ) : (
                    <p className="leading-relaxed">{section.content}</p>
                  )
                ) : null}

                {/* Section Blockquote if present */}
                {section.quote && section.quote.text && (
                  <div className="my-6 p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border-l-4 border-emerald-500 font-sans not-italic">
                    <div className="flex items-start gap-3">
                      <QuoteIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 fill-current mt-0.5" />
                      <div>
                        <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 italic">
                          {section.quote.text}
                        </p>
                        {section.quote.author && (
                          <p className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                            — {section.quote.author}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            ))}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              Topics & Mental Models
            </span>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Clap & Share Callout */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleClap}
              className={`p-4 rounded-2xl flex items-center gap-3 transition-all transform active:scale-95 shadow-md ${
                hasClapped
                  ? 'bg-rose-500 text-white shadow-rose-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-rose-300'
              }`}
            >
              <Heart className={`w-6 h-6 ${hasClapped ? 'fill-current' : 'text-rose-500 fill-rose-500/20'}`} />
              <div className="text-left">
                <span className="block text-xs font-medium text-slate-400">Appreciate</span>
                <span className="block text-base font-black">{claps} claps</span>
              </div>
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs hidden sm:block">
              Found this valuable? Give it a clap so other readers find it too.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 hidden md:inline">
              Share:
            </span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.href : ''
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:text-sky-500 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
              title="Share on Twitter / X"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.href : ''
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:text-blue-500 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <button
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:text-emerald-500 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
              title="Copy Article Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Support Gulfraz Callout Banner */}
        <div className="mt-12 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                Support Gulfraz Insights 💛
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                Found this insight valuable? You can support our independent research via JazzCash or Payoneer QR code.
              </p>
            </div>
          </div>
          <Link
            href="/support"
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <span>Scan QR Code</span>
            <span className="text-xs">→</span>
          </Link>
        </div>

        {/* Author Bio Box */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Author & Founder
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {article.author.name}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {article.author.bio}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <section className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Reader Discussion ({comments.length})
            </h3>
          </div>

          {/* New Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-10 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <input
              type="text"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              placeholder="Your name..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-emerald-500"
            />
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your perspective or questions on this insight..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-emerald-500 resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all hover:scale-105 active:scale-95"
              >
                Post Comment <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comm) => (
              <div
                key={comm.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{comm.author}</span>
                  <span className="text-xs text-slate-400">{comm.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {comm.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Insights */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Continue Reading
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                  Related Insights
                </h3>
              </div>
              <Link href="/articles" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                View all essays →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <ArticleCard key={rel.id} article={rel} variant="standard" />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};
