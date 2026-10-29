'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, Compass, Brain, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { author } from '../data/siteData';

export const AboutView: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          The Story Behind Gulfraz Insights
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
          Smart Ideas. Real Insights.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          A quiet corner of the internet for thoughtful readers looking to build financial independence, master their daily habits, and understand human nature.
        </p>
      </div>

      {/* Author Bio Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl mb-14">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start text-center sm:text-left">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-emerald-500 shadow-lg shrink-0"
          />
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                A Note from the Author
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                Hi, I&apos;m Gulfraz Khan.
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              I&apos;ve always been obsessed with a simple question:{' '}
              <strong className="text-slate-900 dark:text-white">
                how do everyday people build genuine freedom in their lives?
              </strong>
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Most advice on the internet swings between two extremes: flashy get-rich-quick schemes that leave you broke, or boring conventional wisdom telling you to sacrifice your best years in a cubicle hoping you can finally enjoy life in your late sixties.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              I started Gulfraz Insights to document what actually works. Whenever I read an influential book on economics, psychology, or mindset, I deconstruct it into practical notes and clear principles you can test in your own life.
            </p>
          </div>
        </div>
      </div>

      {/* The Four Pillars */}
      <div className="mb-14">
        <div className="text-center sm:text-left mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            What You&apos;ll Find Here
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            The Four Pillars of the Publication
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              1. Wealth & Financial Independence
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Understanding index funds, living below your means, cash flow systems, and decoupling your income from working hours. Lessons from books like <em>The Millionaire Fastlane</em> and <em>The Simple Path to Wealth</em>.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              2. Mindset & Personal Discipline
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Building consistency, beating self-doubt, and creating daily routines that stick. Focusing on deep work over shallow distractions.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              3. Psychology & Human Nature
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Studying power dynamics, emotional intelligence, attraction, and behavior through timeless authors like Robert Greene and classic Stoic philosophers.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              4. Career & Value Creation
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Building rare, valuable skills that people actually need. Why passion alone isn&apos;t enough, and how deliberate practice creates real career leverage.
            </p>
          </div>
        </div>
      </div>

      {/* Reader Promise */}
      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          My Promise to You as a Reader
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          I will never publish low-effort clickbait or sponsored hype that I wouldn&apos;t recommend to a close friend. Every essay here is written with care, honesty, and respect for your time.
        </p>
        <div className="pt-2">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Start exploring the essays <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
