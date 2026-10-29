import React from 'react';
import { Metadata } from 'next';
import { AboutView } from '../../components/AboutView';

export const metadata: Metadata = {
  title: 'About Gulfraz Khan & The Publication — Gulfraz Insights',
  description: 'Meet the author and discover the mission behind Gulfraz Insights.',
};

export default function AboutPage() {
  return <AboutView />;
}
