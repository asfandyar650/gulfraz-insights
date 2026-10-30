import { Metadata } from 'next';
import { TermsView } from '@/components/TermsView';

export const metadata: Metadata = {
  title: 'Terms and Conditions - Gulfraz Insights',
  description: 'Terms and Conditions outlining rules and regulations for using Gulfraz Insights.',
};

export default function TermsAndConditionsPage() {
  return <TermsView />;
}
