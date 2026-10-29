import React from 'react';
import { Metadata } from 'next';
import { ContactView } from '../../components/ContactView';

export const metadata: Metadata = {
  title: 'Contact & Editorial Collaboration — Gulfraz Insights',
  description:
    'Get in touch with Gulfraz Insights for editorial questions, collaborations, or feedback.',
};

export default function ContactPage() {
  return <ContactView />;
}
