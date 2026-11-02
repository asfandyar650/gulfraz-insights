'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  QrCode,
  Download,
  Maximize2,
  X,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Mail,
  ArrowRight,
  ExternalLink,
  Smartphone,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../context/ToastContext';

interface QrModalData {
  title: string;
  subtitle: string;
  imageSrc: string;
  filename: string;
  provider: 'easypaisa';
}

export const SupportView: React.FC = () => {
  const { showToast } = useToast();
  const [activeModal, setActiveModal] = useState<QrModalData | null>(null);

  const handleConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const openQrModal = (data: QrModalData) => {
    setActiveModal(data);
    handleConfetti();
  };

  const handleDownload = (imageSrc: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading ${filename}...`, 'success');
  };

  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-4 shadow-sm">
          <Heart className="w-4 h-4 fill-emerald-500 text-emerald-500 animate-pulse" />
          <span>Reader-Supported Independent Publication</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Support Gulfraz Insights <span className="text-amber-500">💛</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          If you find Gulfraz Insights useful, you can support our independent research with a voluntary contribution.
          Your support helps maintain the website, keep our essays completely open with no paywalls,
          and continue producing practical, in-depth summaries.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Voluntary
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Paywalls Ever
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Easypaisa QR
          </span>
        </div>
      </div>

      {/* Main Support Card: Easypaisa Spotlight */}
      <div className="mb-16">
        <div className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-2xl hover:border-emerald-500/40 transition-all duration-300 relative overflow-hidden max-w-2xl mx-auto">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-bl-full pointer-events-none" />

          {/* Provider Tag */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" /> Easypaisa QR
            </span>
            <span className="text-xs font-semibold text-slate-400">Easypaisa / Raast / Any Bank</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Support via Easypaisa
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 mb-6 leading-relaxed">
            Scan this official QR code using the <strong>Easypaisa app</strong> or any Pakistani mobile banking app (Nayapay, Sadapay, HBL, Meezan, etc.).
          </p>

          {/* Account Details Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Account Title
                </p>
                <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  GULZAR HUSSAIN ANJUM
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Number / MSISDN
              </p>
              <p className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                *******2292
              </p>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center relative mb-6">
            <div
              onClick={() =>
                openQrModal({
                  title: 'Support via Easypaisa',
                  subtitle: "Scan to send money to GULZAR HUSSAIN ANJUM's easypaisa account",
                  imageSrc: '/images/easypaisa-qr.jpg',
                  filename: 'gulfraz-insights-easypaisa-qr.jpg',
                  provider: 'easypaisa',
                })
              }
              className="cursor-pointer relative group/qr overflow-hidden rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white p-3 shadow-md max-w-xs"
            >
              <img
                src="/images/easypaisa-qr.jpg"
                alt="Easypaisa QR Code - GULZAR HUSSAIN ANJUM - Gulfraz Insights"
                className="w-64 h-64 sm:w-72 sm:h-72 object-contain rounded-xl transition-transform duration-300 group-hover/qr:scale-105"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/qr:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
                <span className="px-3.5 py-2 rounded-xl bg-white/95 text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-lg">
                  <Maximize2 className="w-4 h-4 text-emerald-600" /> Tap to Enlarge
                </span>
              </div>
            </div>

            {/* QR Action Buttons */}
            <div className="flex items-center gap-3 mt-5 w-full max-w-xs">
              <button
                onClick={() =>
                  openQrModal({
                    title: 'Support via Easypaisa',
                    subtitle: "Scan to send money to GULZAR HUSSAIN ANJUM's easypaisa account",
                    imageSrc: '/images/easypaisa-qr.jpg',
                    filename: 'gulfraz-insights-easypaisa-qr.jpg',
                    provider: 'easypaisa',
                  })
                }
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" /> Zoom QR
              </button>
              <button
                onClick={() => handleDownload('/images/easypaisa-qr.jpg', 'gulfraz-insights-easypaisa-qr.jpg')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Save QR
              </button>
            </div>
          </div>

          {/* Quote Box */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-slate-200 mb-6">
            <p className="text-sm font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              Thank you for supporting Gulfraz Insights! ❤️
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Every voluntary contribution, no matter the amount, directly fuels our reading, research, and independent writing.
            </p>
          </div>

          {/* Quick Steps */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
            <p className="font-semibold text-slate-700 dark:text-slate-300">How to contribute:</p>
            <p>1. Open the <strong>Easypaisa</strong> app or your mobile banking app (Nayapay, Sadapay, HBL, Meezan, Bank Alfalah, etc.).</p>
            <p>2. Tap <strong>Scan QR</strong> or upload this QR code from your mobile gallery.</p>
            <p>3. Confirm recipient <strong>GULZAR HUSSAIN ANJUM</strong> and send your contribution.</p>
          </div>
        </div>
      </div>

      {/* Support FAQ & Values */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 mb-14">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Why Support Matters
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Where your support goes
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Gulfraz Insights is operated independently by Gulfraz Khan. We don&apos;t run intrusive pop-ups,
            we don&apos;t sell user data, and we don&apos;t lock essays behind subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-3">
              1
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Server &amp; Tech Costs</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Domain registration, secure CDN hosting, high-availability architecture, and fast load speeds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-3">
              2
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Book Research &amp; Notes</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Purchasing essential literature across economics, cognitive psychology, and business strategy.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-3">
              3
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Free Access For All</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Ensuring all 73+ essays and the Freedom Calculator remain 100% free for students and readers worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Questions or Assistance */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold">Have a question about supporting?</h3>
          <p className="text-sm text-emerald-100 max-w-lg">
            If you need confirmation or want to reach out directly to Gulfraz, send an email anytime.
          </p>
        </div>
        <Link
          href="/contact"
          className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold text-sm shadow hover:bg-emerald-50 transition-all flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Mail className="w-4 h-4 text-emerald-600" /> Contact Editorial Desk
        </Link>
      </div>

      {/* QR Code Fullscreen Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setActiveModal(null)}
          />

          <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 z-10 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {activeModal.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeModal.subtitle}
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Big Image */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center my-4 shadow-inner">
              <img
                src={activeModal.imageSrc}
                alt={activeModal.title}
                className="w-72 h-72 sm:w-80 sm:h-80 object-contain"
              />
            </div>

            {/* Thank you note */}
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-6">
              Thank you for supporting Gulfraz Insights! ❤️ Every contribution is deeply appreciated.
            </p>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => handleDownload(activeModal.imageSrc, activeModal.filename)}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" /> Save QR Code
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
