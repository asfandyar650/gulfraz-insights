'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, DollarSign, TrendingUp, Percent, Wallet, Sparkles } from 'lucide-react';

export const FreedomCalculator: React.FC = () => {
  const [initialSavings, setInitialSavings] = useState(15000);
  const [monthlyInvestment, setMonthlyInvestment] = useState(1000);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [annualExpenses, setAnnualExpenses] = useState(50000);

  // Target FIRE Number (25x annual spending based on the 4% safe withdrawal rule)
  const fireTarget = useMemo(() => annualExpenses * 25, [annualExpenses]);

  // Compounding trajectory
  const results = useMemo(() => {
    let balance = initialSavings;
    const monthlyRate = annualReturn / 100 / 12;
    let monthsToFire = -1;

    for (let month = 1; month <= 480; month++) {
      balance = balance * (1 + monthlyRate) + monthlyInvestment;
      if (balance >= fireTarget && monthsToFire === -1) {
        monthsToFire = month;
      }
    }

    // 10 years (120 months)
    let tenYearBal = initialSavings;
    for (let m = 0; m < 120; m++) {
      tenYearBal = tenYearBal * (1 + monthlyRate) + monthlyInvestment;
    }

    // 20 years (240 months)
    let twentyYearBal = initialSavings;
    for (let m = 0; m < 240; m++) {
      twentyYearBal = twentyYearBal * (1 + monthlyRate) + monthlyInvestment;
    }

    const totalContributed20 = initialSavings + monthlyInvestment * 240;
    const interestGained20 = Math.max(0, twentyYearBal - totalContributed20);

    return {
      fireYears: monthsToFire === -1 ? '> 40' : (monthsToFire / 12).toFixed(1),
      tenYearBalance: Math.round(tenYearBal),
      twentyYearBalance: Math.round(twentyYearBal),
      totalContributedIn20Years: Math.round(totalContributed20),
      interestGainedIn20Years: Math.round(interestGained20),
    };
  }, [initialSavings, monthlyInvestment, annualReturn, fireTarget]);

  const contributionPct = Math.round(
    (results.totalContributedIn20Years / results.twentyYearBalance) * 100
  );
  const interestPct = Math.max(0, 100 - contributionPct);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-850 text-white rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-800 shadow-2xl relative overflow-hidden w-full max-w-full">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-slate-800">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 shrink-0 mt-0.5 sm:mt-0">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
                Practical Tool
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Compound Math
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white mt-0.5 break-words">
              Financial Independence & Compounding Calculator
            </h3>
          </div>
        </div>

        <div className="text-left md:text-right shrink-0 pt-2 md:pt-0 border-t border-slate-800/60 md:border-t-0">
          <p className="text-[11px] sm:text-xs text-slate-400">Target Freedom Number (25x Spend)</p>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-400">
            ${fireTarget.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Grid Inputs & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 relative z-10">
        {/* Sliders (Left Column) */}
        <div className="lg:col-span-6 space-y-5 sm:space-y-6">
          {/* Initial Savings */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-1 text-xs sm:text-sm mb-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" /> Current Savings & Investments
              </label>
              <span className="font-bold text-white shrink-0">
                ${initialSavings.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={250000}
              step={1000}
              value={initialSavings}
              onChange={(e) => setInitialSavings(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 mt-1">
              <span>$0</span>
              <span>$100k</span>
              <span>$250k+</span>
            </div>
          </div>

          {/* Monthly Investment */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-1 text-xs sm:text-sm mb-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Monthly Investment
              </label>
              <span className="font-bold text-emerald-400 shrink-0">
                ${monthlyInvestment.toLocaleString()} / mo
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={10000}
              step={100}
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 mt-1">
              <span>$100/mo</span>
              <span>$3,000/mo</span>
              <span>$10,000/mo</span>
            </div>
          </div>

          {/* Annual Return */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-1 text-xs sm:text-sm mb-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-amber-400" /> Expected Annual Return
              </label>
              <span className="font-bold text-amber-400 shrink-0">
                {annualReturn}% per year
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={14}
              step={0.5}
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 mt-1">
              <span>4% (Low)</span>
              <span>8% (Historical Avg)</span>
              <span>14% (High)</span>
            </div>
          </div>

          {/* Annual Expenses */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-1 text-xs sm:text-sm mb-1.5">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" /> Estimated Annual Living Expenses
              </label>
              <span className="font-bold text-sky-400 shrink-0">
                ${annualExpenses.toLocaleString()} / yr
              </span>
            </div>
            <input
              type="range"
              min={24000}
              max={200000}
              step={2000}
              value={annualExpenses}
              onChange={(e) => setAnnualExpenses(Number(e.target.value))}
              className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 mt-1">
              <span>$24k/yr</span>
              <span>$60k/yr</span>
              <span>$200k/yr</span>
            </div>
          </div>
        </div>

        {/* Results Panel (Right Column) */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-slate-950/70 rounded-2xl p-4 sm:p-6 border border-slate-800/80">
          <div>
            {/* Big Stat Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-500/30 mb-4 sm:mb-5">
              <span className="text-[11px] sm:text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                Estimated Timeline to Complete Independence
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-5xl font-black text-white">
                  {results.fireYears}
                </span>
                <span className="text-slate-300 text-base sm:text-lg font-medium">years</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Saving ${monthlyInvestment.toLocaleString()}/mo builds a $
                {fireTarget.toLocaleString()} portfolio to support $
                {annualExpenses.toLocaleString()}/yr perpetual living costs.
              </p>
            </div>

            {/* 10y and 20y Cards */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
              <div className="bg-slate-900/80 p-3 sm:p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] sm:text-xs text-slate-400 block mb-1">
                  10-Year Projected Portfolio
                </span>
                <span className="text-lg sm:text-2xl font-bold text-white">
                  ${results.tenYearBalance.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-900/80 p-3 sm:p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] sm:text-xs text-slate-400 block mb-1">
                  20-Year Projected Portfolio
                </span>
                <span className="text-lg sm:text-2xl font-bold text-emerald-400">
                  ${results.twentyYearBalance.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Visual Compounding Breakdown */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 mb-4">
              <div className="flex justify-between text-xs text-slate-300 mb-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
                  Your Deposits ({contributionPct}%)
                </span>
                <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  Compound Growth ({interestPct}%)
                </span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-slate-500"
                  style={{ width: `${contributionPct}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  style={{ width: `${interestPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                <span>Deposited: ${results.totalContributedIn20Years.toLocaleString()}</span>
                <span>Growth: +${results.interestGainedIn20Years.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed border-t border-slate-800/80 pt-3">
            Based on the standard 4% Rule (Trinity Study) assuming a diversified index portfolio (e.g. S&P 500 / Total Stock Market) reinvesting dividend yields.
          </p>
        </div>
      </div>
    </div>
  );
};
