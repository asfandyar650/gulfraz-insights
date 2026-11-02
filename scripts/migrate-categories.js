const fs = require('fs');
const path = require('path');

const articlesPath = path.join(__dirname, '..', 'src', 'data', 'articles.json');
const siteDataJsonPath = path.join(__dirname, '..', 'src', 'data', 'siteData.json');
const siteDataTsPath = path.join(__dirname, '..', 'src', 'data', 'siteData.ts');

const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

// Exact mappings for all 73 articles into the 5 categories
const categoryMap = {
  // 1. Book Notes (20 articles)
  'art-16750': 'book-notes', // Millionaire Fastlane
  'art-16721': 'book-notes', // Your Money or Your Life
  'art-16678': 'book-notes', // The Art of Seduction
  'art-16226': 'book-notes', // Good to Great
  'art-16260': 'book-notes', // Mastery
  'art-16227': 'book-notes', // Mariner Finance Book
  'art-12511': 'book-notes', // Steve Jobs
  'art-12484': 'book-notes', // Money: Master the Game
  'art-12441': 'book-notes', // Science of Getting Rich
  'art-12412': 'book-notes', // Wealth of Nations
  'art-12421': 'book-notes', // Financial Peace Revisited
  'art-12387': 'book-notes', // The Wealthy Barber
  'art-12357': 'book-notes', // I Will Teach You to Be Rich
  'art-12343': 'book-notes', // The Total Money Makeover
  'art-12322': 'book-notes', // The Millionaire Next Door
  'art-12227': 'book-notes', // Poor Charlie’s Almanack
  'art-12196': 'book-notes', // Success System That Never Fails
  'art-12187': 'book-notes', // The Powerful Principles (Ray Dalio)
  'art-12159': 'book-notes', // Think and Grow Rich
  'art-12076': 'book-notes', // How to Become the Richest Man (Babylon)

  // 2. Make Money Online (10 articles)
  'art-16190': 'make-money-online', // The Ultimate Guide to Making Money Online
  'art-16160': 'make-money-online', // Smart Online Money Making
  'art-12613': 'make-money-online', // Big Tech in Finance / Web3
  'art-12542': 'make-money-online', // Hack the Buyer Brain: Marketing
  'art-12495': 'make-money-online', // Make Money Easy
  'art-12462': 'make-money-online', // Your Primitive Business Guide to Better Leads
  'art-16207': 'make-money-online', // Rare Small Business Ideas
  'art-12429': 'make-money-online', // When Is the Right Time to Sell My Business?
  'art-11944': 'make-money-online', // The Best 5 Passive Income Ideas for Beginners
  'art-11933': 'make-money-online', // Best AI Tools to Make Money Online in 2026

  // 3. Wealth & Investing (21 articles)
  'art-16697': 'wealth-investing', // Effortless Wealth
  'art-16666': 'wealth-investing', // Dollar Tree: Discount Store
  'art-16275': 'wealth-investing', // Regional Finance
  'art-16237': 'wealth-investing', // Exeter Finance
  'art-12599': 'wealth-investing', // The Ultimate Wealth Creation
  'art-12576': 'wealth-investing', // Secrets of Jewish Wealth
  'art-12544': 'wealth-investing', // Hidden Power of Frugal Living
  'art-12509': 'wealth-investing', // How to Choose the Best Investment
  'art-12507': 'wealth-investing', // Foolish Guide to Personal Finance
  'art-12472': 'wealth-investing', // Lessons for Building a Winning Portfolio
  'art-12403': 'wealth-investing', // How To be a MILLIONAIRE
  'art-12396': 'wealth-investing', // Get the Hell Out of Debt
  'art-12368': 'wealth-investing', // Make Every Penny Count
  'art-12366': 'wealth-investing', // The Art of Spending Money
  'art-12348': 'wealth-investing', // Remarkable Investment Guide
  'art-12313': 'wealth-investing', // Simple Guide to Mastering Money & Markets
  'art-12289': 'wealth-investing', // 100 Ways to Become a Millionaire
  'art-12262': 'wealth-investing', // Simple Financial Secret
  'art-12229': 'wealth-investing', // Smart Investors Guide
  'art-12223': 'wealth-investing', // The Profitable Investor
  'art-12152': 'wealth-investing', // How to Be Rich: Ultimate Financial Freedom
  'art-12143': 'wealth-investing', // The Ultimate Guide to Financial Freedom
  'art-12061': 'wealth-investing', // Money is Like Water

  // 4. Mindset & Psychology (15 articles)
  'art-16733': 'mindset-psychology', // Limitless Money
  'art-16652': 'mindset-psychology', // How Powerful Mindsets Drive Success
  'art-16525': 'mindset-psychology', // Powerful Laws for Understanding People
  'art-16248': 'mindset-psychology', // Iran News / Regional analysis
  'art-16174': 'mindset-psychology', // The Power of Decision-Making
  'art-12592': 'mindset-psychology', // A Treasured Principle
  'art-12540': 'mindset-psychology', // The Ultimate Blueprint to Dominate Life
  'art-12329': 'mindset-psychology', // The Powerful Path to Money & Life Satisfaction
  'art-12260': 'mindset-psychology', // How to Be Rich: Timeless Lessons
  'art-12251': 'mindset-psychology', // Understanding the Hidden Forces Behind Decisions
  'art-12213': 'mindset-psychology', // Mindset Blueprint for Wealth & Influence
  'art-12089': 'mindset-psychology', // Secret of Billionaire Mindset
  'art-12106': 'mindset-psychology', // Ultimate Guide to Thinking & Success
  'art-12050': 'mindset-psychology', // Islamabad Peace Talks
  'art-12038': 'mindset-psychology', // Iran Fights Stronger Enemies
  'art-12034': 'mindset-psychology', // How Iran Stands Strong
  'art-12021': 'mindset-psychology', // How to Stay Fit and Well

  // 5. Career & Skills (4 articles)
  'art-16297': 'career-skills', // Why Skills Trump Passion
  'art-12450': 'career-skills', // Financial education is one of the most important skills
  'art-12301': 'career-skills', // Middle Class to Millionaire: A Practical Roadmap
};

