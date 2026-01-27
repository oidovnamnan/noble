// My Applications Page
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Plus,
    ChevronRight,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Card, Button, StatusBadge } from '@/components/ui';
import { formatCurrency, formatRelativeTime, cn } from '@/lib/utils';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuthStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyApplicationsPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const loadingRef = React.useRef(true);

    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (!db || !user) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'applications'),
            where('customerId', '==', user.id),
            orderBy('updatedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const appsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setApplications(appsData);
            setLoading(false);
        }, (error) => {
            console.error("Firestore error in MyApplicationsPage:", error);
            setApplications([]);
            setLoading(false);
        });

        const timeout = setTimeout(() => {
            if (loadingRef.current) {
                console.warn("Firestore timeout in MyApplicationsPage, falling back to empty list");
                setApplications([]);
                setLoading(false);
            }
        }, 3000);

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, [user]);

    if (isLoading || (!isAuthenticated && !loading)) {
        return (
            <MobileLayout>
                <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-gray-500 font-medium">Уншиж байна...</p>
                </div>
            </MobileLayout>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <MobileLayout>
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="p-2 -ml-2 hover:bg-gray-50 rounded-xl">
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                            <h1 className="text-lg font-bold text-gray-900">Миний хүсэлтүүд</h1>
                        </div>
                        <Link href="/services">
                            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} className="h-9 px-4 rounded-xl font-bold shadow-sm">
                                Шинэ
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Applications List */}
            <div className="px-4 py-6 space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <p className="text-sm text-gray-500 font-medium">Уншиж байна...</p>
                    </div>
                ) : applications.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Танд хүсэлт байхгүй байна</h3>
                        <p className="text-sm text-gray-500 mb-8 px-10">Шинэ хүсэлт илгээж визний үйлчилгээгээ эхлүүлнэ үү.</p>
                        <Link href="/services">
                            <Button className="w-full max-w-[240px] h-12">Үйлчилгээ үзэх</Button>
                        </Link>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        {applications.map((app, idx) => (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link href={`/my-applications/${app.id}`}>
                                    <Card variant="elevated" padding="md" className="hover:shadow-xl transition-all border-none shadow-gray-200/50">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner uppercase font-bold text-slate-300">
                                                    {app.serviceName?.charAt(0) || 'N'}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-sm leading-tight">
                                                        {app.serviceName}
                                                    </h3>
                                                    <p className="text-[10px] text-gray-400 font-bold tracking-wider mt-1">{app.applicationNumber}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {app.messages?.some((m: any) => !m.isRead && m.senderRole !== 'customer') && (
                                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                                )}
                                                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <StatusBadge
                                                    status={app.status}
                                                    label={app.statusLabel || app.status}
                                                    className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                                                />
                                                <span className="text-xs font-bold text-gray-900">{app.progress || 0}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-1000",
                                                        app.status === 'completed' ? 'bg-green-500' :
                                                            app.status === 'rejected' ? 'bg-red-500' :
                                                                app.status === 'documents_incomplete' ? 'bg-amber-500' :
                                                                    'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]'
                                                    )}
                                                    style={{ width: `${app.progress || 0}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <div className="flex items-center gap-4">
                                                <span className="bg-gray-50 px-2 py-1 rounded-md">📄 {app.requiredDocuments?.filter((d: any) => d.status === 'approved').length || 0}/{app.requiredDocuments?.length || 0}</span>
                                                <span className="bg-gray-50 px-2 py-1 rounded-md">👤 {app.assignedStaffName || 'ХҮЛЭЭГДЭЖ БУЙ'}</span>
                                            </div>
                                            <span className="text-gray-300">{formatRelativeTime(app.updatedAt || app.createdAt)}</span>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </MobileLayout>
    );
}
