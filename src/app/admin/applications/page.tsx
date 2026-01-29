'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, Button, Input, Badge, StatusBadge } from '@/components/ui';
import {
    Search,
    Filter,
    ArrowUpRight,
    MoreVertical,
    Download,
    Calendar,
    User,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronRight,
    Plus,
    Loader2
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export default function AdminApplicationsPage() {
    const { t, language } = useTranslation();
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            if (!db) return;
            try {
                const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setApplications(data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const filteredApplications = applications.filter(app =>
        (app.applicationNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.serviceName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('admin.applications')}</h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">{t('admin.appManagement')}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                            {language === 'mn' ? 'Экспорт' : 'Export'}
                        </Button>
                        <Button leftIcon={<Plus className="w-4 h-4" />}>
                            {language === 'mn' ? 'Шинэ хүсэлт нэмэх' : 'Add New App'}
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card variant="outlined" padding="sm" className="bg-slate-50/50">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[300px]">
                            <Input
                                placeholder={t('admin.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                leftIcon={<Search className="w-4 h-4" />}
                                className="bg-white"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10">
                                <option>Бүх төрөл</option>
                                <option>Боловсрол</option>
                                <option>Аялал</option>
                                <option>Ажиллах</option>
                            </select>
                        </div>
                        <Button variant="outline" className="bg-white min-w-[100px]" leftIcon={<Filter className="w-4 h-4" />}>{t('admin.filter')}</Button>
                    </div>
                </Card>

                {/* Applications List */}
                <Card variant="outlined" padding="none" className="overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('applications.applicationNumber')}</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.customer')}</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.service')}</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.status')}</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.progress')}</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('applications.assignedStaff')}</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.date')}</th>
                                <th className="px-6 py-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-10 text-center">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-10 text-center text-slate-500">Мэдээлэл олдсонгүй.</td>
                                </tr>
                            ) : (
                                filteredApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-slate-900 font-mono">{app.applicationNumber}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                                                    {app.customerName?.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{app.customerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm text-slate-500 font-medium">{app.serviceName}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={app.status} label={t(`status.${app.status}`)} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3 min-w-[120px]">
                                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-500",
                                                            app.progress === 100 ? "bg-emerald-500" : "bg-blue-500"
                                                        )}
                                                        style={{ width: `${app.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-slate-400 w-8 text-right">{app.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={cn(
                                                "text-xs font-bold px-2 py-1 rounded-lg",
                                                !app.assignedStaffName ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-600"
                                            )}>
                                                {app.assignedStaffName || (language === 'mn' ? 'Хуваарилаагүй' : 'Unassigned')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium whitespace-nowrap">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {app.createdAt?.toDate ? formatDate(app.createdAt.toDate()) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <button className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all text-slate-400 hover:text-blue-600">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </Card>
            </div>
        </AdminLayout>
    );
}
