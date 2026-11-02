export interface ArticleAuthor {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  twitter?: string;
  linkedin?: string;
}

export interface SectionQuote {
  text: string;
  author?: string;
}

export interface ArticleSection {
  id?: string;
  title?: string;
  content: string[] | string;
  image?: string;
  quote?: SectionQuote;
}

export type CategoryId =
  | 'book-notes'
  | 'wealth-investing'
  | 'make-money-online'
  | 'mindset-psychology'
  | 'career-skills'
  // Support legacy category strings during migration
  | 'wealth'
  | 'mindset'
  | 'psychology'
  | 'career';

export type ContentBlockType =
  | 'paragraph'
  | 'heading'
  | 'subheading'
  | 'image'
  | 'quote'
  | 'bullet-list'
  | 'numbered-list'
  | 'divider';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  // For paragraph, heading, subheading
  text?: string;
  level?: 1 | 2 | 3; // 1 = H1, 2 = H2, 3 = H3
  // For image
  url?: string;
  caption?: string;
  alt?: string;
  alignment?: 'left' | 'center' | 'right' | 'full';
  size?: 'small' | 'medium' | 'large' | 'full';
  // For quote
  quoteText?: string;
  quoteAuthor?: string;
  quoteSource?: string;
  // For lists
  items?: string[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: CategoryId;
  author: ArticleAuthor;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  featured?: boolean;
  trending?: boolean;
  views: number;
  claps: number;
  keyTakeaways: string[];
  // Block-based content system (unlimited paragraphs, images, quotes, etc.)
  contentBlocks?: ContentBlock[];
  // Legacy sections preserved for backward compatibility
  sections: ArticleSection[];
  // Publishing & SEO options
  status?: 'draft' | 'published';
  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: string;
}

export interface Category {
  id: 'book-notes' | 'wealth-investing' | 'make-money-online' | 'mindset-psychology' | 'career-skills';
  slug: string;
  name: string;
  description: string;
  iconName: string;
  badgeColor: 'amber' | 'emerald' | 'cyan' | 'indigo' | 'violet';
}

export interface Quote {
  quote: string;
  author: string;
  source: string;
}

export interface Comment {
  id: string;
  author: string;
  date: string;
  text: string;
}
