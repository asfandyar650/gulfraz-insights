import { Article, Category, Quote, ArticleAuthor } from '../types';
import rawArticles from './articles.json';

export const author: ArticleAuthor = {
  name: "Gulfraz Khan",
  role: "Writer & Founder",
  avatar: "/assets/gulfraz-avatar-MBgtF9on.jpg",
  bio: "Reader, writer, and researcher. I study personal finance, psychology, and the habits behind true independence, turning the best books into practical essays for everyday life.",
  twitter: "https://twitter.com",
  linkedin: "https://linkedin.com",
  instagram: "https://www.instagram.com/gulfrazinsightss?vrfl=N2J2M2J3M3p2bDhp",
  facebook: "https://www.facebook.com/share/1EuquaFbJ9/"
};

export const categories: Category[] = [
  {
    id: "book-notes",
    slug: "book-notes",
    name: "Book Notes",
    description: "Book summaries, important lessons, key ideas, and takeaways from books.",
    iconName: "BookOpen",
    badgeColor: "amber"
  },
  {
    id: "wealth-investing",
    slug: "wealth-investing",
    name: "Wealth & Investing",
    description: "Financial freedom, savings, wealth building, budgeting, and investment education.",
    iconName: "TrendingUp",
    badgeColor: "emerald"
  },
  {
    id: "make-money-online",
    slug: "make-money-online",
    name: "Make Money Online",
    description: "Online businesses, side hustles, AI tools, freelancing, and earning through digital skills.",
    iconName: "Laptop",
    badgeColor: "cyan"
  },
  {
    id: "mindset-psychology",
    slug: "mindset-psychology",
    name: "Mindset & Psychology",
    description: "Personal development, human psychology, discipline, habits, productivity, and mindset.",
    iconName: "Brain",
    badgeColor: "indigo"
  },
  {
    id: "career-skills",
    slug: "career-skills",
    name: "Career & Skills",
    description: "Career development, professional skills, learning, technology, and career opportunities.",
    iconName: "Zap",
    badgeColor: "violet"
  }
];

export const quotes: Quote[] = [
  {
    quote: "If you want to be rich, stop consuming and start producing. Don't buy franchises; sell them.",
    author: "M.J. DeMarco",
    source: "The Millionaire Fastlane"
  },
  {
    quote: "Simplicity is the master key to financial independence. Spend less than you earn, invest the surplus, avoid debt.",
    author: "J.L. Collins",
    source: "The Simple Path to Wealth"
  },
  {
    quote: "The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable.",
    author: "Cal Newport",
    source: "Deep Work"
  },
  {
    quote: "Never assume that the person you are dealing with is weaker or less important than you are.",
    author: "Robert Greene",
    source: "48 Laws of Power"
  },
  {
    quote: "Greatness is not a function of circumstance. Greatness, it turns out, is largely a matter of conscious choice.",
    author: "Jim Collins",
    source: "Good to Great"
  },
  {
    quote: "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.",
    author: "Albert Einstein",
    source: "Attributed"
  }
];

export const articles: Article[] = rawArticles as Article[];
export const defaultArticles: Article[] = articles;
