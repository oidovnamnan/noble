// Firebase Configuration and Initialization
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, initializeFirestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

// Initialize Firebase
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your-api-key') {
    try {
        if (!getApps().length) {
            app = initializeApp(firebaseConfig);
        } else {
            app = getApps()[0];
        }
        auth = getAuth(app);

        // Aggressive Firestore initialization for unstable network environments
        // Works on both client and server (Next.js Edge/Node)
        db = initializeFirestore(app!, {
            experimentalForceLongPolling: true,
            // Using memory-only cache prevents issues with corrupted IndexedDB 
            localCache: (typeof window !== 'undefined') ? { _kind: 'memory' } as any : undefined
        });

        storage = getStorage(app!);
        console.log('Firebase Services Initialized', {
            projectId: firebaseConfig.projectId,
            context: typeof window !== 'undefined' ? 'client' : 'server'
        });
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
} else {
    console.warn('Firebase API key is missing or placeholder. API Key starts with:', firebaseConfig.apiKey?.substring(0, 5));
}

export { app, auth, db, storage };

