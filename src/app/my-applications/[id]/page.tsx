// Application Detail Page
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Clock,
    MessageSquare,
    FileText,
    CreditCard,
    ChevronRight,
    Upload,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MoreVertical,
    Paperclip,
    Send,
    User as UserIcon,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Card, Button, StatusBadge, Badge, Input } from '@/components/ui';
import { formatCurrency, formatRelativeTime, getStatusColor, cn } from '@/lib/utils';
import { db, storage } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc, onSnapshot, arrayUnion, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthStore } from '@/lib/store';

export default function ApplicationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const [application, setApplication] = useState<any>(null);
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
    const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'status' | 'documents' | 'chat'>('status');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

    const id = params.id as string;

    useEffect(() => {
        if (!db || !id) return;

        const unsubscribe = onSnapshot(doc(db, 'applications', id), (doc) => {
            if (doc.exists()) {
                setApplication({ id: doc.id, ...doc.data() });
            }
            setLoading(false);
        }, (error) => {
            console.error("Firestore error in ApplicationDetailPage:", error);
            setLoading(false);
        });

        const timeout = setTimeout(() => {
            if (loadingRef.current) {
                console.warn("Firestore timeout in ApplicationDetailPage, falling back");
                setLoading(false);
            }
        }, 5000);

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, [id]);

    const handleFileSelect = (docId: string) => {
        setSelectedDocId(docId);
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !storage || !db || !selectedDocId || !application) return;

        setUploadingDocId(selectedDocId);
        try {
            // 1. Upload to Storage
            const storagePath = `applications/${application.id}/${selectedDocId}_${Date.now()}_${file.name}`;
            const storageRef = ref(storage, storagePath);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            // 2. Update Firestore
            const updatedDocs = application.requiredDocuments.map((d: any) => {
                if (d.id === selectedDocId) {
                    return {
                        ...d,
                        status: 'pending',
                        fileName: file.name,
                        fileUrl: downloadURL,
                        uploadedAt: new Date().toISOString()
                    };
                }
                return d;
            });

            await updateDoc(doc(db, 'applications', application.id), {
                requiredDocuments: updatedDocs,
                updatedAt: new Date().toISOString(),
                // Add to history
                statusHistory: arrayUnion({
                    status: application.status,
                    label: 'Бичиг баримт шинэчлэгдсэн',
                    date: new Date().toISOString(),
                    by: user?.firstName || 'Хэрэглэгч'
                })
            });

        } catch (error) {
            console.error('File upload error:', error);
            alert('Файл оруулахад алдаа гарлаа');
        } finally {
            setUploadingDocId(null);
            setSelectedDocId(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (isLoading || (!isAuthenticated && loading)) {
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

    if (loading) {
        return (
            <MobileLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <p className="text-sm text-gray-500 mt-4">Уншиж байна...</p>
                </div>
            </MobileLayout>
        );
    }

    if (!application) {
        return (
            <MobileLayout>
                <div className="p-4 text-center">
                    <p className="text-gray-500">Хүсэлт олдсонгүй</p>
                    <Button onClick={() => router.push('/my-applications')} className="mt-4">
                        Буцах
                    </Button>
                </div>
            </MobileLayout>
        );
    }

    const tabs = [
        { id: 'status', label: 'Төлөв', icon: Clock },
        { id: 'documents', label: 'Баримт', icon: FileText },
        { id: 'chat', label: 'Мессеж', icon: MessageSquare },
    ];

    return (
        <MobileLayout>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
            />

            {/* Sticky Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="p-2 -ml-2 hover:bg-gray-50 rounded-xl"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-sm font-bold text-gray-900">{application.serviceName}</h1>
                            <p className="text-[10px] text-gray-400 font-medium">{application.applicationNumber}</p>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-gray-50 rounded-xl">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Custom Tabs */}
                <div className="flex gap-1 mt-4 p-1 bg-gray-50 rounded-2xl">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all",
                                    isActive
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </header>

            <div className="px-4 py-6 pb-24">
                {activeTab === 'status' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Status Card */}
                        <Card variant="elevated" className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-blue-500/20">
                            <div className="flex items-center justify-between mb-4">
                                <StatusBadge
                                    status={application.status}
                                    label={application.statusLabel || application.status}
                                    className="bg-white/20 text-white border-none"
                                />
                                <span className="text-xs text-blue-100 font-medium">Сүүлд: {formatRelativeTime(application.updatedAt)}</span>
                            </div>
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-xs mb-2">
                                    <span className="font-bold opacity-80">ХҮСЭЛТИЙН ЯВЦ</span>
                                    <span className="font-bold">{application.progress || 0}%</span>
                                </div>
                                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white rounded-full transition-all duration-1000"
                                        style={{ width: `${application.progress || 0}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                        <UserIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] opacity-60">МЕНЕЖЕР</p>
                                        <p className="text-xs font-bold">{application.assignedStaffId ? 'Менежер Болд' : 'Хуваарилаагүй'}</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 text-[10px] h-8" onClick={() => setActiveTab('chat')}>
                                    Холбогдох
                                </Button>
                            </div>
                        </Card>

                        {/* Payment Info */}
                        <section className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-400 ml-1">ТӨЛБӨРИЙН МЭДЭЭЛЭЛ</h3>
                            <Card variant="outlined" className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center",
                                        application.payment?.status === 'paid' ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                                    )}>
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">Үйлчилгээний хөлс</h4>
                                        <p className={cn(
                                            "text-xs font-bold",
                                            application.payment?.status === 'paid' ? "text-green-600" : "text-amber-600"
                                        )}>
                                            {application.payment?.status === 'paid' ? 'ТӨЛӨГДСӨН' : 'ТӨЛБӨР ХҮЛЭЭГДЭЖ БУЙ'}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-gray-900">{formatCurrency(application.payment?.totalAmount || 0)}</p>
                            </Card>
                        </section>

                        {/* History Timeline */}
                        <section className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-400 ml-1">ТҮҮХ</h3>
                            <div className="space-y-4 relative ml-4 border-l-2 border-gray-100 pl-6 py-2">
                                {(application.statusHistory || []).slice().reverse().map((item: any, idx: number) => (
                                    <div key={idx} className="relative">
                                        <div className={cn(
                                            "absolute -left-[31px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm",
                                            idx === 0 ? "bg-blue-500 ring-2 ring-blue-50" : "bg-gray-200"
                                        )} />
                                        <div className="flex items-center justify-between gap-4">
                                            <h4 className={cn(
                                                "text-xs font-bold",
                                                idx === 0 ? "text-gray-900" : "text-gray-500"
                                            )}>
                                                {item.label}
                                            </h4>
                                            <span className="text-[10px] text-gray-400">{formatRelativeTime(item.date)}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{item.by}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-400 ml-1">ШААРДЛАГАТАЙ БАРИМТУУД</h3>
                            <Badge variant="info" className="text-[10px]">{(application.requiredDocuments || []).length} БАРИМТ</Badge>
                        </div>
                        <div className="space-y-3">
                            {(application.requiredDocuments || []).map((doc: any) => (
                                <Card key={doc.id} variant="outlined" padding="md" className="group">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                                                doc.status === 'approved' ? "bg-green-50 text-green-600" :
                                                    doc.status === 'rejected' ? "bg-red-50 text-red-600" :
                                                        doc.status === 'pending' ? "bg-blue-50 text-blue-600" :
                                                            "bg-gray-50 text-gray-400"
                                            )}>
                                                {uploadingDocId === doc.id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    doc.status === 'approved' ? <CheckCircle2 className="w-5 h-5" /> :
                                                        doc.status === 'rejected' ? <XCircle className="w-5 h-5" /> :
                                                            doc.status === 'pending' ? <Clock className="w-5 h-5" /> :
                                                                <Upload className="w-5 h-5" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-gray-900 truncate">{doc.name}</h4>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                                                    {doc.status === 'approved' ? 'Зөвшөөрөгдсөн' :
                                                        doc.status === 'rejected' ? 'Татгалзсан' :
                                                            doc.status === 'pending' ? 'Хянагдаж буй' :
                                                                'Оруулаагүй'}
                                                </p>
                                            </div>
                                        </div>
                                        {doc.fileUrl ? (
                                            <div className="flex items-center gap-2">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-[10px] text-gray-400 font-medium truncate max-w-[100px]">{doc.fileName}</p>
                                                    <p className="text-[10px] text-gray-300">{formatRelativeTime(doc.uploadedAt)}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-9 h-9 p-0 bg-gray-50 hover:bg-gray-100 rounded-lg"
                                                    onClick={() => window.open(doc.fileUrl, '_blank')}
                                                >
                                                    <Paperclip className="w-4 h-4 text-gray-400" />
                                                </Button>
                                                {doc.status !== 'approved' && (
                                                    <Button variant="ghost" size="sm" className="w-9 h-9 p-0 hover:bg-gray-100 rounded-lg" onClick={() => handleFileSelect(doc.id)}>
                                                        <Upload className="w-4 h-4 text-gray-400" />
                                                    </Button>
                                                )}
                                            </div>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-9 px-4 rounded-lg font-bold"
                                                onClick={() => handleFileSelect(doc.id)}
                                                isLoading={uploadingDocId === doc.id}
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                Оруулах
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <Card variant="outlined" padding="lg" className="border-dashed border-2 bg-gray-50 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                <AlertCircle className="w-6 h-6 text-blue-500" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">Нэмэлт баримт оруулах уу?</h4>
                            <p className="text-xs text-gray-500 mb-4 px-6 leading-relaxed">
                                Хэрэв танд нэмэлт мэдээлэл өгөх баримт байгаа бол энд дарж оруулна уу
                            </p>
                            <Button variant="outline" className="bg-white border-blue-100 text-blue-600">
                                Баримт сонгох
                            </Button>
                        </Card>
                    </div>
                )}

                {activeTab === 'chat' && (
                    <div className="space-y-6 animate-fade-in flex flex-col h-[calc(100vh-280px)]">
                        <div className="flex-1 overflow-y-auto space-y-4 hide-scrollbar">
                            {(application.messages || []).map((msg: any, idx: number) => (
                                <div key={idx} className={cn(
                                    "flex items-start gap-2 max-w-[85%]",
                                    msg.senderRole === 'customer' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}>
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold",
                                        msg.senderRole === 'customer' ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                                    )}>
                                        {msg.senderName.charAt(0)}
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-2xl text-sm leading-relaxed",
                                        msg.senderRole === 'customer'
                                            ? "bg-blue-600 text-white rounded-tr-none"
                                            : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                                    )}>
                                        {msg.content}
                                        <p className={cn(
                                            "text-[10px] mt-1 opacity-60",
                                            msg.senderRole === 'customer' ? "text-right" : "text-left"
                                        )}>
                                            {formatRelativeTime(msg.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto">
                            <Input
                                placeholder="Менежерт мессеж бичих..."
                                rightIcon={
                                    <button className="p-1 hover:bg-blue-50 rounded-lg text-blue-600">
                                        <Send className="w-4 h-4" />
                                    </button>
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        </MobileLayout>
    );
}

