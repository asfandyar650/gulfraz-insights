export interface ArticleAuthor {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
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

export interface SeoFactorScore {
  score: number;
  maxScore: number;
  label: string;
  notes: string;
}

export interface SeoBreakdown {
  contentQuality: SeoFactorScore; // max 25
  keywordRelevance: SeoFactorScore; // max 15
  titleMeta: SeoFactorScore; // max 15
  headingStructure: SeoFactorScore; // max 10
  readability: SeoFactorScore; // max 10
  originality: SeoFactorScore; // max 10
  imageOptimization: SeoFactorScore; // max 5
  internalLinking: SeoFactorScore; // max 5
  searchIntent: SeoFactorScore; // max 5
}

export type SeoGrade = 'excellent' | 'good' | 'needs-improvement' | 'poor';

export interface SeoAnalysisResult {
  score: number; // 0 - 100
  grade: SeoGrade;
  breakdown: SeoBreakdown;
  issues: string[];
  suggestions: string[];
  analyzedAt: string;
  targetKeyword?: string;
  wordCount: number;
  headingCount: number;
  imageCount: number;
  internalLinkCount: number;
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
  // Intelligent SEO Ranking System
  seoScore?: number; // 0 - 100
  seoAnalysis?: SeoAnalysisResult;
  seoIssues?: string[];
  seoSuggestions?: string[];
  lastAnalyzedAt?: string;
  pinned?: boolean; // Admin override / pin to position #1
  customRank?: number;
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
