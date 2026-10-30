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
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2310b981'/%3E%3Cstop offset='100%25' stop-color='%23059669'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='8' fill='url(%23g)'/%3E%3Cpath d='M8 22L16 10L24 22M11 18H21' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Ccircle cx='23' cy='9' r='2' fill='%23fbbf24'/%3E%3C/svg%3E",
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
