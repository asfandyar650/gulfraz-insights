import { Metadata } from 'next';
import { SupportView } from '@/components/SupportView';

export const metadata: Metadata = {
  title: 'Support Gulfraz Insights 💛 - Voluntary Contribution & QR Code',
  description: 'Support Gulfraz Insights through JazzCash and Payoneer. Scan QR codes to contribute voluntarily and keep our work free and independent.',
};

export default function SupportGulfrazInsightsPage() {
  return <SupportView />;
}