let updatedCount = 0;
const newArticles = articles.map(art => {
  const newCat = categoryMap[art.id] || 'wealth-investing';
  updatedCount++;
  return {
    ...art,
    category: newCat,
    status: art.status || 'published',
  };
});

fs.writeFileSync(articlesPath, JSON.stringify(newArticles, null, 2), 'utf8');
console.log(`Updated ${updatedCount} articles in ${articlesPath}`);

// Count distribution
const counts = {};
newArticles.forEach(a => {
  counts[a.category] = (counts[a.category] || 0) + 1;
});
console.log('New Category Counts:', counts);

// Update siteData.json categories
const newCategories = [
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

if (fs.existsSync(siteDataJsonPath)) {
  const siteDataJson = JSON.parse(fs.readFileSync(siteDataJsonPath, 'utf8'));
  siteDataJson.categories = newCategories;
  fs.writeFileSync(siteDataJsonPath, JSON.stringify(siteDataJson, null, 2), 'utf8');
  console.log(`Updated categories in ${siteDataJsonPath}`);
}

// Update siteData.ts
const siteDataTsContent = `import { Article, Category, Quote, ArticleAuthor } from '../types';
import rawArticles from './articles.json';

export const author: ArticleAuthor = {
  name: "Gulfraz Khan",
  role: "Writer & Founder",
  avatar: "/assets/gulfraz-avatar-MBgtF9on.jpg",
  bio: "Reader, writer, and researcher. I study personal finance, psychology, and the habits behind true independence, turning the best books into practical essays for everyday life.",
  twitter: "https://twitter.com",
  linkedin: "https://linkedin.com"
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
`;

fs.writeFileSync(siteDataTsPath, siteDataTsContent, 'utf8');
console.log(`Updated ${siteDataTsPath}`);
