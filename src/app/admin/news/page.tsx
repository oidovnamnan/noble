// News Management Page (Admin)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, Button, Input, Badge } from '@/components/ui';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    Filter,
    Image as ImageIcon,
    Calendar,
    Pin,
    Database,
    Loader2
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function AdminNewsPage() {
    const { t, language } = useTranslation();
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!db) return;

        const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNews(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (!db) return;
        if (confirm('Та энэ мэдээг устгахдаа итгэлтэй байна уу?')) {
            await deleteDoc(doc(db, 'news', id));
        }
    };

    const togglePublish = async (id: string, currentStatus: boolean) => {
        if (!db) return;
        await updateDoc(doc(db, 'news', id), {
            isPublished: !currentStatus
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('admin.newsManagement')}</h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">{t('admin.news')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/seed-news" target="_blank">
                            <Button variant="outline" leftIcon={<Database className="w-4 h-4" />}>
                                Generate Sample News
                            </Button>
                        </Link>
                        <Button leftIcon={<Plus className="w-4 h-4" />}>{t('admin.addNews')}</Button>
                    </div>
                </div>

                {/* Filters */}
                <Card variant="outlined" padding="sm" className="bg-slate-50/50 border-slate-100">
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
                        <Button variant="outline" size="sm" className="bg-white" leftIcon={<Filter className="w-4 h-4" />}>{t('admin.filter')}</Button>
                    </div>
                </Card>

                {/* News Grid/List */}
                <div className="grid grid-cols-1 gap-4">
                    <Card variant="outlined" padding="none" className="overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        ) : news.length === 0 ? (
                            <div className="text-center py-20 px-4">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Database className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Мэдээлэл алга</h3>
                                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                                    Одоогоор ямар ч мэдээ оруулаагүй байна. Та "Generate Sample News" товч дээр дарж туршилтын өгөгдөл үүсгэх боломжтой.
                                </p>
                                <Link href="/seed-news" target="_blank">
                                    <Button>Өгөгдөл үүсгэх</Button>
                                </Link>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100/50">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-16">{t('admin.image')}</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.title')}</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-32">{t('admin.category')}</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-32">{t('admin.author')}</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-32">{t('admin.date')}</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-24">{t('admin.status')}</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-24">{t('admin.views')}</th>
                                        <th className="px-6 py-4 w-28"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {news.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300 overflow-hidden">
                                                    {item.coverImage ? (
                                                        <img src={item.coverImage} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-900 line-clamp-1 max-w-[200px]">
                                                            {item.title?.mn || item.title}
                                                        </span>
                                                        {item.isPinned && <Pin className="w-3 h-3 text-amber-500 fill-amber-500" />}
                                                    </div>
                                                    <span className="text-xs text-slate-400 font-medium max-w-[200px] truncate">{item.title?.en}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge variant="info" className="uppercase text-[9px] tracking-wider">
                                                    {item.category}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-xs font-bold text-slate-700">{item.author?.name}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(item.publishedAt?.toDate?.() || item.publishedAt || new Date()).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <button onClick={() => togglePublish(item.id, item.isPublished)}>
                                                    {item.isPublished ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10" />
                                                            <span className="text-xs font-bold text-emerald-600">{t('admin.published')}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                                                            <span className="text-xs font-bold text-slate-500">{t('admin.draft')}</span>
                                                        </div>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    {item.views}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                                    <button className="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-blue-600 transition-all"><Edit2 className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-red-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
