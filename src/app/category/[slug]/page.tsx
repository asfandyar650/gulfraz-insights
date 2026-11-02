import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories, getCategoryBySlug } from '../../../lib/categories';
import { CategoryPageClient } from './CategoryPageClient';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: 'Category Not Found — Gulfraz Insights',
    };
  }

  const title = `${category.name} — Gulfraz Insights`;
  const description = category.description;
  const canonicalUrl = `https://gulfrazinsights.com/category/${category.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Gulfraz Insights',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function CategoryPage({ params }: PageProps) {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `https://gulfrazinsights.com/category/${category.slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Gulfraz Insights',
      url: 'https://gulfrazinsights.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryPageClient category={category} />
    </>
  );
}
