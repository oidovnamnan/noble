// Service Detail Page
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Clock,
    DollarSign,
    CheckCircle2,
    Info,
    HelpCircle,
    ChevronRight,
    Globe,
    Loader2,
    FileText
} from 'lucide-react';
import Link from 'next/link';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Card, Button, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_SERVICES, MOCK_DOC_TYPES } from '@/lib/mock-data';

interface ServiceStep {
    order: number;
    title: { mn: string; en: string };
    description: { mn: string; en: string };
}

interface Service {
    id: string;
    name: { mn: string; en: string };
    description: { mn: string; en: string };
    category: string;
    baseFee?: number;
    processingTime: string;
    requiredDocuments: string[]; // Array of documentType IDs
    steps: ServiceStep[];
    faq?: { q: string; a: string }[];
}

interface DocumentType {
    id: string;
    name: { mn: string; en: string };
}

export default function ServiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const serviceId = params.id as string;
    const { language } = useAppStore();

    const [service, setService] = useState<Service | null>(null);
    const [docTypes, setDocTypes] = useState<Record<string, DocumentType>>({});
    const [loading, setLoading] = useState(true);
    const loadingRef = React.useRef(true);

    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    useEffect(() => {
        const fetchData = async () => {
            // Safety timeout
            const timeout = setTimeout(() => {
                if (loadingRef.current) {
                    console.warn("Firestore timeout in ServiceDetailPage, falling back to mock");
                    const mockService = MOCK_SERVICES.find(s => s.id === serviceId);
                    if (mockService) {
                        setService(mockService as any);
                        setDocTypes(MOCK_DOC_TYPES as any);
                    }
                    setLoading(false);
                }
            }, 3000);

            if (!db) {
                const mockService = MOCK_SERVICES.find(s => s.id === serviceId);
                if (mockService) {
                    setService(mockService as any);
                    setDocTypes(MOCK_DOC_TYPES as any);
                }
                setLoading(false);
                clearTimeout(timeout);
                return;
            }
            if (!serviceId) {
                clearTimeout(timeout);
                return;
            }

            try {
                // Fetch Service
                const serviceDoc = await getDoc(doc(db, 'services', serviceId));
                if (serviceDoc.exists()) {
                    const serviceData = { id: serviceDoc.id, ...serviceDoc.data() } as Service;
                    setService(serviceData);

                    // Fetch Required Document Types
                    if (serviceData.requiredDocuments?.length > 0) {
                        const docsSnap = await getDocs(collection(db, 'documentTypes'));
                        const docsMap: Record<string, DocumentType> = {};
                        docsSnap.docs.forEach(d => {
                            docsMap[d.id] = { id: d.id, ...d.data() } as DocumentType;
                        });
                        setDocTypes(docsMap);
                    }
                } else {
                    // Fallback to mock if doc doesn't exist in Firestore
                    const mockService = MOCK_SERVICES.find(s => s.id === serviceId);
                    if (mockService) {
                        setService(mockService as any);
                        setDocTypes(MOCK_DOC_TYPES as any);
                    }
                }
            } catch (err) {
                console.error('Error fetching service details:', err);
                const mockService = MOCK_SERVICES.find(s => s.id === serviceId);
                if (mockService) {
                    setService(mockService as any);
                    setDocTypes(MOCK_DOC_TYPES as any);
                }
            } finally {
                setLoading(false);
                clearTimeout(timeout);
            }
        };

        fetchData();
    }, [serviceId]);

    const handleApply = () => {
        router.push(`/my-applications/new?serviceId=${serviceId}`);
    };

    if (loading) {
        return (
            <MobileLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-gray-500 font-medium">Уншиж байна...</p>
                </div>
            </MobileLayout>
        );
    }

    if (!service) {
        return (
            <MobileLayout>
                <div className="p-4 text-center py-20">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Үйлчилгээ олдсонгүй</h2>
                    <Button onClick={() => router.back()}>Буцах</Button>
                </div>
            </MobileLayout>
        );
    }

    return (
        <MobileLayout>
            {/* Hero Header */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-60 bg-gradient-to-br from-blue-600 to-indigo-800 overflow-hidden rounded-b-[40px] shadow-xl"
            >
                <div className="absolute top-10 left-4 z-10">
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>
                <div className="container-mobile pt-24 px-6">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 mb-3"
                    >
                        <Badge variant="purple" className="bg-white/20 text-white border-none backdrop-blur-md uppercase text-[10px] tracking-widest font-bold px-3 py-1">
                            {service.category}
                        </Badge>
                    </motion.div>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-white drop-shadow-lg leading-tight"
                    >
                        {service.name[language]}
                    </motion.h1>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute top-10 right-20 w-20 h-20 bg-blue-400/20 rounded-full blur-2xl" />
            </motion.div>

            <div className="px-4 -mt-10 pb-32 space-y-6 relative z-10">
                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4">
                    {service.baseFee && (
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                            <Card variant="elevated" className="flex items-center gap-4 bg-white/95 backdrop-blur-sm border-none shadow-lg">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-400 font-bold tracking-wider text-left">SERVICE FEE</p>
                                    <p className="text-base font-bold text-gray-900 text-left">{formatCurrency(service.baseFee)}</p>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className={!service.baseFee ? "col-span-2" : ""}
                    >
                        <Card variant="elevated" className="flex items-center gap-4 bg-white/95 backdrop-blur-sm border-none shadow-lg">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400 font-bold tracking-wider text-left">ESTIMATED TIME</p>
                                <p className="text-sm font-bold text-gray-900 text-left">{service.processingTime}</p>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Description */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Info className="w-4 h-4 text-blue-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Мэдээлэл</h2>
                    </div>
                    <Card variant="outlined" padding="md" className="bg-white/50 border-gray-100">
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                            {service.description[language]}
                        </p>
                    </Card>
                </section>

                {/* Required Documents */}
                {service.requiredDocuments?.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Бүрдүүлэх баримт</h2>
                        </div>
                        <Card variant="outlined" padding="none" className="overflow-hidden border-gray-100 bg-white/50">
                            {service.requiredDocuments.map((docId, index) => {
                                const docType = docTypes[docId];
                                return (
                                    <div
                                        key={docId}
                                        className={`flex items-center justify-between p-4 ${index !== service.requiredDocuments.length - 1 ? 'border-b border-gray-50' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-gray-800">{docType?.name[language] || 'Уншиж байна...'}</span>
                                            </div>
                                        </div>
                                        <Badge variant="error" size="sm" className="bg-red-50 text-red-600 border-none font-bold uppercase tracking-widest text-[9px]">Required</Badge>
                                    </div>
                                );
                            })}
                        </Card>
                    </section>
                )}

                {/* Process Steps */}
                {service.steps?.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <ChevronRight className="w-4 h-4 text-indigo-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Процесс</h2>
                        </div>
                        <div className="space-y-6 relative ml-4 border-l-2 border-indigo-100 pl-8 py-2">
                            {service.steps.sort((a, b) => a.order - b.order).map((step, idx) => (
                                <motion.div
                                    key={step.order}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + idx * 0.1 }}
                                    className="relative"
                                >
                                    <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-indigo-600 border-4 border-white ring-4 ring-indigo-50 shadow-md flex items-center justify-center text-[10px] text-white font-bold">
                                        {step.order}
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-900">{step.title[language]}</h3>
                                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{step.description[language]}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* FAQ */}
                {service.faq && service.faq.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <HelpCircle className="w-4 h-4 text-amber-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Асуулт, хариулт</h2>
                        </div>
                        <div className="space-y-3">
                            {service.faq.map((item, idx) => (
                                <Card key={idx} variant="outlined" padding="md" className="bg-white/70 border-gray-100 hover:border-amber-100 transition-colors">
                                    <p className="text-sm font-bold text-gray-900">{item.q}</p>
                                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{item.a}</p>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Floating Apply Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-50 via-gray-50/95 to-transparent z-40">
                <div className="container-mobile">
                    <Button
                        onClick={handleApply}
                        className="w-full h-14 text-lg font-bold shadow-2xl shadow-blue-500/30 rounded-2xl"
                    >
                        Хүсэлт гаргах
                    </Button>
                </div>
            </div>
        </MobileLayout>
    );
}
