'use client';

import React, { useState, useEffect } from 'react';
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
    CreditCard,
    User as UserIcon,
    Loader2
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export default function AdminCustomersPage() {
    const { t, language } = useTranslation();
    const [customers, setCustomers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            if (!db) return;
            try {
                const q = query(
                    collection(db, 'users'),
                    where('role', '==', 'customer'),
                    orderBy('createdAt', 'desc')
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCustomers(data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone || '').includes(searchQuery)
    );

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: t('admin.totalCustomers'), value: customers.length.toString(), icon: UserIcon, color: 'text-blue-600' },
                        { label: t('admin.active'), value: customers.length.toString(), icon: CheckCircle2, color: 'text-emerald-600' },
                        { label: 'ШИНЭ', value: '45', icon: Clock, color: 'text-amber-600' },
                        { label: 'ХҮСЭЛТҮҮД', value: '3,420', icon: FileText, color: 'text-purple-600' },
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-slate-500">Мэдээлэл олдсонгүй.</td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                    {customer.lastName?.charAt(0) || customer.firstName?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{customer.lastName} {customer.firstName}</p>
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
                                                    {customer.phone || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="info" className="font-bold">{customer.appsCount || 0}</Badge>
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {language === 'mn' ? 'хүсэлт' : 'apps'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                                                <span className="text-sm font-bold text-slate-700">{formatCurrency(customer.totalPaid || 0)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs text-slate-500 font-medium">{customer.createdAt?.toDate ? formatDate(customer.createdAt.toDate()) : 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge
                                                status={customer.status === 'active' || true ? 'approved' : 'pending'}
                                                label={customer.status === 'active' || true ? t('admin.active') : t('status.pending')}
                                            />
                                        </td>
                                        <td className="px-6 py-5">
                                            <button className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all text-slate-400 hover:text-blue-600">
                                                <MoreVertical className="w-4 h-4" />
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
