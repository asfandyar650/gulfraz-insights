import { redirect } from 'next/navigation';
import { categories } from '../../../lib/categories';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export default function CategoriesAliasPage({ params }: PageProps) {
  redirect(`/category/${params.slug}`);
}
