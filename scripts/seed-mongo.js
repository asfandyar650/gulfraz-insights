const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = 'mongodb+srv://abaseerkhan9_db_user:ynPsDjBcCwHyZgLs@cluster0.d7r2bt3.mongodb.net/gulfraz_insights?retryWrites=true&w=majority';

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 12000,
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas successfully!');

    const db = client.db('gulfraz_insights');
    const collection = db.collection('articles');

    const articlesPath = path.join(__dirname, '..', 'src', 'data', 'articles.json');
    const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

    console.log(`Loaded ${articles.length} articles from articles.json`);

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

    const result = await collection.bulkWrite(operations, { ordered: false });
    console.log(`Sync complete! Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}, Matched: ${result.matchedCount}`);

    const count = await collection.countDocuments();
    console.log(`Total documents currently in 'gulfraz_insights.articles': ${count}`);

    // Create useful indexes
    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ id: 1 });
    await collection.createIndex({ category: 1 });
    console.log('Indexes created on slug, id, category!');

    console.log('SUCCESS');
  } catch (err) {
    console.error('Error seeding MongoDB:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
