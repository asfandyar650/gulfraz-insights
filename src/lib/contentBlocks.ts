import { Article, ArticleSection, ContentBlock, ContentBlockType } from '../types';

export function generateBlockId(): string {
  return 'blk-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8);
}

export function createEmptyBlock(type: ContentBlockType): ContentBlock {
  const id = generateBlockId();
  switch (type) {
    case 'paragraph':
      return { id, type, text: '' };
    case 'heading':
      return { id, type, text: '', level: 2 };
    case 'subheading':
      return { id, type, text: '' };
    case 'image':
      return {
        id,
        type,
        url: '',
        caption: '',
        alt: '',
        alignment: 'center',
        size: 'large',
      };
    case 'quote':
      return {
        id,
        type,
        quoteText: '',
        quoteAuthor: '',
        quoteSource: '',
      };
    case 'bullet-list':
      return { id, type, items: [''] };
    case 'numbered-list':
      return { id, type, items: [''] };
    case 'divider':
      return { id, type };
    default:
      return { id, type: 'paragraph', text: '' };
  }
}

/**
 * Ensures an article always has a rich list of ContentBlock[] items.
 * If contentBlocks is already present and non-empty, returns it.
 * Otherwise, cleanly converts legacy ArticleSection[] into ContentBlock[].
 */
export function ensureContentBlocks(article: Partial<Article>): ContentBlock[] {
  if (article.contentBlocks && article.contentBlocks.length > 0) {
    return article.contentBlocks;
  }

  const blocks: ContentBlock[] = [];
  const sections = article.sections || [];

  sections.forEach((section, sIdx) => {
    if (section.title) {
      blocks.push({
        id: `blk-sec-title-${sIdx}`,
        type: 'heading',
        text: section.title,
        level: 2,
      });
    }

    if (section.image) {
      blocks.push({
        id: `blk-sec-img-${sIdx}`,
        type: 'image',
        url: section.image,
        caption: '',
        alt: section.title || 'Article illustration',
        alignment: 'center',
        size: 'large',
      });
    }

    if (section.quote && (section.quote.text || typeof section.quote === 'string')) {
      const qText = typeof section.quote === 'string' ? section.quote : section.quote.text;
      const qAuth = typeof section.quote === 'object' ? section.quote.author : undefined;
      blocks.push({
        id: `blk-sec-quote-${sIdx}`,
        type: 'quote',
        quoteText: qText,
        quoteAuthor: qAuth,
      });
    }

    if (section.content) {
      const paragraphs = Array.isArray(section.content)
        ? section.content
        : [section.content];

      paragraphs.forEach((p, pIdx) => {
        if (p && p.trim()) {
          blocks.push({
            id: `blk-sec-${sIdx}-p-${pIdx}`,
            type: 'paragraph',
            text: p,
          });
        }
      });
    }
  });

  if (blocks.length === 0 && article.excerpt) {
    blocks.push({
      id: 'blk-init-p',
      type: 'paragraph',
      text: article.excerpt,
    });
  }

  return blocks;
}

/**
 * Converts ContentBlock[] back to ArticleSection[] to preserve legacy compatibility.
 */
export function contentBlocksToSections(blocks: ContentBlock[]): ArticleSection[] {
  const sections: ArticleSection[] = [];
  let currentSection: ArticleSection = {
    content: [],
  };

  blocks.forEach((block) => {
    if (block.type === 'heading') {
      if ((currentSection.content as string[]).length > 0 || currentSection.title) {
        sections.push(currentSection);
      }
      currentSection = {
        title: block.text || '',
        content: [],
      };
    } else if (block.type === 'paragraph' && block.text) {
      (currentSection.content as string[]).push(block.text);
    } else if (block.type === 'subheading' && block.text) {
      (currentSection.content as string[]).push(block.text);
    } else if (block.type === 'image' && block.url) {
      if (!currentSection.image) {
        currentSection.image = block.url;
      } else {
        (currentSection.content as string[]).push(`[Image: ${block.caption || block.alt || block.url}]`);
      }
    } else if (block.type === 'quote' && block.quoteText) {
      if (!currentSection.quote) {
        currentSection.quote = {
          text: block.quoteText,
          author: block.quoteAuthor,
        };
      } else {
        (currentSection.content as string[]).push(`"${block.quoteText}" — ${block.quoteAuthor || 'Anonymous'}`);
      }
    } else if (block.type === 'bullet-list' && block.items) {
      block.items.forEach((item) => {
        if (item.trim()) (currentSection.content as string[]).push(`• ${item}`);
      });
    } else if (block.type === 'numbered-list' && block.items) {
      block.items.forEach((item, i) => {
        if (item.trim()) (currentSection.content as string[]).push(`${i + 1}. ${item}`);
      });
    }
  });

  if ((currentSection.content as string[]).length > 0 || currentSection.title) {
    sections.push(currentSection);
  }

  return sections.length > 0 ? sections : [{ content: [''] }];
}
