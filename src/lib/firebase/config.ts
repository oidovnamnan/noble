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

// Safety check: only initialize if API key is present
if (typeof window !== 'undefined') {
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your-api-key') {
        try {
            if (!getApps().length) {
                app = initializeApp(firebaseConfig);
            } else {
                app = getApps()[0];
            }
            auth = getAuth(app);

            // Aggressive Firestore initialization for unstable network environments
            db = initializeFirestore(app!, {
                experimentalForceLongPolling: true,
                // Using memory-only cache prevents issues with corrupted IndexedDB in local environments
                localCache: { _kind: 'memory' } as any
            });

            storage = getStorage(app!);
            console.log('Firebase Services Initialized (Memory Cache, Long Polling)', {
                projectId: firebaseConfig.projectId
            });
        } catch (error) {
            console.error('Firebase initialization error:', error);
        }
    } else {
        console.warn('Firebase API key is missing or placeholder. API Key starts with:', firebaseConfig.apiKey?.substring(0, 5));
    }
}

export { app, auth, db, storage };

