import type { Metadata } from 'next';
import './globals.css';
import { ClientLayout } from './ClientLayout';

export const metadata: Metadata = {
  title: 'Gulfraz Insights — Smart Ideas. Real Insights.',
  description:
    'Gulfraz Insights is your premier publication for wealth creation, financial freedom, mastery, cognitive psychology, and actionable self-improvement.',
  authors: [{ name: 'Gulfraz Khan' }],
  metadataBase: new URL('https://gulfrazinsight.vercel.app'),
  openGraph: {
    type: 'website',
    siteName: 'Gulfraz Insights',
    title: 'Gulfraz Insights — Smart Ideas. Real Insights.',
    description:
      'Essays, strategic book breakdowns, financial freedom frameworks, and cognitive psychology by Gulfraz Khan.',
    url: 'https://gulfrazinsight.vercel.app/',
    images: [
      {
        url: 'https://gulfrazinsights.com/wp-content/uploads/2026/09/Generated-Image-September-10-2026-12_02AM.png',
        width: 1200,
        height: 630,
        alt: 'Gulfraz Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gulfraz Insights — Smart Ideas. Real Insights.',
    description:
      'Essays, strategic book breakdowns, financial freedom frameworks, and cognitive psychology by Gulfraz Khan.',
    creator: '@gulfrazinsights',
  },
  icons: {
    icon: '/assets/gulfraz-logo.png',
    apple: '/assets/gulfraz-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Google AdSense Account Verification */}
        <meta name="google-adsense-account" content="ca-pub-5904976707208833" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5904976707208833"
          crossOrigin="anonymous"
        />

        {/* Schema.org Structured Data for Google Indexing & AdSense Authority */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://gulfrazinsights.com/#website',
                  url: 'https://gulfrazinsights.com/',
                  name: 'Gulfraz Insights',
                  description: 'Smart Ideas. Real Insights. Personal Finance, Wealth & Psychology.',
                  inLanguage: 'en-US',
                  publisher: {
                    '@id': 'https://gulfrazinsights.com/#person',
                  },
                },
                {
                  '@type': 'Person',
                  '@id': 'https://gulfrazinsights.com/#person',
                  name: 'Gulfraz Khan',
                  jobTitle: 'Author & Financial Researcher',
                  url: 'https://gulfrazinsights.com/about',
                  sameAs: [
                    'https://www.instagram.com/gulfrazinsightss?vrfl=N2J2M2J3M3p2bDhp',
                    'https://www.facebook.com/share/1EuquaFbJ9/'
                  ],
                  description: 'Founder and writer at Gulfraz Insights.',
                },
              ],
            }),
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('gulfraz_theme');
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-200">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
