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

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: 'wealth' | 'mindset' | 'psychology' | 'career';
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
  sections: ArticleSection[];
}

export interface Category {
  id: 'wealth' | 'mindset' | 'psychology' | 'career';
  name: string;
  description: string;
  iconName: string;
  badgeColor: 'emerald' | 'amber' | 'indigo' | 'violet';
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
