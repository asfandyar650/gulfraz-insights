import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { setCustomMongoUri, getMongoUri } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const uri: string = body.uri ? body.uri.trim() : (getMongoUri() || '');

    if (!uri) {
      return NextResponse.json({
        success: false,
        error: 'Please enter a MongoDB Atlas connection string (e.g. mongodb+srv://admin:...@cluster0.mongodb.net/...)',
      });
    }

    if (uri.includes('<password>')) {
      return NextResponse.json({
        success: false,
        error: 'Please replace <password> in your connection string with your actual database user password.',
      });
    }

    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 8000,
    });

    await client.connect();
    const db = client.db('gulfraz_insights');
    await db.command({ ping: 1 });
    const count = await db.collection('articles').countDocuments();
    await client.close();

    // Cache URI for current runtime
    setCustomMongoUri(uri);

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to MongoDB Atlas!',
      database: 'gulfraz_insights',
      collection: 'articles',
      count,
    });
  } catch (err: any) {
    let msg = err?.message || 'Connection failed';
    if (msg.includes('bad auth') || msg.includes('Authentication failed')) {
      msg = 'Authentication failed. Please verify your MongoDB database username and password.';
    } else if (msg.includes('tlsv1 alert') || msg.includes('SSL routines') || msg.includes('ETIMEDOUT') || msg.includes('timed out')) {
      msg = 'MongoDB Atlas blocked the connection. Go to MongoDB Atlas -> Security -> Network Access -> Add IP Address -> choose "Allow Access from Anywhere (0.0.0.0/0)" so Vercel can connect.';
    }
    return NextResponse.json({ success: false, error: msg });
  }
}
