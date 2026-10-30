import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  Firestore,
} from 'firebase/firestore';
import { Article } from '../types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.includes('your-')
  );
};

let db: Firestore | null = null;

if (typeof window !== 'undefined' && isFirebaseConfigured()) {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
  }
}

export { db };

// Collection reference
const COLLECTION_NAME = 'articles';

// Fetch all articles from Firebase Firestore
export async function getFirebaseArticles(): Promise<Article[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    const articles: Article[] = [];
    querySnapshot.forEach((docSnap) => {
      articles.push(docSnap.data() as Article);
    });
    return articles;
  } catch (error) {
    console.error('Error fetching articles from Firebase:', error);
    return [];
  }
}

// Publish or update an article in Firebase Firestore
export async function publishArticleToFirebase(article: Article): Promise<boolean> {
  if (!db) return false;
  try {
    const docRef = doc(db, COLLECTION_NAME, article.id);
    await setDoc(docRef, {
      ...article,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error publishing article to Firebase:', error);
    return false;
  }
}

// Delete an article from Firebase Firestore
export async function deleteArticleFromFirebase(articleId: string): Promise<boolean> {
  if (!db) return false;
  try {
    const docRef = doc(db, COLLECTION_NAME, articleId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting article from Firebase:', error);
    return false;
  }
}
