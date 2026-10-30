const { initializeApp } = require('firebase/app');
const { getFirestore, doc, writeBatch } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

const firebaseConfig = {
  apiKey: "AIzaSyA9R4nsloyP65CSa01Bx8rIJ-F6xj-Frow",
  authDomain: "gulfraz-insights.firebaseapp.com",
  projectId: "gulfraz-insights",
  storageBucket: "gulfraz-insights.firebasestorage.app",
  messagingSenderId: "149272727698",
  appId: "1:149272727698:web:865fd8fe28e547a04f564b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log('Connecting to Firebase Firestore...');
  const articlesPath = path.join(__dirname, '..', 'src', 'data', 'articles.json');
  const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
  console.log(`Found ${articles.length} articles to upload.`);

  const chunkSize = 40;
  let count = 0;
  for (let i = 0; i < articles.length; i += chunkSize) {
    const chunk = articles.slice(i, i + chunkSize);
    const batch = writeBatch(db);
    chunk.forEach((art) => {
      const ref = doc(db, 'articles', art.id);
      batch.set(ref, {
        ...art,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    });
    console.log(`Writing batch ${Math.floor(i / chunkSize) + 1}...`);
    await batch.commit();
    count += chunk.length;
    console.log(`Uploaded ${count} / ${articles.length} essays to Firestore.`);
  }
  console.log('SUCCESS: All 73 essays seeded to Firebase Firestore!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Firebase seed error:', err);
  process.exit(1);
});
