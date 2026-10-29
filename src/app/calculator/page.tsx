import React from 'react';
import { Metadata } from 'next';
import { FreedomCalculator } from '../../components/FreedomCalculator';

export const metadata: Metadata = {
  title: 'FIRE Financial Independence Calculator — Gulfraz Insights',
  description:
    'Calculate your financial freedom number, savings rate, and exact timeline to retire early.',
};

export default function CalculatorPage() {
  return (
    <div className="py-12 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Practical Planning
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 mb-3">
          Financial Freedom &amp; Compounding Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Explore how consistent savings, sensible living costs, and compound growth shape your path to financial independence.
        </p>
      </div>

      <FreedomCalculator />
    </div>
  );
}
