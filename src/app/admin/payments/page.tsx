'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, Button, Input, Badge, StatusBadge } from '@/components/ui';
import {
    Search,
    Filter,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Calendar,
    Wallet,
    TrendingUp,
    TrendingDown,
    Loader2
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';

export default function PaymentsPage() {
    const { t, language } = useTranslation();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPayments = async () => {
            if (!db) return;
            try {
                // In a real scenario, we might have a dedicated transactions collection
                // or we fetch from applications. For now, let's try to fetch a specific collection
                const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                if (data.length === 0) {
                    // Fallback to mock if collection is empty
                    setTransactions([
                        { id: 'TX-1001', customer: 'Б.Болд', amount: 350000, status: 'completed', type: 'service_fee', date: '2026-01-13 14:20', method: 'QPay' },
                        { id: 'TX-1002', customer: 'Д.Сараа', amount: 120000, status: 'completed', type: 'consultation', date: '2026-01-13 11:30', method: 'Transfer' },
                        { id: 'TX-1003', customer: 'Г.Тэмүүлэн', amount: 450000, status: 'pending', type: 'visa_fee', date: '2026-01-12 16:45', method: 'QPay' },
                        { id: 'TX-1004', customer: 'С.Ану', amount: 280000, status: 'failed', type: 'service_fee', date: '2026-01-12 09:15', method: 'QPay' },
                        { id: 'TX-1005', customer: 'О.Золбоо', amount: 1500000, status: 'completed', type: 'full_package', date: '2026-01-10 13:00', method: 'Card' },
                    ]);
                } else {
                    setTransactions(data);
                }
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const stats = [
        { label: 'Өнөөдрийн орлого', value: '₮1,250,000', trend: '+12%', icon: Wallet, color: 'bg-emerald-500' },
        { label: 'Энэ сарын нийт', value: '₮12,400,000', trend: '+18%', icon: TrendingUp, color: 'bg-blue-500' },
        { label: 'Хүлээгдэж буй', value: '₮850,000', trend: '-5%', icon: Calendar, color: 'bg-amber-500' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('admin.payments')}</h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">Гүйлгээний түүх болон санхүүгийн хяналт</p>
                    </div>
                    <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                        Тайлан татах
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={idx} variant="elevated" className="overflow-hidden group">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                        <h2 className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</h2>
                                    </div>
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", stat.color)}>
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
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Өмнөх үеэс</span>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Filters */}
                <Card variant="outlined" padding="sm" className="bg-slate-50/50">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[300px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Гүйлгээний дугаар эсвэл харилцагчаар хайх..."
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button variant="outline" className="bg-white" leftIcon={<Filter className="w-4 h-4" />}>Шүүлтүүр</Button>
                    </div>
                </Card>

                {/* Transactions Table */}
                <Card variant="outlined" padding="none" className="overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Гүйлгээний No</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Харилцагч</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Төрөл</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Дүн</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Арга</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Огноо</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Төлөв</th>
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
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-10 text-center text-slate-500">Гүйлгээ олдсонгүй.</td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-slate-900 font-mono">{tx.id}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {tx.customer?.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{tx.customer}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-slate-500 uppercase">{tx.type.replace('_', ' ')}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-slate-900">{formatCurrency(tx.amount)}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge variant="info" size="sm" className="bg-slate-100 text-slate-600 border-none font-bold">
                                                {tx.method}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs text-slate-400 font-medium">{tx.date}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge
                                                status={tx.status === 'completed' ? 'approved' : tx.status === 'failed' ? 'rejected' : 'pending'}
                                                label={tx.status === 'completed' ? 'Амжилттай' : tx.status === 'failed' ? 'Амжилтгүй' : 'Хүлээгдэж буй'}
                                            />
                                        </td>
                                        <td className="px-6 py-5">
                                            <button className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all text-slate-400 hover:text-blue-600">
                                                <ArrowUpRight className="w-4 h-4" />
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
