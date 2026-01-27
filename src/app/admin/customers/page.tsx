// Admin Customers Management Page
'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, Button, Input, Badge, StatusBadge } from '@/components/ui';
import {
    Search,
    Filter,
    UserPlus,
    Mail,
    Phone,
    Clock,
    ArrowUpRight,
    MoreVertical,
    CheckCircle2,
    FileText,
    CreditCard
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

const mockCustomers = [
    { id: '1', name: 'Батболд Болд', email: 'bold@example.com', phone: '88118822', appsCount: 2, totalPaid: 750000, joinedAt: '2026-01-05', status: 'active' },
    { id: '2', name: 'Дорж Сараа', email: 'saraa@example.com', phone: '99001122', appsCount: 1, totalPaid: 280000, joinedAt: '2026-01-08', status: 'active' },
    { id: '3', name: 'Ганболд Тэмүүлэн', email: 'temuulen@gmail.com', phone: '80556677', appsCount: 1, totalPaid: 0, joinedAt: '2026-01-12', status: 'pending' },
    { id: '4', name: 'Саруул Ану', email: 'anu@mail.mn', phone: '91912233', appsCount: 1, totalPaid: 450000, joinedAt: '2026-01-11', status: 'active' },
    { id: '5', name: 'Очир Золбоо', email: 'zolboo@example.mn', phone: '88889999', appsCount: 3, totalPaid: 1200000, joinedAt: '2025-12-20', status: 'active' },
];

export default function AdminCustomersPage() {
    const { t, language } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('admin.customers')}</h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">{t('admin.customerManagement')}</p>
                    </div>
                    <Button leftIcon={<UserPlus className="w-4 h-4" />}>
                        {language === 'mn' ? 'Шинэ хэрэглэгч нэмэх' : 'Add New Customer'}
                    </Button>
                </div>

                {/* Global Stats bar */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: t('admin.totalCustomers'), value: '1,250', icon: User, color: 'text-blue-600' },
                        { label: t('admin.active'), value: '1,120', icon: CheckCircle2, color: 'text-emerald-600' },
                        { label: t('admin.newPost'), value: '45', icon: Clock, color: 'text-amber-600' },
                        { label: t('admin.appsCount'), value: '3,420', icon: FileText, color: 'text-purple-600' },
                    ].map((stat, idx) => (
                        <Card key={idx} variant="outlined" padding="sm" className="bg-white/50 border-slate-100 flex items-center gap-4">
                            <div className={cn("w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center", stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-lg font-bold text-slate-900 leading-none mt-1">{stat.value}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <Card variant="outlined" padding="sm" className="bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder={t('admin.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                leftIcon={<Search className="w-4 h-4" />}
                                className="bg-white"
                            />
                        </div>
                        <Button variant="outline" className="bg-white" leftIcon={<Filter className="w-4 h-4" />}>{t('admin.filter')}</Button>
                    </div>
                </Card>

                {/* Customers Table */}
                <Card variant="outlined" padding="none" className="overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.customer')}</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.phone')} / {t('admin.email')}</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.applications')}</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.payment')}</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.date')}</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.status')}</th>
                                <th className="px-6 py-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {mockCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{customer.name}</p>
                                                <p className="text-xs text-slate-400 font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">ID: {customer.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                {customer.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                {customer.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="info" className="font-bold">{customer.appsCount}</Badge>
                                            <span className="text-xs text-slate-400 font-medium">
                                                {language === 'mn' ? 'хүсэлт' : 'apps'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-sm font-bold text-slate-700">{formatCurrency(customer.totalPaid)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs text-slate-500 font-medium">{customer.joinedAt}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <StatusBadge
                                            status={customer.status === 'active' ? 'approved' : 'pending'}
                                            label={customer.status === 'active' ? t('admin.active') : t('status.pending')}
                                        />
                                    </td>
                                    <td className="px-6 py-5">
                                        <button className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all text-slate-400 hover:text-blue-600">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </AdminLayout>
    );
}

// Fixed Lucide user icon
import { User } from 'lucide-react';
