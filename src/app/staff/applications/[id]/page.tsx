// Staff Application Review Page
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
    MessageSquare,
    Download,
    MoreVertical,
    History,
    Send,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import { Card, Button, Input, StatusBadge, Badge } from '@/components/ui';
import { cn, formatRelativeTime } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { db } from '@/lib/firebase/config';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAuthStore } from '@/lib/store';

export default function StaffApplicationReview() {
    const { t, language } = useTranslation();
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'docs' | 'chat' | 'history'>('docs');
    const [saving, setSaving] = useState(false);

    const id = params.id as string;

    useEffect(() => {
        if (!db || !id) return;

        const unsubscribe = onSnapshot(doc(db, 'applications', id), (doc) => {
            if (doc.exists()) {
                setApplication({ id: doc.id, ...doc.data() });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id]);

    const handleDocAction = async (docId: string, status: 'approved' | 'rejected', comment: string = '') => {
        if (!application || !db) return;

        const updatedDocs = application.requiredDocuments.map((d: any) => {
            if (d.id === docId) {
                return { ...d, status, comment };
            }
            return d;
        });

        try {
            await updateDoc(doc(db, 'applications', application.id), {
                requiredDocuments: updatedDocs,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating document status:', error);
            alert(language === 'mn' ? 'Баримтын төлөв өөрчлөхөд алдаа гарлаа' : 'Error updating document status');
        }
    };

    const handleAppStatusChange = async (newStatus: string) => {
        if (!application || !db) return;
        setSaving(true);
        try {
            await updateDoc(doc(db, 'applications', application.id), {
                status: newStatus,
                updatedAt: new Date().toISOString(),
                statusHistory: arrayUnion({
                    status: newStatus,
                    label: language === 'mn' ? `Төлөв өөрчлөгдсөн: ${t(`status.${newStatus}`)}` : `Status changed to: ${t(`status.${newStatus}`)}`,
                    date: new Date().toISOString(),
                    by: user?.firstName || (language === 'mn' ? 'Менежер' : 'Manager')
                })
            });
        } catch (error) {
            console.error('Error updating application status:', error);
            alert(language === 'mn' ? 'Хүсэлтийн төлөв өөрчлөхөд алдаа гарлаа' : 'Error updating application status');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!application) {
        return (
            <div className="p-8 text-center bg-slate-50 min-h-screen">
                <p className="text-slate-500">{t('common.noData')}</p>
                <Button onClick={() => router.push('/staff')} className="mt-4">
                    {t('common.back')}
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="h-8 w-[1px] bg-slate-100 hidden sm:block" />
                    <div>
                        <h1 className="text-sm font-bold text-slate-900">{application.customerName}</h1>
                        <p className="text-[10px] text-slate-400 font-bold tracking-widest">{application.applicationNumber} • {application.serviceName}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none"
                        value={application.status}
                        onChange={(e) => handleAppStatusChange(e.target.value)}
                        disabled={saving}
                    >
                        <option value="pending">{t('status.pending').toUpperCase()}</option>
                        <option value="processing">{t('status.processing').toUpperCase()}</option>
                        <option value="approved">{t('status.approved').toUpperCase()}</option>
                        <option value="rejected">{t('status.rejected').toUpperCase()}</option>
                        <option value="completed">{t('status.completed').toUpperCase()}</option>
                    </select>
                    <Button size="sm" className="hidden sm:flex" isLoading={saving}>{t('common.save')}</Button>
                    <button className="p-2 hover:bg-slate-50 rounded-xl">
                        <MoreVertical className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Left Side: Document List */}
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
                        <button
                            onClick={() => setActiveTab('docs')}
                            className={cn("px-6 py-2 rounded-lg text-xs font-bold transition-all", activeTab === 'docs' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}
                        >
                            {t('applications.documents').toUpperCase()}
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={cn("px-6 py-2 rounded-lg text-xs font-bold transition-all", activeTab === 'chat' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}
                        >
                            {t('nav.chat').toUpperCase()}
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={cn("px-6 py-2 rounded-lg text-xs font-bold transition-all", activeTab === 'history' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}
                        >
                            {t('applications.history').toUpperCase()}
                        </button>
                    </div>

                    {activeTab === 'docs' && (
                        <div className="space-y-4 animate-fade-in pb-12">
                            {(application.requiredDocuments || []).map((doc: any) => (
                                <Card key={doc.id} variant="outlined" padding="none" className="overflow-hidden">
                                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center",
                                                doc.status === 'approved' ? "bg-green-50 text-green-600" :
                                                    doc.status === 'rejected' ? "bg-red-50 text-red-600" :
                                                        "bg-slate-50 text-slate-400"
                                            )}>
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800">{doc.name}</h4>
                                                {doc.fileUrl ? (
                                                    <p
                                                        className="text-xs text-blue-600 font-medium cursor-pointer hover:underline flex items-center gap-1"
                                                        onClick={() => window.open(doc.fileUrl, '_blank')}
                                                    >
                                                        <Download className="w-3 h-3" /> {doc.fileName}
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-slate-400 font-medium">{t('common.noData')}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className={cn("h-9 font-bold px-4", doc.status === 'approved' ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "text-slate-400 hover:bg-slate-100")}
                                                onClick={() => handleDocAction(doc.id, 'approved')}
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-2" /> {t('common.approve')}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className={cn("h-9 font-bold px-4 text-red-500", doc.status === 'rejected' ? "bg-red-50 hover:bg-red-100" : "text-slate-400 hover:bg-slate-100")}
                                                onClick={() => {
                                                    const reason = prompt(language === 'mn' ? 'Татгалзсан шалтгаан (заавал биш):' : 'Rejection reason (optional):');
                                                    handleDocAction(doc.id, 'rejected', reason || '');
                                                }}
                                            >
                                                <XCircle className="w-4 h-4 mr-2" /> {t('common.reject')}
                                            </Button>
                                        </div>
                                    </div>
                                    {doc.comment && (
                                        <div className="px-4 py-3 bg-red-50 border-t border-red-100 flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                            <p className="text-xs text-red-600 font-medium">{doc.comment}</p>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <div className="h-[calc(100vh-250px)] flex flex-col animate-fade-in">
                            <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 space-y-4 overflow-y-auto">
                                {(application.messages || []).map((msg: any, idx: number) => (
                                    <div key={idx} className={cn(
                                        "flex items-start gap-3 max-w-[80%]",
                                        msg.senderRole === 'staff' ? "ml-auto flex-row-reverse" : ""
                                    )}>
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs",
                                            msg.senderRole === 'staff' ? "bg-slate-900 text-white" : "bg-blue-100 text-blue-600"
                                        )}>
                                            {msg.senderName.charAt(0)}
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded-2xl text-sm",
                                            msg.senderRole === 'staff' ? "bg-slate-900 text-white rounded-tr-none" : "bg-slate-100 text-slate-700 rounded-tl-none"
                                        )}>
                                            {msg.content}
                                            <p className={cn("text-[10px] mt-1 opacity-60", msg.senderRole === 'staff' ? "text-right" : "text-left")}>
                                                {formatRelativeTime(msg.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Input
                                    placeholder={language === 'mn' ? 'Мессеж бичих...' : 'Type a message...'}
                                    className="bg-white"
                                />
                                <Button className="h-11 w-11 p-0"><Send className="w-5 h-5" /></Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-fade-in">
                            <div className="divide-y divide-slate-100">
                                {(application.statusHistory || []).slice().reverse().map((item: any, idx: number) => (
                                    <div key={idx} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                <History className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{item.label}</p>
                                                <p className="text-xs text-slate-400">{item.by}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-400 font-medium">{formatRelativeTime(item.date)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Quick Action / Summary */}
                <aside className="w-full lg:w-80 border-l border-slate-100 p-6 space-y-6 bg-white/50 overflow-y-auto">
                    <section className="space-y-4">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.customer')}</h3>
                        <Card variant="outlined" padding="md" className="bg-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                    {(application.customerName || 'B').charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{application.customerName}</h4>
                                    <p className="text-xs text-slate-500 font-medium">ID: {application.customerId?.substring(0, 8)}...</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">{t('applications.viewProfile')}</Button>
                        </Card>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('applications.paymentStatus')}</h3>
                        <Card variant="outlined" padding="md" className={cn(
                            "bg-white border-2",
                            application.payment?.status === 'paid' ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
                        )}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={cn(
                                    "text-xs font-bold uppercase",
                                    application.payment?.status === 'paid' ? "text-emerald-600" : "text-amber-600"
                                )}>
                                    {application.payment?.status === 'paid' ? t('status.paid').toUpperCase() : t('status.payment_pending').toUpperCase()}
                                </span>
                                <Badge variant={application.payment?.status === 'paid' ? 'success' : 'warning'} size="sm">
                                    ₮{application.payment?.totalAmount?.toLocaleString()}
                                </Badge>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold">{application.payment?.updatedAt ? formatRelativeTime(application.payment.updatedAt) : t('status.pending')}</p>
                        </Card>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('applications.notes')}</h3>
                        <textarea
                            className="w-full h-32 p-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-300 font-medium"
                            placeholder={language === 'mn' ? 'Зөвхөн ажилтнууд харах тэмдэглэл...' : 'Internal notes (staff only)...'}
                            defaultValue={application.internalNotes}
                            onBlur={async (e) => {
                                if (!application || !db) return;
                                await updateDoc(doc(db, 'applications', application.id), {
                                    internalNotes: e.target.value
                                });
                            }}
                        ></textarea>
                    </section>
                </aside>
            </div>
        </div>
    );
}
