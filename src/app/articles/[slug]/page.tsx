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

  return <ArticleDetailClient fallbackArticle={article} slug={params.slug} />;
}
