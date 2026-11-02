import { Category, CategoryId } from '../types';

export const categories: Category[] = [
  {
    id: 'book-notes',
    slug: 'book-notes',
    name: 'Book Notes',
    description: 'Book summaries, important lessons, key ideas, and takeaways from books.',
    iconName: 'BookOpen',
    badgeColor: 'amber',
  },
  {
    id: 'wealth-investing',
    slug: 'wealth-investing',
    name: 'Wealth & Investing',
    description: 'Financial freedom, savings, wealth building, budgeting, and investment education.',
    iconName: 'TrendingUp',
    badgeColor: 'emerald',
  },
  {
    id: 'make-money-online',
    slug: 'make-money-online',
    name: 'Make Money Online',
    description: 'Online businesses, side hustles, AI tools, freelancing, and earning through digital skills.',
    iconName: 'Laptop',
    badgeColor: 'cyan',
  },
  {
    id: 'mindset-psychology',
    slug: 'mindset-psychology',
    name: 'Mindset & Psychology',
    description: 'Personal development, human psychology, discipline, habits, productivity, and mindset.',
    iconName: 'Brain',
    badgeColor: 'indigo',
  },
  {
    id: 'career-skills',
    slug: 'career-skills',
    name: 'Career & Skills',
    description: 'Career development, professional skills, learning, technology, and career opportunities.',
    iconName: 'Zap',
    badgeColor: 'violet',
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id || c.slug === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug || c.id === slug);
}

// Maps legacy category string to one of the 5 new categories
export function normalizeCategory(cat: string): CategoryId {
  if (!cat) return 'wealth-investing';
  const lower = cat.toLowerCase();
  if (lower === 'book-notes' || lower.includes('book')) return 'book-notes';
  if (lower === 'wealth-investing' || lower === 'wealth' || lower.includes('invest')) return 'wealth-investing';
  if (lower === 'make-money-online' || lower.includes('money') || lower.includes('online')) return 'make-money-online';
  if (lower === 'mindset-psychology' || lower === 'mindset' || lower === 'psychology') return 'mindset-psychology';
  if (lower === 'career-skills' || lower === 'career' || lower.includes('skill')) return 'career-skills';
  return 'wealth-investing';
}

export function getCategoryBadgeClass(category: string): string {
  const norm = normalizeCategory(category);
  switch (norm) {
    case 'book-notes':
      return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60';
    case 'wealth-investing':
      return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60';
    case 'make-money-online':
      return 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800/60';
    case 'mindset-psychology':
      return 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/60';
    case 'career-skills':
      return 'text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-800/60';
    default:
      return 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  }
}

export function getCategoryLabel(category: string): string {
  const cat = getCategoryById(category) || getCategoryById(normalizeCategory(category));
  return cat ? cat.name : 'General';
}
