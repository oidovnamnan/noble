'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
    GraduationCap,
    Plane,
    Briefcase,
    FileCheck,
    ChevronRight,
    Clock,
    DollarSign,
    ArrowLeft,
    Search,
    Loader2
} from 'lucide-react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Card, Input, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_SERVICES } from '@/lib/mock-data';

// Service Categories
const categories = [
    { id: 'all', label: 'Бүгд', labelEn: 'All' },
    { id: 'education', label: 'Боловсрол', labelEn: 'Education', icon: GraduationCap },
    { id: 'travel', label: 'Аялал', labelEn: 'Travel', icon: Plane },
    { id: 'work', label: 'Ажил', labelEn: 'Work', icon: Briefcase },
    { id: 'visa', label: 'Виз', labelEn: 'Visa', icon: FileCheck },
];

interface Service {
    id: string;
    name: { mn: string; en: string };
    description: { mn: string; en: string };
    category: string;
    baseFee?: number;
    processingTime: string;
    isActive: boolean;
    displayOrder: number;
}

function ServicesContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category') || 'all';
    const [selectedCategory, setSelectedCategory] = useState(categoryParam);
    const [searchQuery, setSearchQuery] = useState('');
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const loadingRef = React.useRef(true);
    const [mounted, setMounted] = useState(false);
    const { language } = useAppStore();

    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!db) {
            setServices(MOCK_SERVICES as Service[]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'services'),
            where('isActive', '==', true),
            orderBy('displayOrder', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const servicesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Service));
            setServices(servicesData);
            setLoading(false);
        }, (error) => {
            console.error("Firestore error in ServicesPage:", error);
            setServices(MOCK_SERVICES as Service[]);
            setLoading(false);
        });

        // Safety timeout - fallback to mock if firestore hangs
        const timeout = setTimeout(() => {
            if (loadingRef.current) {
                console.warn("Firestore timeout in ServicesPage, falling back to mock");
                setServices(MOCK_SERVICES as Service[]);
                setLoading(false);
            }
        }, 3000);

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const filteredServices = services.filter(service => {
        const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
        const matchesSearch =
            service.name[language]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description[language]?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (!mounted) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <MobileLayout>
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="px-4 py-3">
                    <div className="flex items-center gap-3 mb-3">
                        <Link href="/" className="p-2 -ml-2 hover:bg-gray-50 rounded-xl">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <h1 className="text-lg font-bold text-gray-900">Үйлчилгээнүүд</h1>
                    </div>

                    {/* Search */}
                    <Input
                        placeholder="Хайх..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="w-4 h-4" />}
                    />
                </div>

                {/* Category Tabs */}
                <div className="px-4 pb-3 overflow-x-auto hide-scrollbar">
                    <div className="flex gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {language === 'en' ? cat.labelEn : cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Services List */}
            <div className="px-4 py-4 space-y-3">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <p className="text-sm text-gray-500 font-medium">Уншиж байна...</p>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Үйлчилгээ олдсонгүй</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredServices.map((service, idx) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Link href={`/services/${service.id}`}>
                                    <Card variant="outlined" padding="md" className="hover:border-blue-200 hover:shadow-md transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                                                <Briefcase className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-sm">
                                                            {service.name[language]}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                            {service.description[language]}
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                </div>

                                                <div className="flex items-center gap-4 mt-3">
                                                    {service.baseFee && (
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                                                                <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                                                            </div>
                                                            <span className="font-bold text-gray-900">
                                                                {formatCurrency(service.baseFee)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                                                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                                                        </div>
                                                        <span className="font-medium text-gray-700">{service.processingTime}</span>
                                                    </div>
                                                </div>
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

export default function ServicesPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>}>
            <ServicesContent />
        </Suspense>
    );
}
