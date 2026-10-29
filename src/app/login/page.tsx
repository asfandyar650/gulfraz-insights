import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { AdminStudio } from '../../components/AdminStudio';

export const metadata: Metadata = {
  title: 'Author Login — Gulfraz Insights',
  description: 'Gulfraz Insights Author Studio',
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminStudio />
    </Suspense>
  );
}
