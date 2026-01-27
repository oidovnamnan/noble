// Admin Applications Management Page
'use client';

import React, { useState } from 'react';
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
    Plus
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

const mockApplications = [
    { id: '1', appNo: 'NOB-2026-0042', customer: 'Б.Болд', service: 'Япон оюутны виз', status: 'processing', date: '2026-01-13', staff: 'Менежер Сараа', progress: 70 },
    { id: '2', appNo: 'NOB-2026-0038', customer: 'Д.Сараа', service: 'Солонгос хэлний сургалт', status: 'documents_incomplete', date: '2026-01-12', staff: 'Менежер Болд', progress: 40 },
    { id: '3', appNo: 'NOB-2026-0035', customer: 'Г.Тэмүүлэн', service: 'Герман ажлын виз', status: 'pending', date: '2026-01-12', staff: 'Хуваарилаагүй', progress: 0 },
    { id: '4', appNo: 'NOB-2026-0032', customer: 'С.Ану', service: 'АНУ аялалын виз', status: 'payment_pending', date: '2026-01-11', staff: 'Менежер Сараа', progress: 10 },
    { id: '5', appNo: 'NOB-2026-0028', customer: 'О.Золбоо', service: 'Шенген виз', status: 'approved', date: '2026-01-10', staff: 'Менежер Болд', progress: 100 },
];

export default function AdminApplicationsPage() {
    const { t, language } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

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
                            <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10">
                                <option>{t('admin.all')}</option>
                            </select>
                        </div>
                        <Button variant="outline" className="bg-white min-w-[100px]" leftIcon={<Filter className="w-4 h-4" />}>{t('admin.filter')}</Button>
                    </div>
                </Card>

                {/* Stats Summary */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: 'ШИНЭ', count: 12, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'ЯВЦАД', count: 45, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'ДУТУУ', count: 8, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'БИЕЛСЭН', count: 124, color: 'text-purple-600', bg: 'bg-indigo-50' },
                    ].map((stat, idx) => (
                        <div key={idx} className={cn("p-4 rounded-2xl border border-transparent flex flex-col gap-1 items-center justify-center", stat.bg)}>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                            <span className={cn("text-2xl font-bold", stat.color)}>{stat.count}</span>
                        </div>
                    ))}
                </div>

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
                            {mockApplications.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-slate-900 font-mono">{app.appNo}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                                                {app.customer.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{app.customer}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm text-slate-500 font-medium">{app.service}</span>
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
                                            app.staff === 'Хуваарилаагүй' ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-600"
                                        )}>
                                            {app.staff === 'Хуваарилаагүй' ? (language === 'mn' ? 'Хуваарилаагүй' : 'Unassigned') : app.staff}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {app.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <button className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all text-slate-400 hover:text-blue-600">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                {/* Pagination placeholder */}
                <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0 opacity-50"><ChevronRight className="w-4 h-4 rotate-180" /></Button>
                    <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold">1</button>
                    <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-500">2</button>
                    <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-500">3</button>
                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0"><ChevronRight className="w-4 h-4" /></Button>
                </div>
            </div>
        </AdminLayout>
    );
}
