import { NextRequest, NextResponse } from 'next/server';
import {
  getAllArticlesFromMongo,
  upsertArticleInMongo,
  deleteArticleFromMongo,
  getMongoUri,
} from '@/lib/mongodb';
import { Article } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const uri = getMongoUri();
  if (!uri) {
    return NextResponse.json({
      configured: false,
      message: 'MongoDB Atlas URI is not configured on the server.',
      articles: [],
    });
  }

  try {
    const articles = await getAllArticlesFromMongo();
    return NextResponse.json({
      configured: true,
      count: articles.length,
      articles,
    });
  } catch (err: any) {
    return NextResponse.json(
      { configured: true, error: err?.message || 'Failed to fetch articles from MongoDB' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const article: Article = body.article;
    if (!article || !article.id || !article.title) {
      return NextResponse.json({ error: 'Invalid article payload' }, { status: 400 });
    }

    const success = await upsertArticleInMongo(article);
    if (success) {
      return NextResponse.json({ success: true, article });
    } else {
      return NextResponse.json({ error: 'Failed to write article to MongoDB Atlas' }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    const success = await deleteArticleFromMongo(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
