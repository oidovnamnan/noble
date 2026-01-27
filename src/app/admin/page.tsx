// Admin Dashboard Page
'use client';

import React from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, Button, Badge, StatusBadge } from '@/components/ui';
import {
    Users,
    FileText,
    Clock,
    TrendingUp,
    ArrowUpRight,
    ChevronRight,
    Plus,
    Mail,
    User
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

export default function AdminDashboard() {
    const { t } = useTranslation();

    const stats = [
        { label: t('admin.totalCustomers'), value: '1,250', icon: Users, color: 'bg-blue-500', trend: '+12%' },
        { label: t('admin.activeApplications'), value: '84', icon: FileText, color: 'bg-emerald-500', trend: '+5%' },
        { label: t('admin.pendingDocuments'), value: '12', icon: Clock, color: 'bg-amber-500', trend: '-2%' },
        { label: t('admin.monthlyRevenue'), value: '₮12.4M', icon: TrendingUp, color: 'bg-purple-500', trend: '+18%' },
    ];

    const resentApplications = [
        { id: '1', customer: 'Б.Болд', service: 'Япон оюутны виз', status: 'processing', date: '2026-01-13' },
        { id: '2', customer: 'Д.Сараа', service: 'Солонгос хэлний сургалт', status: 'documents_incomplete', date: '2026-01-12' },
        { id: '3', customer: 'Г.Тэмүүлэн', service: 'Герман ажлын виз', status: 'pending', date: '2026-01-12' },
        { id: '4', customer: 'С.Ану', service: 'АНУ аялалын виз', status: 'payment_pending', date: '2026-01-11' },
        { id: '5', customer: 'О.Золбоо', service: 'Шенген виз', status: 'approved', date: '2026-01-10' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('admin.dashboard')}</h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">{t('admin.systemOverviewToday')}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="bg-white">{t('admin.downloadReport')}</Button>
                        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>{t('admin.newApplication')}</Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={idx} variant="elevated" className="overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                        <h2 className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</h2>
                                    </div>
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20", stat.color)}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className={cn(
                                        "text-xs font-bold px-1.5 py-0.5 rounded-md",
                                        stat.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                    )}>
                                        {stat.trend}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{t('admin.sinceLastMonth')}</span>
                                </div>
                                {/* Decoration background */}
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Applications Table */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{t('admin.recentApplications')}</h3>
                            <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>{t('common.viewAll')}</Button>
                        </div>
                        <Card variant="outlined" padding="none" className="overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('roles.customer')}</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('nav.services')}</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('applications.status')}</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('applications.createdAt')}</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {resentApplications.map((app) => (
                                        <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                        {app.customer.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">{app.customer}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-500 font-medium">{app.service}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={app.status} label={t(`status.${app.status}`)} />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400 font-medium">
                                                {app.date}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all text-slate-400 hover:text-blue-600">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>

                    {/* Activity / Staff Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">{t('admin.activeStaff')}</h3>
                        <Card variant="outlined" padding="none" className="overflow-hidden">
                            <div className="divide-y divide-slate-50">
                                {[
                                    { name: 'Б.Болд', role: t('roles.seniorManager'), color: 'bg-emerald-500', apps: 15 },
                                    { name: 'Д.Сараа', role: t('roles.visaSpecialist'), color: 'bg-blue-500', apps: 12 },
                                    { name: 'Г.Чинзориг', role: t('roles.consultant'), color: 'bg-purple-500', apps: 8 },
                                    { name: 'О.Мишээл', role: t('roles.admin'), color: 'bg-amber-500', apps: 2 },
                                ].map((staff, idx) => (
                                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                                    {staff.name.charAt(0)}
                                                </div>
                                                <span className={cn("absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white", staff.color)} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{staff.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{staff.role}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-900">{staff.apps}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{t('admin.appsCount')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-slate-50 text-center">
                                <Link href="/admin/staff" className="text-xs font-bold text-blue-600 hover:underline">{t('common.viewAll')}</Link>
                            </div>
                        </Card>

                        {/* Quick Action Card */}
                        <Card variant="elevated" className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none space-y-4 shadow-blue-500/30">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Plus className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold">{t('admin.quickActions')}</h4>
                                <p className="text-xs text-blue-100 mt-1">{t('admin.quickActionDesc')}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="ghost" size="sm" className="bg-white/10 text-white hover:bg-white/20 border-none font-bold text-[10px]">{t('admin.notification')}</Button>
                                <Button variant="ghost" size="sm" className="bg-white/10 text-white hover:bg-white/20 border-none font-bold text-[10px]">{t('admin.newPost')}</Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

