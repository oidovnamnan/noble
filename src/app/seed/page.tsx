'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, Timestamp, getDocs, deleteDoc, query } from 'firebase/firestore';
import { Loader2, CheckCircle, Database, Trash2, ArrowRight } from 'lucide-react';
import { MOCK_SERVICES, MOCK_NEWS } from '@/lib/mock-data';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function SeedPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const [status, setStatus] = useState('idle');
    const [log, setLog] = useState<string[]>([]);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center p-6"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>;
    if (!isAuthenticated || user?.role !== 'admin') return null;

    const clearCollection = async (collectionName: string) => {
        if (!db) return;
        const q = query(collection(db, collectionName));
        const snapshot = await getDocs(q);
        const deleteOps = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deleteOps);
        setLog(prev => [...prev, `Cleared ${collectionName} collection`]);
    };

    const seed = async () => {
        if (!db) {
            alert('Firebase not configured. Please fill .env.local first.');
            return;
        }

        setStatus('loading');
        setLog([]);

        try {
            // Seed Services
            setLog(prev => [...prev, 'Starting services seeding...']);
            await clearCollection('services');
            for (const item of MOCK_SERVICES) {
                await addDoc(collection(db, 'services'), {
                    ...item,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now()
                });
                setLog(prev => [...prev, `Added Service: ${item.name.en}`]);
            }

            // Seed News
            setLog(prev => [...prev, 'Starting news seeding...']);
            await clearCollection('news');
            for (const item of MOCK_NEWS) {
                await addDoc(collection(db, 'news'), {
                    ...item,
                    publishedAt: Timestamp.fromDate(new Date(item.publishedAt)),
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now()
                });
                setLog(prev => [...prev, `Added News: ${item.title.en}`]);
            }

            setStatus('success');
            setLog(prev => [...prev, '--- SEEDING COMPLETE ---']);
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setLog(prev => [...prev, `CRITICAL ERROR: ${error.message}`]);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white rounded-[32px] shadow-2xl p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Database className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 leading-none">System Data Seed</h1>
                        <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Populate Firestore Content</p>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-6 mb-8 h-80 overflow-y-auto font-mono text-xs text-blue-400 border border-slate-800">
                    {log.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-600">
                            Waiting for action...
                        </div>
                    ) : (
                        log.map((entry, i) => (
                            <div key={i} className="mb-1">
                                <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                {entry}
                            </div>
                        ))
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={seed}
                        disabled={status === 'loading'}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all disabled:opacity-50"
                    >
                        {status === 'loading' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Database className="w-5 h-5" />
                                Start Seeding
                            </>
                        )}
                    </button>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 px-6 rounded-2xl transition-all"
                    >
                        Back to Home
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                {status === 'success' && (
                    <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 font-medium animate-in fade-in slide-in-from-top-4">
                        <CheckCircle className="w-5 h-5" />
                        Database successfully populated!
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-medium">
                        Seeding failed. Please check the console and ensure Firebase is configured.
                    </div>
                )}
            </div>
        </div>
    );
}
