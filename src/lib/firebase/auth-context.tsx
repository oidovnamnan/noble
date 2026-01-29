// Firebase Authentication Hooks and Context
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    User as FirebaseUser,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { useAuthStore } from '@/lib/store';
import type { User } from '@/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, setLoading } = useAuthStore();
    const [user, setUserState] = useState<User | null>(null);
    const [loading, setLocalLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            setLocalLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser && db) {
                    // Timeout wrapper for DB profile fetch
                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('timeout')), 5000)
                    );

                    try {
                        // Get additional user data from Firestore with 5s timeout
                        const userDocPromise = getDoc(doc(db, 'users', firebaseUser.uid));
                        const userDoc = await Promise.race([userDocPromise, timeoutPromise]) as any;

                        if (userDoc?.exists()) {
                            const userData = { id: firebaseUser.uid, ...userDoc.data() } as User;
                            if (firebaseUser.email === 'nobleworldgate@gmail.com') {
                                userData.role = 'admin';
                            }
                            setUser(userData);
                            setUserState(userData);
                        } else {
                            throw new Error('No doc');
                        }
                    } catch (e) {
                        // DB fail or timeout - silently use fallback data from auth
                        const basicUser: User = {
                            id: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
                            lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
                            phone: '',
                            role: firebaseUser.email === 'nobleworldgate@gmail.com' ? 'admin' : 'customer',
                            language: 'mn',
                            notifications: { email: true, push: true, sms: false },
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        };
                        setUser(basicUser);
                        setUserState(basicUser);
                    }
                } else if (firebaseUser) {
                    setUser({ id: firebaseUser.uid, email: firebaseUser.email || '' } as any);
                } else {
                    setUser(null);
                    setUserState(null);
                }
            } catch (error) {
                // Global edge case error
                setUser(null);
                setUserState(null);
            } finally {
                setLoading(false);
                setLocalLoading(false);
            }
        });

        return () => unsubscribe();
    }, [setUser, setLoading]);

    const logout = async () => {
        if (auth) {
            await firebaseSignOut(auth);
        }
        setUser(null);
        setUserState(null);
    };


    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
