// Staff Dashboard / Assigned Applications Page
'use client';

import React, { useState } from 'react';
import {
    Search,
    Filter,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    MessageSquare,
    ChevronRight,
    User,
    LayoutDashboard,
    LogOut,
    Bell
} from 'lucide-react';
import { Card, Button, Input, StatusBadge, Badge } from '@/components/ui';
import { cn, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

const mockAssignedApps = [
    { id: '1', appNo: 'NOB-2026-0042', customer: 'Б.Болд', service: 'Япон оюутны виз', status: 'processing', updated: new Date('2026-01-13T10:30:00'), unread: true },
    { id: '2', appNo: 'NOB-2026-0038', customer: 'Д.Сараа', service: 'Солонгос хэлний сургалт', status: 'documents_incomplete', updated: new Date('2026-01-13T09:15:00'), unread: false },
    { id: '4', appNo: 'NOB-2026-0032', customer: 'С.Ану', service: 'АНУ аялалын виз', status: 'payment_pending', updated: new Date('2026-01-12T16:45:00'), unread: false },
    { id: '6', appNo: 'NOB-2026-0025', customer: 'Ж.Гантуяа', service: 'Европ аялалын виз', status: 'documents_pending', updated: new Date('2026-01-12T14:20:00'), unread: true },
];

export default function StaffDashboard() {
    const { t, language } = useTranslation();
    const [search, setSearch] = useState('');

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Mini Sidebar for Desktop Staff */}
            <aside className="hidden md:flex w-20 bg-white border-r border-slate-200 flex-col items-center py-8 gap-8">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">N</div>
                <nav className="flex flex-col gap-4">
                    <button className="p-3 bg-blue-50 text-blue-600 rounded-xl"><LayoutDashboard className="w-6 h-6" /></button>
                    <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-xl"><FileText className="w-6 h-6" /></button>
                    <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-xl"><MessageSquare className="w-6 h-6" /></button>
                    <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-xl"><Bell className="w-6 h-6" /></button>
                </nav>
                <button className="mt-auto p-3 text-slate-400 hover:text-red-500 rounded-xl"><LogOut className="w-6 h-6" /></button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="md:hidden w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
                        <h1 className="text-lg font-bold text-slate-900">{t('admin.recent_applications')}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-slate-400 hidden sm:block">МЕНЕЖЕР САРАА</span>
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                            <div className="w-full h-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">S</div>
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-8 space-y-6">
                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card variant="outlined" padding="md" className="bg-white">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.all')}</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">12</h3>
                        </Card>
                        <Card variant="outlined" padding="md" className="bg-white">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('status.processing')}</p>
                            <h3 className="text-2xl font-bold text-blue-600 mt-1">5</h3>
                        </Card>
                        <Card variant="outlined" padding="md" className="bg-white">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('status.documents_incomplete')}</p>
                            <h3 className="text-2xl font-bold text-amber-500 mt-1">3</h3>
                        </Card>
                        <Card variant="outlined" padding="md" className="bg-white">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.notification')}</p>
                            <h3 className="text-2xl font-bold text-red-500 mt-1">4</h3>
                        </Card>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder={t('admin.searchPlaceholder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                leftIcon={<Search className="w-4 h-4" />}
                                className="bg-white"
                            />
                        </div>
                        <Button variant="outline" className="bg-white" leftIcon={<Filter className="w-4 h-4" />}>{t('admin.filter')}</Button>
                    </div>

                    {/* Apps List */}
                    <div className="space-y-3">
                        {mockAssignedApps.map((app) => (
                            <Link key={app.id} href={`/staff/applications/${app.id}`}>
                                <Card variant="elevated" padding="none" className="hover:shadow-lg transition-all border border-transparent hover:border-blue-100 group">
                                    <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="flex-1 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-slate-900 truncate">{app.customer}</h4>
                                                    {app.unread && <Badge variant="error" size="sm" className="h-2 w-2 p-0 rounded-full animate-pulse" />}
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium">{app.service} • <span className="font-mono">{app.appNo}</span></p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-6">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{t('admin.date')}</p>
                                                <p className="text-xs font-semibold text-slate-600">{formatRelativeTime(app.updated)}</p>
                                            </div>
                                            <StatusBadge status={app.status} label={t(`status.${app.status}`)} className="w-32" />
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-all font-bold" />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
