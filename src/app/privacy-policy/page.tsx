import { Metadata } from 'next';
import { PrivacyView } from '@/components/PrivacyView';

export const metadata: Metadata = {
  title: 'Privacy Policy - Gulfraz Insights',
  description: 'Privacy Policy and data practices for Gulfraz Insights.',
};

export default function PrivacyPolicyPage() {
  return <PrivacyView />;
}
