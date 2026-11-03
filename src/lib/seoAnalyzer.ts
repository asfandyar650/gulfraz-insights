import { Article, SeoAnalysisResult, SeoBreakdown, SeoGrade } from '../types';
import { normalizeCategory } from './categories';

// Common stop words to exclude when analyzing keywords
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
  'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in',
  'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
  'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
  'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
  'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
  'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself',
  'yourselves'
]);

// Search intent triggers (educational, actionable, analytical terms)
const INTENT_TERMS = [
  'how', 'guide', 'lesson', 'lessons', 'framework', 'frameworks', 'rules', 'rule', 'strategy',
  'strategies', 'principles', 'principle', 'summary', 'breakdown', 'insights', 'secret', 'secrets',
  'step', 'steps', 'habits', 'habit', 'mindset', 'psychology', 'system', 'wealth', 'investing',
  'analysis', 'mastery', 'roadmap', 'blueprint', 'actionable'
];

interface ExtractedContent {
  fullText: string;
  words: string[];
  wordCount: number;
  headings: string[];
  h2Count: number;
  h3Count: number;
  paragraphs: string[];
  paragraphCount: number;
  quotesCount: number;
  listCount: number;
  imageCount: number;
  imagesWithAltCount: number;
  internalLinkCount: number;
}

/**
 * Extracts and normalizes text, headings, images, and links from an article.
 * Supports both modern block-based editor and legacy section-based structure.
 */
