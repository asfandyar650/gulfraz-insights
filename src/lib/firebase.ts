import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  Firestore,
  Unsubscribe,
} from 'firebase/firestore';
import { Article } from '../types';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const STORAGE_KEY = 'gulfraz_firebase_config';
const COLLECTION_NAME = 'articles';

export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyA9R4nsloyP65CSa01Bx8rIJ-F6xj-Frow",
  authDomain: "gulfraz-insights.firebaseapp.com",
  projectId: "gulfraz-insights",
  storageBucket: "gulfraz-insights.firebasestorage.app",
  messagingSenderId: "149272727698",
  appId: "1:149272727698:web:865fd8fe28e547a04f564b",
};

// Get active config (from localStorage if set, else from process.env, else default)
export function getActiveFirebaseConfig(): FirebaseConfig {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.apiKey && parsed.projectId) {
          return parsed;
        }
      }
    } catch {}
  }

  // Fallback to environment variables
  const envConfig: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  };

  if (envConfig.apiKey && envConfig.projectId && !envConfig.projectId.includes('your-')) {
    return envConfig;
  }

  return DEFAULT_FIREBASE_CONFIG;
}

export function isFirebaseConfigured(): boolean {
  return true;
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getFirebaseDb(): Firestore | null {
  if (db) return db;

  const config = getActiveFirebaseConfig();
  if (!config) return null;

  try {
    app = !getApps().length ? initializeApp(config) : getApp();
    db = getFirestore(app);
    return db;
  } catch (err) {
    console.warn('Firebase init error:', err);
    return null;
  }
}

// Save custom config to localStorage and re-init
export function saveFirebaseConfig(config: FirebaseConfig): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    db = null; // Reset db so it reinitializes
    return getFirebaseDb() !== null;
  } catch (e) {
    console.error('Error saving firebase config:', e);
    return false;
  }
}

// Remove custom config
export function clearFirebaseConfig(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    db = null;
  } catch {}
}

// Subscribe to real-time articles in Firestore
export function subscribeToArticles(onArticlesUpdated: (articles: Article[]) => void): Unsubscribe | null {
  const firestore = getFirebaseDb();
  if (!firestore) return null;

  try {
    const colRef = collection(firestore, COLLECTION_NAME);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const remoteArticles: Article[] = [];
        snapshot.forEach((docSnap) => {
          remoteArticles.push(docSnap.data() as Article);
        });
        if (remoteArticles.length > 0) {
          onArticlesUpdated(remoteArticles);
        }
      },
      (error) => {
        console.warn('Firestore subscription notice:', error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to subscribe to Firestore:', err);
    return null;
  }
}

// Fetch all articles from Firebase Firestore once
export async function getFirebaseArticles(): Promise<Article[]> {
  const firestore = getFirebaseDb();
  if (!firestore) return [];

  try {
    const colRef = collection(firestore, COLLECTION_NAME);
    const querySnapshot = await getDocs(colRef);
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
  const firestore = getFirebaseDb();
  if (!firestore) return false;

  try {
    const docRef = doc(firestore, COLLECTION_NAME, article.id);
    await setDoc(
      docRef,
      {
        ...article,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Error publishing article to Firebase:', error);
    return false;
  }
}

// Delete an article from Firebase Firestore
export async function deleteArticleFromFirebase(articleId: string): Promise<boolean> {
  const firestore = getFirebaseDb();
  if (!firestore) return false;

  try {
    const docRef = doc(firestore, COLLECTION_NAME, articleId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting article from Firebase:', error);
    return false;
  }
}

// Sync/seed all articles into Firebase in batches (50 per batch)
export async function syncAllArticlesToFirebase(articles: Article[]): Promise<{ success: boolean; count: number }> {
  const firestore = getFirebaseDb();
  if (!firestore) return { success: false, count: 0 };

  try {
    let uploaded = 0;
    const chunkSize = 40;
    for (let i = 0; i < articles.length; i += chunkSize) {
      const chunk = articles.slice(i, i + chunkSize);
      const batch = writeBatch(firestore);
      chunk.forEach((art) => {
        const docRef = doc(firestore, COLLECTION_NAME, art.id);
        batch.set(docRef, {
          ...art,
          syncedAt: new Date().toISOString(),
        }, { merge: true });
      });
      await batch.commit();
      uploaded += chunk.length;
    }
    return { success: true, count: uploaded };
  } catch (error) {
    console.error('Batch sync error:', error);
    return { success: false, count: 0 };
  }
}
