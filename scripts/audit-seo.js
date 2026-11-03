const fs = require('fs');
const path = require('path');

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

const INTENT_TERMS = [
  'how', 'guide', 'lesson', 'lessons', 'framework', 'frameworks', 'rules', 'rule', 'strategy',
  'strategies', 'principles', 'principle', 'summary', 'breakdown', 'insights', 'secret', 'secrets',
  'step', 'steps', 'habits', 'habit', 'mindset', 'psychology', 'system', 'wealth', 'investing',
  'analysis', 'mastery', 'roadmap', 'blueprint', 'actionable'
];

function extractArticleContent(article) {
  const headings = [];
  let h2Count = 0;
  let h3Count = 0;
  const paragraphs = [];
  let quotesCount = 0;
  let listCount = 0;
  let imageCount = 0;
  let imagesWithAltCount = 0;

  if (article.coverImage) {
    imageCount++;
    imagesWithAltCount++;
  }

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
        if (text) paragraphs.push(text);
      } else if (block.type === 'quote') {
        quotesCount++;
        if (block.quoteText) paragraphs.push(block.quoteText);
      } else if (block.type === 'bullet-list' || block.type === 'numbered-list') {
        listCount++;
        if (block.items) paragraphs.push(block.items.join(' '));
      } else if (block.type === 'image') {
        imageCount++;
        if (block.alt && block.alt.trim().length > 3) imagesWithAltCount++;
      }
    }
  }

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

  const textParts = [
    article.title || '',
    article.subtitle || '',
    article.excerpt || '',
    ...(article.keyTakeaways || []),
    ...headings,
    ...paragraphs,
  ];
  const fullText = textParts.join(' ');

  const internalLinkRegex = /(?:\/articles\/|\/category\/|\/calculator|\/support|href=["']\/)/gi;
  const linkMatches = fullText.match(internalLinkRegex) || [];
  const internalLinkCount = linkMatches.length;

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

function extractTargetKeyword(article) {
  if (article.tags && article.tags.length > 0) {
    const validTag = article.tags.find((t) => t.trim().length > 2);
    if (validTag) return validTag.toLowerCase().trim();
  }
  const titleWords = (article.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  return titleWords.slice(0, 2).join(' ') || 'insight';
}

function analyzeArticleSeo(article) {
  const content = extractArticleContent(article);
  const targetKeyword = extractTargetKeyword(article);
  const issues = [];
  const suggestions = [];

  // 1. Content Quality and Usefulness (25)
  let contentQualityScore = 0;
  if (content.wordCount >= 1000) contentQualityScore += 13;
  else if (content.wordCount >= 700) contentQualityScore += 11;
  else if (content.wordCount >= 450) {
    contentQualityScore += 8;
    suggestions.push('Expanding content to 700+ words will provide deeper coverage.');
  } else if (content.wordCount >= 250) {
    contentQualityScore += 5;
    issues.push('Short article (under 450 words). Add more analytical context and practical lessons.');
  } else {
    contentQualityScore += 2;
    issues.push('Extremely short content.');
  }

  const takeawaysCount = article.keyTakeaways?.filter((t) => t.trim().length > 0).length || 0;
  if (takeawaysCount >= 3) contentQualityScore += 7;
  else if (takeawaysCount >= 1) {
    contentQualityScore += 4;
    suggestions.push('Provide at least 3 clear key takeaways.');
  } else {
    contentQualityScore += 1;
    issues.push('Missing key takeaways. Add 3+ actionable summary points.');
  }

  const totalSubstantiveBlocks = content.paragraphCount + content.h2Count + content.quotesCount;
  if (totalSubstantiveBlocks >= 6) contentQualityScore += 5;
  else if (totalSubstantiveBlocks >= 3) contentQualityScore += 3;
  else contentQualityScore += 1;

  // 2. Keyword Relevance & Natural Placement (15)
  let keywordScore = 0;
  const kwLower = targetKeyword.toLowerCase();
  const kwTokens = kwLower.split(/\s+/).filter(Boolean);

  const titleLower = (article.title || '').toLowerCase();
  const kwInTitle = kwTokens.some((t) => titleLower.includes(t));
  if (kwInTitle) keywordScore += 4;
  else suggestions.push(`Include target topic keyword ("${targetKeyword}") in the article title.`);

  const introWords = content.words.slice(0, 120).join(' ');
  const kwInIntro = kwTokens.some((t) => introWords.includes(t));
  if (kwInIntro) keywordScore += 4;
  else suggestions.push(`Mention your primary keyword ("${targetKeyword}") naturally in the first 100 words.`);

  const kwInHeadings = content.headings.some((h) =>
    kwTokens.some((t) => h.toLowerCase().includes(t))
  );
  if (kwInHeadings) keywordScore += 3;
  else if (content.headings.length > 0) suggestions.push(`Include target topic "${targetKeyword}" in at least one H2 heading.`);

  let kwMatches = 0;
  for (const token of kwTokens) {
    const tokenRegex = new RegExp(`\\b${token}\\b`, 'gi');
    const matches = content.fullText.match(tokenRegex);
    if (matches) kwMatches += matches.length;
  }
  const densityPercent = content.wordCount > 0 ? (kwMatches / content.wordCount) * 100 : 0;
  if (densityPercent > 3.5) {
    keywordScore += 1;
    issues.push(`Keyword density is ${densityPercent.toFixed(1)}%, which risks keyword stuffing penalties.`);
  } else if (densityPercent >= 0.8 && densityPercent <= 2.8) {
    keywordScore += 4;
  } else if (densityPercent > 0.3) {
    keywordScore += 3;
  } else {
    keywordScore += 2;
    suggestions.push(`Primary keyword frequency is low (${densityPercent.toFixed(1)}%). Weave it into body copy naturally.`);
  }

  // 3. Title and Meta Description (15)
  let titleMetaScore = 0;
  const titleLen = (article.seoTitle || article.title || '').trim().length;
  if (titleLen >= 40 && titleLen <= 65) titleMetaScore += 8;
  else if ((titleLen >= 30 && titleLen < 40) || (titleLen > 65 && titleLen <= 75)) titleMetaScore += 6;
  else if (titleLen >= 20 && titleLen <= 90) titleMetaScore += 4;
  else titleMetaScore += 2;

  const metaText = (article.seoDescription || article.subtitle || article.excerpt || '').trim();
  const metaLen = metaText.length;
  if (metaLen >= 120 && metaLen <= 160) titleMetaScore += 7;
  else if ((metaLen >= 90 && metaLen < 120) || (metaLen > 160 && metaLen <= 180)) titleMetaScore += 5;
  else if (metaLen >= 50 && metaLen <= 220) titleMetaScore += 3;
  else titleMetaScore += 1;

  // 4. Heading Structure (10)
  let headingScore = 0;
  if (content.h2Count >= 3) headingScore += 5;
  else if (content.h2Count >= 1) headingScore += 3;
  else headingScore += 1;

  const averageWordsPerSection = content.headings.length > 0
    ? content.wordCount / (content.headings.length + 1)
    : content.wordCount;
  if (content.headings.length >= 2 && averageWordsPerSection <= 350) headingScore += 5;
  else if (content.headings.length >= 1 && averageWordsPerSection <= 500) headingScore += 3;
  else headingScore += 2;

  // 5. Readability & Paragraph Structure (10)
  let readabilityScore = 0;
  const avgParagraphWords = content.paragraphCount > 0
    ? content.wordCount / content.paragraphCount
    : content.wordCount;
  if (avgParagraphWords <= 85) readabilityScore += 4;
  else if (avgParagraphWords <= 130) readabilityScore += 3;
  else readabilityScore += 1;

  if (content.quotesCount > 0 && content.listCount > 0) readabilityScore += 4;
  else if (content.quotesCount > 0 || content.listCount > 0) readabilityScore += 3;
  else readabilityScore += 1;

  const sentences = content.fullText.split(/[.!?]+\s+/).filter((s) => s.trim().length > 5);
  const avgWordsPerSentence = sentences.length > 0 ? content.wordCount / sentences.length : 15;
  if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 22) readabilityScore += 2;
  else readabilityScore += 1;

  // 6. Originality & Analytical Tone (10)
  let originalityScore = 0;
  const uniqueWords = new Set(content.words.filter((w) => !STOP_WORDS.has(w)));
  const lexicalRatio = content.words.length > 0 ? uniqueWords.size / content.words.length : 0;
  if (lexicalRatio >= 0.40) originalityScore += 5;
  else if (lexicalRatio >= 0.28) originalityScore += 4;
  else originalityScore += 2;

  const genericClichés = ['in today\'s fast-paced world', 'at the end of the day', 'think outside the box'];
  const hasCliché = genericClichés.some((c) => content.fullText.toLowerCase().includes(c));
  if (!hasCliché) originalityScore += 5;
  else originalityScore += 3;

  // 7. Image Optimization and ALT Text (5)
  let imageScore = 0;
  if (content.imageCount >= 1) {
    imageScore += 2;
    if (content.imagesWithAltCount >= content.imageCount) imageScore += 3;
    else if (content.imagesWithAltCount > 0) imageScore += 2;
    else imageScore += 1;
  } else imageScore += 1;

  // 8. Internal Linking (5)
  let internalLinkScore = 0;
  if (content.internalLinkCount >= 2) internalLinkScore += 5;
  else if (content.internalLinkCount === 1) internalLinkScore += 3;
  else internalLinkScore += 1;

  // 9. Search Intent Matching (5)
  let searchIntentScore = 0;
  const hasIntentTerm = INTENT_TERMS.some((term) =>
    titleLower.includes(term) || (article.subtitle || '').toLowerCase().includes(term)
  );
  if (hasIntentTerm) searchIntentScore += 3;
  else searchIntentScore += 1;

  const cat = article.category;
  if (['book-notes', 'wealth-investing', 'make-money-online', 'mindset-psychology', 'career-skills'].includes(cat)) {
    searchIntentScore += 2;
  } else searchIntentScore += 1;

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

  let grade = 'poor';
  if (totalScore >= 90) grade = 'excellent';
  else if (totalScore >= 75) grade = 'good';
  else if (totalScore >= 50) grade = 'needs-improvement';
  else grade = 'poor';

  const breakdown = {
    contentQuality: {
      score: contentQualityScore,
      maxScore: 25,
      label: 'Content quality and usefulness',
      notes: `${content.wordCount} words, ${takeawaysCount} takeaways`,
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
      notes: `~${Math.round(avgParagraphWords)} words/paragraph`,
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
      notes: `${content.imageCount} images`,
    },
    internalLinking: {
      score: internalLinkScore,
      maxScore: 5,
      label: 'Internal linking',
      notes: `${content.internalLinkCount} links`,
    },
    searchIntent: {
      score: searchIntentScore,
      maxScore: 5,
      label: 'Search intent',
      notes: `Category: ${cat}`,
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

async function runAudit() {
  const articlesPath = path.join(__dirname, '..', 'src', 'data', 'articles.json');
  console.log(`Reading articles from ${articlesPath}...`);
  const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

  console.log(`Analyzing SEO quality across all ${articles.length} essays...`);
  const scoredArticles = articles.map((art) => {
    const analysis = analyzeArticleSeo(art);
    return {
      ...art,
      seoScore: analysis.score,
      seoAnalysis: analysis,
      seoIssues: analysis.issues,
      seoSuggestions: analysis.suggestions,
      lastAnalyzedAt: analysis.analyzedAt,
      pinned: art.pinned || false,
    };
  });

  // Sort by ranking order:
  // 1. Pinned
  // 2. SEO score descending
  // 3. Date descending
  const sorted = [...scoredArticles].sort((a, b) => {
    const aPinned = a.pinned ? 1 : 0;
    const bPinned = b.pinned ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;
    if (b.seoScore !== a.seoScore) return b.seoScore - a.seoScore;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  // Write back scored articles to articles.json
  fs.writeFileSync(articlesPath, JSON.stringify(sorted, null, 2), 'utf8');
  console.log(`Successfully updated ${articlesPath} with SEO scores and ordering!`);

  // Print summary
  console.log('\n--- TOP 10 RANKED BLOGS ---');
  sorted.slice(0, 10).forEach((a, idx) => {
    console.log(`#${idx + 1}: [Score: ${a.seoScore}/100 | ${a.seoAnalysis.grade.toUpperCase()}] "${a.title}" (${a.category})`);
  });

  const avg = Math.round(sorted.reduce((acc, curr) => acc + curr.seoScore, 0) / sorted.length);
  const excellent = sorted.filter((a) => a.seoScore >= 90).length;
  const good = sorted.filter((a) => a.seoScore >= 75 && a.seoScore < 90).length;
  const needsImp = sorted.filter((a) => a.seoScore >= 50 && a.seoScore < 75).length;
  const poor = sorted.filter((a) => a.seoScore < 50).length;

  console.log('\n--- OVERALL SEO HEALTH ---');
  console.log(`Average Score: ${avg}/100`);
  console.log(`Excellent (90-100): ${excellent}`);
  console.log(`Good (75-89): ${good}`);
  console.log(`Needs Improvement (50-74): ${needsImp}`);
  console.log(`Poor (<50): ${poor}`);
}

runAudit().catch(console.error);