function extractArticleContent(article: Article): ExtractedContent {
  const headings: string[] = [];
  let h2Count = 0;
  let h3Count = 0;
  const paragraphs: string[] = [];
  let quotesCount = 0;
  let listCount = 0;
  let imageCount = 0;
  let imagesWithAltCount = 0;
  let internalLinkCount = 0;

  // Track cover image
  if (article.coverImage) {
    imageCount++;
    // Cover image has title as implicit alt
    imagesWithAltCount++;
  }

  // Extract from ContentBlocks (new system)
  if (article.contentBlocks && article.contentBlocks.length > 0) {
    for (const block of article.contentBlocks) {
      if (block.type === 'heading') {
        const text = block.text?.trim() || '';
        if (text) {
          headings.push(text);
          if (block.level === 3) h3Count++;
          else h2Count++;
        }
      } else if (block.type === 'subheading') {
        const text = block.text?.trim() || '';
        if (text) {
          headings.push(text);
          h3Count++;
        }
      } else if (block.type === 'paragraph') {
        const text = block.text?.trim() || '';
        if (text) {
          paragraphs.push(text);
        }
      } else if (block.type === 'quote') {
        quotesCount++;
        if (block.quoteText) paragraphs.push(block.quoteText);
      } else if (block.type === 'bullet-list' || block.type === 'numbered-list') {
        listCount++;
        if (block.items) {
          paragraphs.push(block.items.join(' '));
        }
      } else if (block.type === 'image') {
        imageCount++;
        if (block.alt && block.alt.trim().length > 3) {
          imagesWithAltCount++;
        }
      }
    }
  }

  // Fallback to sections (legacy system)
  if (paragraphs.length === 0 && article.sections && article.sections.length > 0) {
    for (const sec of article.sections) {
      if (sec.title) {
        headings.push(sec.title);
        h2Count++;
      }
      if (Array.isArray(sec.content)) {
        sec.content.forEach((p) => {
          if (p && p.trim()) paragraphs.push(p.trim());
        });
      } else if (typeof sec.content === 'string' && sec.content.trim()) {
        paragraphs.push(sec.content.trim());
      }
      if (sec.quote?.text) {
        quotesCount++;
        paragraphs.push(sec.quote.text);
      }
      if (sec.image) {
        imageCount++;
        imagesWithAltCount++;
      }
    }
  }

  // Combine full text
  const textParts = [
    article.title || '',
    article.subtitle || '',
    article.excerpt || '',
    ...(article.keyTakeaways || []),
    ...headings,
    ...paragraphs,
  ];
  const fullText = textParts.join(' ');

  // Detect internal links in text or HTML
  const internalLinkRegex = /(?:\/articles\/|\/category\/|\/calculator|\/support|href=["']\/)/gi;
  const linkMatches = fullText.match(internalLinkRegex) || [];
  internalLinkCount = linkMatches.length;

  // Words breakdown
  const words = fullText
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);

  return {
    fullText,
    words,
    wordCount: words.length,
    headings,
    h2Count,
    h3Count,
    paragraphs,
    paragraphCount: paragraphs.length,
    quotesCount,
    listCount,
    imageCount,
    imagesWithAltCount,
    internalLinkCount,
  };
}

/**
 * Identify primary target keyword from article tags or title.
 */
function extractTargetKeyword(article: Article): string {
  if (article.tags && article.tags.length > 0) {
    const validTag = article.tags.find((t) => t.trim().length > 2);
    if (validTag) return validTag.toLowerCase().trim();
  }
  // Extract key topic from title
  const titleWords = (article.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  return titleWords.slice(0, 2).join(' ') || 'insight';
}

/**
 * Intelligent SEO Analyzer evaluating an Article against 9 weighted factors:
 * 1. Content Quality and usefulness (25)
 * 2. Keyword relevance (15)
 * 3. Title and meta description (15)
 * 4. Heading structure (10)
 * 5. Readability (10)
 * 6. Originality (10)
 * 7. Image optimization (5)
 * 8. Internal linking (5)
 * 9. Search intent (5)
 * Total: 100
 */
export function analyzeArticleSeo(article: Article): SeoAnalysisResult {
  const content = extractArticleContent(article);
  const targetKeyword = extractTargetKeyword(article);
  const issues: string[] = [];
  const suggestions: string[] = [];

  // ----------------------------------------------------
  // 1. Content Quality and Usefulness (Weight: 25)
  // Balanced: Word count depth (13 pts) + Key Takeaways (7 pts) + Structural depth (5 pts)
  // ----------------------------------------------------
  let contentQualityScore = 0;
  // Word count evaluation (avoids rewarding unnecessary fluff)
  if (content.wordCount >= 1000) {
    contentQualityScore += 13;
  } else if (content.wordCount >= 700) {
    contentQualityScore += 11;
  } else if (content.wordCount >= 450) {
    contentQualityScore += 8;
    suggestions.push('Expanding content to 700+ words will provide deeper coverage of this topic.');
  } else if (content.wordCount >= 250) {
    contentQualityScore += 5;
    issues.push('Short article (under 450 words). Add more analytical context and practical lessons.');
  } else {
    contentQualityScore += 2;
    issues.push('Extremely short content. Substantive articles rank significantly higher.');
  }

  // Key Takeaways check (7 pts)
  const takeawaysCount = article.keyTakeaways?.filter((t) => t.trim().length > 0).length || 0;
  if (takeawaysCount >= 3) {
    contentQualityScore += 7;
  } else if (takeawaysCount >= 1) {
    contentQualityScore += 4;
    suggestions.push('Provide at least 3 clear key takeaways for maximum reader retention.');
  } else {
    contentQualityScore += 1;
    issues.push('Missing key takeaways. Add 3+ actionable summary points.');
  }

  // Structural depth / Sections richness (5 pts)
  const totalSubstantiveBlocks = content.paragraphCount + content.h2Count + content.quotesCount;
  if (totalSubstantiveBlocks >= 6) {
    contentQualityScore += 5;
  } else if (totalSubstantiveBlocks >= 3) {
    contentQualityScore += 3;
  } else {
    contentQualityScore += 1;
    issues.push('Article lacks multi-section depth.');
  }

  // ----------------------------------------------------
  // 2. Keyword Relevance & Natural Placement (Weight: 15)
  // Keyword in Title (4), Intro (4), Subheadings (3), Density (4)
  // ----------------------------------------------------
  let keywordScore = 0;
  const kwLower = targetKeyword.toLowerCase();
  const kwTokens = kwLower.split(/\s+/).filter(Boolean);

  // In Title (4 pts)
  const titleLower = (article.title || '').toLowerCase();
  const kwInTitle = kwTokens.some((t) => titleLower.includes(t));
  if (kwInTitle) {
    keywordScore += 4;
  } else {
    suggestions.push(`Include target topic keyword ("${targetKeyword}") in the article title.`);
  }

  // In first 100 words / intro (4 pts)
  const introWords = content.words.slice(0, 120).join(' ');
  const kwInIntro = kwTokens.some((t) => introWords.includes(t));
  if (kwInIntro) {
    keywordScore += 4;
  } else {
    suggestions.push(`Mention your primary keyword ("${targetKeyword}") naturally in the first 100 words.`);
  }

  // In at least one heading (3 pts)
  const kwInHeadings = content.headings.some((h) =>
    kwTokens.some((t) => h.toLowerCase().includes(t))
  );
  if (kwInHeadings) {
    keywordScore += 3;
  } else if (content.headings.length > 0) {
    suggestions.push(`Include target topic "${targetKeyword}" in at least one H2 or H3 heading.`);
  }

  // Natural Keyword Density & Avoid Keyword Stuffing (4 pts)
  let kwMatches = 0;
  for (const token of kwTokens) {
    const tokenRegex = new RegExp(`\\b${token}\\b`, 'gi');
    const matches = content.fullText.match(tokenRegex);
    if (matches) kwMatches += matches.length;
  }
  const densityPercent = content.wordCount > 0 ? (kwMatches / content.wordCount) * 100 : 0;

  if (densityPercent > 3.5) {
    // Penalty for keyword stuffing
    keywordScore += 1;
    issues.push(`Keyword density is ${densityPercent.toFixed(1)}%, which risks search engine keyword stuffing penalties.`);
  } else if (densityPercent >= 0.8 && densityPercent <= 2.8) {
    keywordScore += 4; // Ideal natural density
  } else if (densityPercent > 0.3) {
    keywordScore += 3;
  } else {
    keywordScore += 2;
    suggestions.push(`Primary keyword frequency is low (${densityPercent.toFixed(1)}%). Weave it into body copy naturally.`);
  }

  // ----------------------------------------------------
  // 3. Title and Meta Description (Weight: 15)
  // Title (8 pts) + Meta Description (7 pts)
  // ----------------------------------------------------
  let titleMetaScore = 0;
  const titleLen = (article.seoTitle || article.title || '').trim().length;
  if (titleLen >= 40 && titleLen <= 65) {
    titleMetaScore += 8; // Optimal Google SERP snippet
  } else if ((titleLen >= 30 && titleLen < 40) || (titleLen > 65 && titleLen <= 75)) {
    titleMetaScore += 6;
    suggestions.push(`Title length (${titleLen} chars) is acceptable, but 40–65 chars is optimal.`);
  } else if (titleLen >= 20 && titleLen <= 90) {
    titleMetaScore += 4;
    issues.push(`Title length is ${titleLen} characters. Aim for 40–65 characters.`);
  } else {
    titleMetaScore += 2;
    issues.push(`Title is ${titleLen < 20 ? 'too short' : 'excessively long'} (${titleLen} characters).`);
  }

  const metaText = (article.seoDescription || article.subtitle || article.excerpt || '').trim();
  const metaLen = metaText.length;
  if (metaLen >= 120 && metaLen <= 160) {
    titleMetaScore += 7; // Optimal meta description snippet
  } else if ((metaLen >= 90 && metaLen < 120) || (metaLen > 160 && metaLen <= 180)) {
    titleMetaScore += 5;
    suggestions.push(`Meta description is ${metaLen} chars. Optimal length is 120–160 chars.`);
  } else if (metaLen >= 50 && metaLen <= 220) {
    titleMetaScore += 3;
    issues.push(`Meta description is ${metaLen < 90 ? 'too short' : 'too long'} (${metaLen} chars).`);
  } else {
    titleMetaScore += 1;
    issues.push('Missing or low-quality meta description. Search engines need 120–160 descriptive characters.');
  }

  // ----------------------------------------------------
  // 4. Heading Structure (Weight: 10)
  // H2 presence (5 pts) + Hierarchy/Distribution (5 pts)
  // ----------------------------------------------------
  let headingScore = 0;
  if (content.h2Count >= 3) {
    headingScore += 5;
  } else if (content.h2Count >= 1) {
    headingScore += 3;
    suggestions.push('Add 2–3 H2 subheadings to clearly segment key sections.');
  } else {
    headingScore += 1;
    issues.push('No H2 subheadings found. Structured headings are critical for reader scanning and SEO.');
  }

  // Headings distribution (avoids massive uninterrupted walls of text)
  const averageWordsPerSection = content.headings.length > 0
    ? content.wordCount / (content.headings.length + 1)
    : content.wordCount;

  if (content.headings.length >= 2 && averageWordsPerSection <= 350) {
    headingScore += 5;
  } else if (content.headings.length >= 1 && averageWordsPerSection <= 500) {
    headingScore += 3;
  } else {
    headingScore += 2;
    if (content.wordCount > 400 && content.headings.length < 2) {
      issues.push('Long text blocks without subheadings. Break into logical H2/H3 sections.');
    }
  }

  // ----------------------------------------------------
  // 5. Readability & Paragraph Structure (Weight: 10)
  // Paragraph length (4 pts) + Variety (4 pts) + Sentence Flow (2 pts)
  // ----------------------------------------------------
  let readabilityScore = 0;
  const avgParagraphWords = content.paragraphCount > 0
    ? content.wordCount / content.paragraphCount
    : content.wordCount;

  if (avgParagraphWords <= 85) {
    readabilityScore += 4; // Fast, punchy mobile reading experience
  } else if (avgParagraphWords <= 130) {
    readabilityScore += 3;
  } else {
    readabilityScore += 1;
    issues.push(`Average paragraph length is ${Math.round(avgParagraphWords)} words. Shorter paragraphs (<80 words) boost readability.`);
  }

  // Formatting variety (quotes, bullet lists, callouts)
  if (content.quotesCount > 0 && content.listCount > 0) {
    readabilityScore += 4;
  } else if (content.quotesCount > 0 || content.listCount > 0) {
    readabilityScore += 3;
    suggestions.push('Add both quotes and bullet lists to enrich typographic variety.');
  } else {
    readabilityScore += 1;
    suggestions.push('Insert a memorable quote or bulleted key takeaways to break visual monotony.');
  }

  // Sentence flow heuristic (average words per sentence)
  const sentences = content.fullText.split(/[.!?]+\s+/).filter((s) => s.trim().length > 5);
  const avgWordsPerSentence = sentences.length > 0 ? content.wordCount / sentences.length : 15;
  if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 22) {
    readabilityScore += 2;
  } else {
    readabilityScore += 1;
  }

  // ----------------------------------------------------
  // 6. Originality & Analytical Tone (Weight: 10)
  // Lexical Diversity / Type-Token Ratio (5 pts) + Clean composition (5 pts)
  // ----------------------------------------------------
  let originalityScore = 0;
  const uniqueWords = new Set(content.words.filter((w) => !STOP_WORDS.has(w)));
  const lexicalRatio = content.words.length > 0 ? uniqueWords.size / content.words.length : 0;

  if (lexicalRatio >= 0.40) {
    originalityScore += 5; // Rich, diverse vocabulary
  } else if (lexicalRatio >= 0.28) {
    originalityScore += 4;
  } else {
    originalityScore += 2;
    suggestions.push('Improve vocabulary diversity; reduce repetitive sentence constructions.');
  }

  // Non-generic content check (5 pts)
  const genericClichés = ['in today\'s fast-paced world', 'at the end of the day', 'think outside the box'];
  const hasCliché = genericClichés.some((c) => content.fullText.toLowerCase().includes(c));
  if (!hasCliché) {
    originalityScore += 5;
  } else {
    originalityScore += 3;
    suggestions.push('Replace generic corporate clichés with sharp, distinctive prose.');
  }

  // ----------------------------------------------------
  // 7. Image Optimization and ALT Text (Weight: 5)
  // Cover & inline images (2 pts) + Alt text & captions (3 pts)
  // ----------------------------------------------------
  let imageScore = 0;
  if (content.imageCount >= 1) {
    imageScore += 2;
    if (content.imagesWithAltCount >= content.imageCount) {
      imageScore += 3;
    } else if (content.imagesWithAltCount > 0) {
      imageScore += 2;
      suggestions.push('Ensure every inline image has descriptive ALT text for image search indexing.');
    } else {
      imageScore += 1;
      issues.push('Images are missing ALT text descriptions.');
    }
  } else {
    imageScore += 1;
    suggestions.push('Add a high-quality featured cover image and relevant diagrams or photos.');
  }

  // ----------------------------------------------------
  // 8. Internal Linking (Weight: 5)
  // Linking to related articles, categories, or calculator (5 pts)
  // ----------------------------------------------------
  let internalLinkScore = 0;
  if (content.internalLinkCount >= 2) {
    internalLinkScore += 5;
  } else if (content.internalLinkCount === 1) {
    internalLinkScore += 3;
    suggestions.push('Add 1 more internal link to a related article or the Freedom Calculator.');
  } else {
    internalLinkScore += 1;
    suggestions.push('Add internal links to related essays (/articles/...) or category pages to build topical authority.');
  }

  // ----------------------------------------------------
  // 9. Search Intent Matching (Weight: 5)
  // Intent keywords in title/content (3 pts) + Category alignment (2 pts)
  // ----------------------------------------------------
  let searchIntentScore = 0;
  const hasIntentTerm = INTENT_TERMS.some((term) =>
    titleLower.includes(term) || (article.subtitle || '').toLowerCase().includes(term)
  );
  if (hasIntentTerm) {
    searchIntentScore += 3;
  } else {
    searchIntentScore += 1;
    suggestions.push('Frame title or subtitle with high-intent query words (e.g. "Framework", "Lessons", "Strategy", "Rules").');
  }

  // Valid category check
  const cat = normalizeCategory(article.category);
  if (['book-notes', 'wealth-investing', 'make-money-online', 'mindset-psychology', 'career-skills'].includes(cat)) {
    searchIntentScore += 2;
  } else {
    searchIntentScore += 1;
  }

  // ----------------------------------------------------
  // Calculate Total Score (0 - 100)
  // ----------------------------------------------------
  const totalScore = Math.min(
    100,
    Math.max(
      0,
      contentQualityScore +
      keywordScore +
      titleMetaScore +
      headingScore +
      readabilityScore +
      originalityScore +
      imageScore +
      internalLinkScore +
      searchIntentScore
    )
  );

  // Determine Grade
  let grade: SeoGrade = 'poor';
  if (totalScore >= 90) grade = 'excellent';
  else if (totalScore >= 75) grade = 'good';
  else if (totalScore >= 50) grade = 'needs-improvement';
  else grade = 'poor';

  const breakdown: SeoBreakdown = {
    contentQuality: {
      score: contentQualityScore,
      maxScore: 25,
      label: 'Content quality and usefulness',
      notes: `${content.wordCount} words, ${takeawaysCount} takeaways, ${content.paragraphCount} paragraphs`,
    },
    keywordRelevance: {
      score: keywordScore,
      maxScore: 15,
      label: 'Keyword relevance',
      notes: `Target: "${targetKeyword}" (${densityPercent.toFixed(1)}% density)`,
    },
    titleMeta: {
      score: titleMetaScore,
      maxScore: 15,
      label: 'Title and meta description',
      notes: `Title: ${titleLen} chars, Meta: ${metaLen} chars`,
    },
    headingStructure: {
      score: headingScore,
      maxScore: 10,
      label: 'Heading structure',
      notes: `${content.h2Count} H2s, ${content.h3Count} H3s`,
    },
    readability: {
      score: readabilityScore,
      maxScore: 10,
      label: 'Readability',
      notes: `~${Math.round(avgParagraphWords)} words/paragraph, ${content.quotesCount} quotes, ${content.listCount} lists`,
    },
    originality: {
      score: originalityScore,
      maxScore: 10,
      label: 'Originality',
      notes: `${Math.round(lexicalRatio * 100)}% lexical diversity`,
    },
    imageOptimization: {
      score: imageScore,
      maxScore: 5,
      label: 'Image optimization',
      notes: `${content.imageCount} images (${content.imagesWithAltCount} with ALT text)`,
    },
    internalLinking: {
      score: internalLinkScore,
      maxScore: 5,
      label: 'Internal linking',
      notes: `${content.internalLinkCount} internal links identified`,
    },
    searchIntent: {
      score: searchIntentScore,
      maxScore: 5,
      label: 'Search intent',
      notes: `Category: ${cat}, intent matched: ${hasIntentTerm ? 'Yes' : 'Partial'}`,
    },
  };

  return {
    score: totalScore,
    grade,
    breakdown,
    issues: issues.slice(0, 5),
    suggestions: suggestions.slice(0, 5),
    analyzedAt: new Date().toISOString(),
    targetKeyword,
    wordCount: content.wordCount,
    headingCount: content.headings.length,
    imageCount: content.imageCount,
    internalLinkCount: content.internalLinkCount,
  };
}

/**
 * Sorts articles according to the intelligent SEO ranking system:
 * 1. Admin pinned / manually featured articles always appear first.
 * 2. Highest SEO score (1st position, 2nd, 3rd, etc.).
 * 3. Tie-breaker: Newer publication date.
 * Unpublished drafts (status === 'draft') are NEVER included in public ranking.
 */
export function sortArticlesBySeoRank(articles: Article[], includeDrafts = false): Article[] {
  const filtered = includeDrafts
    ? [...articles]
    : articles.filter((a) => a.status !== 'draft');

  return filtered.sort((a, b) => {
    // 1. Admin Pinned / Override takes top priority
    const aPinned = a.pinned ? 1 : 0;
    const bPinned = b.pinned ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;

    // 2. SEO Score descending
    const aScore = typeof a.seoScore === 'number' ? a.seoScore : 0;
    const bScore = typeof b.seoScore === 'number' ? b.seoScore : 0;
    if (bScore !== aScore) return bScore - aScore;

    // 3. Secondary tie-breaker: publication date
    const aDate = new Date(a.publishedAt).getTime() || 0;
    const bDate = new Date(b.publishedAt).getTime() || 0;
    return bDate - aDate;
  });
}

/**
 * Visual styling metadata for SEO scores and grades.
 */
export function getSeoGradeBadge(grade: SeoGrade): {
  label: string;
  badgeClass: string;
  dotClass: string;
} {
  switch (grade) {
    case 'excellent':
      return {
        label: 'Excellent',
        badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
        dotClass: 'bg-emerald-500',
      };
    case 'good':
      return {
        label: 'Good',
        badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
        dotClass: 'bg-blue-500',
      };
    case 'needs-improvement':
      return {
        label: 'Needs Improvement',
        badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
        dotClass: 'bg-amber-500',
      };
    case 'poor':
    default:
      return {
        label: 'Poor',
        badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
        dotClass: 'bg-rose-500',
      };
  }
}

/**
 * Returns text color for numeric SEO score display.
 */
export function getSeoScoreColor(score: number): string {
  if (score >= 90) return 'text-emerald-500';
  if (score >= 75) return 'text-blue-500';
  if (score >= 50) return 'text-amber-500';
  return 'text-rose-500';
}

/**
 * Returns background progress bar color.
 */
export function getSeoBarColor(score: number): string {
  if (score >= 90) return 'bg-emerald-500';
  if (score >= 75) return 'bg-blue-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
}
