import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import rawArticles from '../../../data/articles.json';
import { Article } from '../../../types';
import { ArticleDetailClient } from './ArticleDetailClient';

const articles = rawArticles as Article[];

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = articles.find((a) => a.slug === params.slug || a.id === params.slug);

  if (!article) {
    return {
      title: 'Article Not Found — Gulfraz Insights',
    };
  }

  const title = `${article.title} — Gulfraz Insights`;
  const description = article.subtitle || article.excerpt.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [article.coverImage],
    },
  };
}

export default function ArticlePage({ params }: PageProps) {
  const article = articles.find((a) => a.slug === params.slug || a.id === params.slug);

  if (!article) {
    return <ArticleDetailClient fallbackArticle={undefined} slug={params.slug} />;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.subtitle || article.excerpt,
    image: [article.coverImage],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author?.name || 'Gulfraz Khan',
      url: 'https://gulfrazinsights.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Gulfraz Insights',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gulfrazinsights.com/wp-content/uploads/2026/07/cropped-Gulfraz-Insights-logo-192x192.jpeg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://gulfrazinsights.com/articles/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleDetailClient fallbackArticle={article} slug={params.slug} />
    </>
  );
}
