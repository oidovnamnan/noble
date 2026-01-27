// Public News Detail Page
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Clock,
    Share2,
    Calendar,
    User,
    Loader2,
    Newspaper
} from 'lucide-react';
import Link from 'next/link';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Card, Badge, Button } from '@/components/ui';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { MOCK_NEWS } from '@/lib/mock-data';

export default function NewsDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { language } = useAppStore();
    const id = params.id as string;

    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            if (!db) {
                const mockItem = MOCK_NEWS.find(n => n.id === id);
                if (mockItem) {
                    setItem(mockItem);
                }
                setLoading(false);
                return;
            }
            if (!id) return;
            try {
                const docSnap = await getDoc(doc(db, 'news', id));
                if (docSnap.exists()) {
                    setItem({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (err) {
                console.error('Error fetching news detail:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    if (loading) {
        return (
            <MobileLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
            </MobileLayout>
        );
    }

    if (!item) {
        return (
            <MobileLayout>
                <div className="p-8 text-center pt-20">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Мэдээ олдсонгүй</h2>
                    <Button onClick={() => router.back()}>Буцах</Button>
                </div>
            </MobileLayout>
        );
    }

    return (
        <MobileLayout>
            {/* Header */}
            <div className="bg-white sticky top-0 z-40 px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-50 rounded-xl transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                    <Share2 className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            <article className="pb-20">
                {/* Hero Image */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative h-72 bg-slate-100 overflow-hidden"
                >
                    {item.coverImage ? (
                        <img src={item.coverImage} className="w-full h-full object-cover" alt="" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Newspaper className="w-16 h-16 text-slate-200" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <Badge variant="purple" className="mb-3 text-[10px] font-bold uppercase tracking-widest px-4 border-none shadow-xl">
                            {item.category}
                        </Badge>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-bold text-white leading-tight drop-shadow-lg"
                        >
                            {item.title[language]}
                        </motion.h1>
                    </div>
                </motion.div>

                {/* Meta Info */}
                <div className="px-6 py-6 border-b border-gray-100 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-blue-500" />
                        </div>
                        <span className="text-xs font-bold text-gray-400">
                            {new Date(item.publishedAt?.toDate?.() || item.publishedAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-xs font-bold text-gray-400">Noble Team</span>
                    </div>
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="px-6 py-8 prose prose-slate max-w-none prose-sm prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.content[language] }}
                />

                {/* Bottom CTA */}
                <div className="px-6 py-10">
                    <Card variant="outlined" padding="lg" className="bg-slate-50 border-none rounded-[32px] text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{language === 'en' ? 'Need advice?' : 'Зөвлөгөө авах уу?'}</h3>
                        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                            {language === 'en'
                                ? 'Our experts are ready to help you with your visa and education needs.'
                                : 'Манай мэргэжилтнүүд танд виз болон сургалтын асуудлаар зөвлөхөд бэлэн байна.'}
                        </p>
                        <Link href="/chat">
                            <Button className="w-full h-12 rounded-2xl font-bold">
                                {language === 'en' ? 'Start AI Chat' : 'AI-тай ярилцах'}
                            </Button>
                        </Link>
                    </Card>
                </div>
            </article>
        </MobileLayout>
    );
}
