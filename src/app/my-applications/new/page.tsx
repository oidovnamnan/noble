'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    CheckCircle2,
    Loader2,
    Briefcase,
    ShieldCheck,
    CreditCard,
    FileText,
    User,
    GraduationCap,
    Send,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Card, Button, Badge, Input, Select, Textarea } from '@/components/ui';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { useAuthStore, useAppStore } from '@/lib/store';
import { MOCK_SERVICES } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';

function ApplicationForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const { language } = useAppStore();
    const serviceId = searchParams.get('serviceId');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router]);

    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        birthDate: '',
        gender: '',
        phone: user?.phone || '',
        email: user?.email || '',
        education: '',
        englishLevel: '',
        targetCountry: '',
        budget: '',
        notes: '',
        // Category specific
        gpa: '',
        workExperience: '',
        visaHistory: '',
        passportExpiry: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!serviceId) {
                setLoading(false);
                return;
            }

            if (!db) {
                const mock = MOCK_SERVICES.find(s => s.id === serviceId);
                setService(mock);
                setLoading(false);
                return;
            }

            try {
                const serviceDoc = await getDoc(doc(db, 'services', serviceId));
                if (serviceDoc.exists()) {
                    setService({ id: serviceDoc.id, ...serviceDoc.data() });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [serviceId]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        if (!service || submitting) return;
        setSubmitting(true);

        try {
            const applicationData = {
                ...formData,
                serviceId: service.id,
                serviceName: service.name[language],
                status: 'pending',
                createdAt: new Date().toISOString(),
                customerId: user?.id || 'guest',
                applicationNumber: `NOB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
            };

            if (db) {
                await addDoc(collection(db, 'applications'), applicationData);
                setIsSuccess(true);
            } else {
                // Demo mode success
                setIsSuccess(true);
            }
        } catch (err) {
            console.error(err);
            alert('Алдаа гарлаа. Дахин оролдоно уу.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin" /></div>
    );

    if (isLoading || (!isAuthenticated && !loading)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-gray-500 font-medium">Уншиж байна...</p>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Хүсэлт амжилттай!</h2>
                <p className="text-gray-500 mb-8 max-w-xs">
                    Таны хүсэлтийг хүлээн авлаа. Бид удахгүй тантай холбогдох болно.
                </p>
                <div className="flex gap-4">
                    <Link href="/my-applications">
                        <Button variant="outline">Миний хүсэлтүүд</Button>
                    </Link>
                    <Link href="/">
                        <Button>Нүүр хуудас</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-20">
            {/* Steps Header */}
            <div className="bg-white border-b border-gray-100 sticky top-14 z-30 px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="font-bold text-gray-900">
                        {step === 1 ? 'Хувийн мэдээлэл' : step === 2 ? 'Боловсрол & Туршлага' : 'Нэмэлт мэдээлэл'}
                    </h1>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                        Step {step}/3
                    </span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            <div className="p-4 space-y-6">
                {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <Card padding="md" className="space-y-4">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Үндсэн мэдээлэл</h3>
                                    <p className="text-xs text-gray-500">Бид тантай холбогдох болно</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Овог" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                                <Input label="Нэр" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                            </div>
                            <Input label="Имэйл" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                            <Input label="Утас" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                        </Card>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <Card padding="md" className="space-y-4">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Боловсрол</h3>
                                    <p className="text-xs text-gray-500">Таны одоогийн түвшин</p>
                                </div>
                            </div>
                            <Input label="Төгссөн сургууль" name="education" placeholder="Ex: MNUMS" value={formData.education} onChange={handleInputChange} />
                            <Input label="Голч дүн (GPA)" name="gpa" placeholder="Ex: 3.5" value={formData.gpa} onChange={handleInputChange} />
                            <div className="pt-2">
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Англи хэлний түвшин</label>
                                <select
                                    name="englishLevel"
                                    value={formData.englishLevel}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                                >
                                    <option value="">Сонгох...</option>
                                    <option value="beginner">Beginner (A1-A2)</option>
                                    <option value="intermediate">Intermediate (B1-B2)</option>
                                    <option value="advanced">Advanced (C1-C2)</option>
                                </select>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <Card padding="md" className="space-y-4">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                    <Send className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Зорилго</h3>
                                    <p className="text-xs text-gray-500">Таны хүсэж буй зүйл</p>
                                </div>
                            </div>
                            <Input label="Сонирхож буй улс" name="targetCountry" placeholder="Ex: Australia" value={formData.targetCountry} onChange={handleInputChange} />
                            <div className="pt-2">
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Төсөв (Ойролцоогоор)</label>
                                <select
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                                >
                                    <option value="">Сонгох...</option>
                                    <option value="low">10 - 30 сая ₮</option>
                                    <option value="medium">30 - 60 сая ₮</option>
                                    <option value="high">60+ сая ₮</option>
                                </select>
                            </div>
                            <Textarea label="Нэмэлт тайлбар" name="notes" placeholder="Өөр хэлэх зүйл байна уу?" value={formData.notes} onChange={handleInputChange} />
                        </Card>
                    </motion.div>
                )}
            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3 z-40">
                {step > 1 && (
                    <Button variant="outline" className="flex-1" onClick={handleBack} leftIcon={<ChevronLeft className="w-4 h-4" />}>
                        Буцах
                    </Button>
                )}
                {step < 3 ? (
                    <Button className="flex-1" onClick={handleNext} rightIcon={<ChevronRight className="w-4 h-4" />}>
                        Үргэлжлүүлэх
                    </Button>
                ) : (
                    <Button className="flex-1" onClick={handleSubmit} isLoading={submitting} rightIcon={<CheckCircle2 className="w-4 h-4" />}>
                        Илгээх
                    </Button>
                )}
            </div>
        </div>
    );
}

export default function NewApplicationPage() {
    return (
        <MobileLayout>
            <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>}>
                <ApplicationForm />
            </Suspense>
        </MobileLayout>
    );
}
