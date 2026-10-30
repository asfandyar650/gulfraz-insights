import { MongoClient, Db, Collection } from 'mongodb';
import { Article } from '../types';

const DB_NAME = 'gulfraz_insights';
const COLLECTION_NAME = 'articles';

// In-memory or global cache for MongoDB client across hot reloads & serverless invocations
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _customMongoUri: string | undefined;
}

const DEFAULT_MONGO_URI = 'mongodb+srv://abaseerkhan9_db_user:ynPsDjBcCwHyZgLs@cluster0.d7r2bt3.mongodb.net/gulfraz_insights?retryWrites=true&w=majority';

export function getMongoUri(): string | null {
  if (global._customMongoUri && !global._customMongoUri.includes('<password>')) {
    return global._customMongoUri;
  }
  if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<password>')) {
    return process.env.MONGODB_URI;
  }
  if (process.env.NEXT_PUBLIC_MONGODB_URI && !process.env.NEXT_PUBLIC_MONGODB_URI.includes('<password>')) {
    return process.env.NEXT_PUBLIC_MONGODB_URI;
  }
  return DEFAULT_MONGO_URI;
}

export function setCustomMongoUri(uri: string) {
  global._customMongoUri = uri;
  global._mongoClientPromise = undefined;
}

export async function getMongoClient(customUri?: string): Promise<MongoClient> {
  const uri = customUri || getMongoUri();
  if (!uri) {
    throw new Error('MongoDB URI is not configured. Please provide your MongoDB Atlas connection string.');
  }

  if (customUri) {
    const client = new MongoClient(customUri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    });
    return client.connect();
  }

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    });
    global._mongoClientPromise = client.connect();
  }

  return global._mongoClientPromise;
}

export async function getMongoDb(customUri?: string): Promise<Db> {
  const client = await getMongoClient(customUri);
  return client.db(DB_NAME);
}

export async function getArticlesCollection(customUri?: string): Promise<Collection<any>> {
  const db = await getMongoDb(customUri);
  return db.collection(COLLECTION_NAME);
}

// Fetch all articles from MongoDB Atlas
export async function getAllArticlesFromMongo(): Promise<Article[]> {
  try {
    const col = await getArticlesCollection();
    const docs = await col.find({}, { projection: { _id: 0 } }).toArray();
    return docs as unknown as Article[];
  } catch (err) {
    console.warn('MongoDB fetch error:', err);
    return [];
  }
}

// Upsert a single article in MongoDB Atlas
export async function upsertArticleInMongo(article: Article): Promise<boolean> {
  try {
    const col = await getArticlesCollection();
    await col.updateOne(
      { id: article.id },
      {
        $set: {
          ...article,
          updatedAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );
    return true;
  } catch (err) {
    console.error('MongoDB upsert error:', err);
    return false;
  }
}

// Delete an article from MongoDB Atlas
export async function deleteArticleFromMongo(articleId: string): Promise<boolean> {
  try {
    const col = await getArticlesCollection();
    const res = await col.deleteOne({ id: articleId });
    return res.acknowledged;
  } catch (err) {
    console.error('MongoDB delete error:', err);
    return false;
  }
}

// Batch sync all articles into MongoDB Atlas
export async function batchSyncArticlesToMongo(articles: Article[]): Promise<{ success: boolean; count: number }> {
  try {
    const col = await getArticlesCollection();
    if (!articles || articles.length === 0) return { success: false, count: 0 };

    const operations = articles.map((article) => ({
      updateOne: {
        filter: { id: article.id },
        update: {
          $set: {
            ...article,
            updatedAt: new Date().toISOString(),
          },
        },
        upsert: true,
      },
    }));

    const result = await col.bulkWrite(operations, { ordered: false });
    const count = (result.upsertedCount || 0) + (result.modifiedCount || 0) + (result.matchedCount || 0);
    return { success: true, count: count || articles.length };
  } catch (err) {
    console.error('MongoDB batch sync error:', err);
    return { success: false, count: 0 };
  }
}
