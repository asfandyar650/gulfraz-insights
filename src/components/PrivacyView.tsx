'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, Cookie, Database, Mail, ArrowLeft, ArrowRight } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Privacy &amp; Data Security</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Privacy Policy
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          At Gulfraz Insights, one of our main priorities is the privacy of our visitors. This Privacy
          Policy document outlines the types of information that is collected and recorded by Gulfraz
          Insights and how we use it.
        </p>

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Last revised: <span className="font-medium text-slate-700 dark:text-slate-200">2026</span>
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-500" />
            1. Information We Collect
          </h2>
          <p>
            When you visit Gulfraz Insights, we collect minimal data required to provide a great reading
            experience. We do not require account registration or login to read essays or use our Freedom
            Calculator.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <li><strong>Saved Reading List:</strong> Saved strictly locally in your browser&apos;s localStorage. We never track or store your bookmarks on our servers.</li>
            <li><strong>Comments &amp; Feedback:</strong> If you leave a comment or send a message via our contact form, we collect the name and email you provide to facilitate conversation.</li>
            <li><strong>Log Files:</strong> Like standard websites, standard web hosting logs may record IP addresses, browser types, and timestamp data for security and performance diagnostics.</li>
          </ul>
        </section>

        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cookie className="w-5 h-5 text-emerald-500" />
            2. Cookies &amp; Web Beacons
          </h2>
          <p>
            Gulfraz Insights uses cookies only where essential, including remembering your theme preference
            (Dark / Light mode). Third-party vendors, including Google, may use cookies to serve ads based on
            a user&apos;s prior visits to our website or other websites.
          </p>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            You can choose to disable cookies through your individual browser options or via the Network
            Advertising Initiative opt-out page.
          </p>
        </section>

        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-500" />
            3. Third Party Privacy Policies
          </h2>
          <p>
            Gulfraz Insights&apos; Privacy Policy does not apply to other advertisers or websites. Thus, we
            are advising you to consult the respective Privacy Policies of these third-party ad servers
            for more detailed information.
          </p>
        </section>

        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-500" />
            4. Contact Us
          </h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not
            hesitate to contact us via email at:
          </p>
          <a
            href="mailto:supportgulfraz@gmail.com"
            className="inline-flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <Mail className="w-4 h-4" /> supportgulfraz@gmail.com
          </a>
        </section>
      </div>

      <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
        <Link
          href="/terms"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Read Terms &amp; Conditions
        </Link>
        <Link
          href="/support"
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline"
        >
          Support Gulfraz 💛 <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
