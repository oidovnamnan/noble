import * as admin from 'firebase-admin';

const firebaseConfig = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length && firebaseConfig.privateKey) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
        });
    } catch (error) {
        console.error('Firebase admin initialization error', error);
    }
}

export const db = admin.apps.length ? admin.firestore() : null as any;
export const auth = admin.apps.length ? admin.auth() : null as any;
