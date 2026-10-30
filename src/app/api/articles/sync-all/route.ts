import { NextRequest, NextResponse } from 'next/server';
import { batchSyncArticlesToMongo, getMongoUri } from '@/lib/mongodb';
import { defaultArticles } from '@/data/siteData';
import { Article } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const uri = getMongoUri();
  if (!uri) {
    return NextResponse.json(
      { success: false, error: 'MongoDB Atlas URI is not configured on the server. Please add MONGODB_URI.' },
      { status: 400 }
    );
  }

  try {
    let articles: Article[] = [];
    try {
      const body = await req.json();
      if (body.articles && Array.isArray(body.articles) && body.articles.length > 0) {
        articles = body.articles;
      }
    } catch {}

    if (articles.length === 0) {
      articles = defaultArticles;
    }

    const result = await batchSyncArticlesToMongo(articles);
    return NextResponse.json({
      success: result.success,
      count: result.count,
      totalSent: articles.length,
      database: 'gulfraz_insights',
      collection: 'articles',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to sync articles to MongoDB Atlas' },
      { status: 500 }
    );
  }
}
