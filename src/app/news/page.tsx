// Public News Listing Page
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Search,
    Clock,
    Newspaper,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Card, Input, Badge } from '@/components/ui';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_NEWS } from '@/lib/mock-data';

const categories = [
    { id: 'all', label: 'Бүгд', labelEn: 'All' },
    { id: 'announcement', label: 'Зарлал', labelEn: 'Announcements' },
    { id: 'education', label: 'Боловсрол', labelEn: 'Education' },
    { id: 'travel', label: 'Аялал', labelEn: 'Travel' },
    { id: 'work', label: 'Ажил', labelEn: 'Work' },
    { id: 'visa', label: 'Виз', labelEn: 'Visa' },
];

export default function NewsPage() {
    const { language } = useAppStore();
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const loadingRef = React.useRef(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    useEffect(() => {
        if (!db) {
            setNews(MOCK_NEWS);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'news'),
            where('isPublished', '==', true),
            orderBy('publishedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNews(newsData);
            setLoading(false);
        }, (error) => {
            console.error("Firestore error in NewsPage:", error);
            setNews(MOCK_NEWS);
            setLoading(false);
        });

        const timeout = setTimeout(() => {
            if (loadingRef.current) {
                console.warn("Firestore timeout in NewsPage, falling back to mock");
                setNews(MOCK_NEWS);
                setLoading(false);
            }
        }, 3000);

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const filteredNews = news.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.title[language]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.content[language]?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <MobileLayout>
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="px-4 py-3">
                    <div className="flex items-center gap-3 mb-3">
                        <Link href="/" className="p-2 -ml-2 hover:bg-gray-50 rounded-xl">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <h1 className="text-lg font-bold text-gray-900">Мэдээ мэдээлэл</h1>
                    </div>

                    <Input
                        placeholder="Хайх..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="w-4 h-4" />}
                    />
                </div>

                <div className="px-4 pb-3 overflow-x-auto hide-scrollbar">
                    <div className="flex gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-widest ${selectedCategory === cat.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                    }`}
                            >
                                {language === 'en' ? cat.labelEn : cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="px-4 py-6 space-y-4 pb-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-3">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                ) : filteredNews.length === 0 ? (
                    <div className="text-center py-20">
                        <Newspaper className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Мэдээ олдсонгүй</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredNews.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link href={`/news/${item.id}`}>
                                    <Card variant="outlined" padding="none" className="overflow-hidden hover:border-blue-400/30 transition-all duration-300 hover:shadow-xl border-slate-100 group">
                                        <div className="relative h-48 bg-slate-100 overflow-hidden">
                                            {item.coverImage ? (
                                                <img src={item.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Newspaper className="w-12 h-12 text-slate-200" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <Badge variant="purple" className="bg-white/90 backdrop-blur-sm shadow-sm border-none text-[9px] font-bold uppercase tracking-widest px-3">
                                                    {item.category}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                                <Clock className="w-3 h-3" />
                                                {new Date(item.publishedAt?.toDate?.() || item.publishedAt).toLocaleDateString()}
                                            </div>
                                            <h2 className="text-lg font-bold text-gray-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                                                {item.title[language]}
                                            </h2>
                                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
                                                {item.content[language]?.replace(/<[^>]*>/g, '')}
                                            </p>
                                            <div className="flex items-center text-blue-600 text-xs font-bold uppercase tracking-widest gap-2">
                                                {language === 'en' ? 'Read more' : 'Цааш үзэх'}
                                                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </div>
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
