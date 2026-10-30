'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Shield,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Mail,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const TermsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('sec-1');

  const sections = [
    { id: 'sec-1', number: '1', title: 'Use of Website' },
    { id: 'sec-2', number: '2', title: 'Intellectual Property Rights' },
    { id: 'sec-3', number: '3', title: 'User Content' },
    { id: 'sec-4', number: '4', title: 'Disclaimer' },
    { id: 'sec-5', number: '5', title: 'Limitation of Liability' },
    { id: 'sec-6', number: '6', title: 'External Links' },
    { id: 'sec-7', number: '7', title: 'Google AdSense & Advertising' },
    { id: 'sec-8', number: '8', title: 'Privacy Policy' },
    { id: 'sec-9', number: '9', title: 'Changes to Terms' },
    { id: 'sec-10', number: '10', title: 'Governing Law' },
    { id: 'sec-11', number: '11', title: 'Contact Us' },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-12 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mb-4">
          <FileText className="w-3.5 h-3.5 text-emerald-500" />
          <span>Legal &amp; Transparency</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Terms and Conditions
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Welcome to Gulfraz Insights! These terms and conditions outline the rules and regulations for the use of our website, located at{' '}
          <a
            href="https://gulfrazinsights.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 font-semibold underline underline-offset-4 hover:opacity-80"
          >
            https://gulfrazinsights.com/
          </a>{' '}
          and its official mirrors.
        </p>

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Last revised: <span className="font-medium text-slate-700 dark:text-slate-200">2026</span> • Published by Gulfraz Khan
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Table of Contents - Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Table of Contents
            </h3>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    activeSection === sec.id
                      ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">
                    {sec.number}. {sec.title}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                </button>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <p>Questions about these terms?</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                <Mail className="w-3.5 h-3.5" /> Editorial Contact Desk
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Body */}
        <div className="lg:col-span-8 space-y-8 sm:space-y-10">
          {/* Introductory Notice Callout */}
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-800 dark:text-slate-200 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed">
              <strong className="text-amber-900 dark:text-amber-300 font-semibold block mb-1">
                Agreement to Terms
              </strong>
              By accessing this website, we assume you accept these terms and conditions in full. Do not
              continue to use Gulfraz Insights if you do not agree to all of the terms and conditions
              stated on this page.
            </div>
          </div>

          {/* 1. Use of Website */}
          <section id="sec-1" className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center">
                1
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Use of Website
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              By using this website, you agree to:
            </p>
            <ul className="space-y-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-5">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span>Use the website only for lawful purposes</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span>Not engage in any activity that may harm, overburden, or disrupt the website</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span>Not attempt to gain unauthorized access to any part or server of the website</span>
              </li>
            </ul>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
              We reserve the right to restrict or terminate access if any misuse or malicious activity is detected.
            </p>
          </section>

          {/* 2. Intellectual Property Rights */}
          <section id="sec-2" className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center">
                2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Intellectual Property Rights
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Unless otherwise stated, Gulfraz Insights and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-500/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
                  You may:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  View and print content from Gulfraz Insights for your own personal, non-commercial use.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-500/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-2">
                  You must not:
                </h4>
                <ul className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li>• Republish, sell, or redistribute content without permission</li>
                  <li>• Copy or reproduce material for commercial purposes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. User Content */}
          <section id="sec-3" className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center">
                3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                User Content
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              If you post comments, notes, or submit content to our platform:
            </p>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>You grant us a non-exclusive license to use, reproduce, and edit your content.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Your content must not be illegal, offensive, libelous, or violate any third-party rights.</span>
              </li>
            </ul>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              We reserve the right to monitor and remove any user comments or submissions deemed inappropriate or harmful.
            </p>
          </section>

          {/* 4. Disclaimer */}
          <section id="sec-4" className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center">
                4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Disclaimer
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              All information on this website is published in good faith and for general informational and educational purposes only.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 mb-4">
              <p className="font-semibold text-slate-800 dark:text-white">
                We do not make any warranties about:
              </p>
              <p>• Completeness</p>
              <p>• Reliability</p>
              <p>• Accuracy</p>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic">
              Any action you take based on the information on this website is strictly at your own risk. The financial models and freedom calculators are educational tools, not formal financial or legal advice.
            </p>
          </section>

          {/* 5. Limitation of Liability */}
          <section id="sec-5" className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center">
                5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Limitation of Liability
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Gulfraz Insights will not be held liable for any losses or damages in connection with the use of our website or reliance on any material published herein.
            </p>
          </section>

          {/* 6. External Links */}
          <section id="sec-6" className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center">
                6
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                External Links
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Our website may contain links to external websites. We do not have control over the content and nature of these external sites and are not responsible for their material, practices, or privacy standards.
            </p>
          </section>

          {/* 7. Google AdSense and Advertising */}
          <section id="sec-7" className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center">
                7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Google AdSense &amp; Advertising
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              We may display ads from third-party vendors such as Google. These ads may use cookies or web beacons to serve personalized content based on your visits to this and other websites.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              By using our website, you agree to the use of such advertising and measurement technologies.
            </p>
          </section>

          {/* 8. Privacy Policy */}
          <section id="sec-8" className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center">
                8
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Privacy Policy
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Please refer to our Privacy Policy page for detailed information about how we collect, safeguard, and use your data.
            </p>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 font-semibold text-xs hover:bg-emerald-100 transition-colors"
            >
              Read Full Privacy Policy <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </section>

          {/* 9. Changes to Terms */}
          <section id="sec-9" className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center">
                9
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Changes to Terms
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              We may update these Terms and Conditions at any time. Changes will be posted immediately on this page with the revision date updated accordingly.
            </p>
          </section>

          {/* 10. Governing Law */}
          <section id="sec-10" className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center">
                10
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Governing Law
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              These terms shall be governed and interpreted in accordance with applicable laws without regard to conflict of law principles.
            </p>
          </section>

          {/* 11. Contact Us */}
          <section id="sec-11" className="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center">
                11
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Contact Us
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              If you have any questions or clarifications regarding these Terms and Conditions, please contact us:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-500 dark:text-slate-400">Direct Contact:</span>
                <Link
                  href="/contact"
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Contact Editorial Desk
                </Link>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ExternalLink className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-500 dark:text-slate-400">Website:</span>
                <a
                  href="https://gulfrazinsights.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  https://gulfrazinsights.com/
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
