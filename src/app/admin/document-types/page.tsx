'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    FileText,
    CheckCircle2,
    XCircle,
    Info,
    AlertCircle,
    X,
    Loader2
} from 'lucide-react';
import { Card, Button, Input, Badge } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentType {
    id: string;
    name: { mn: string; en: string };
    description: { mn: string; en: string };
    isRequiredByDefault: boolean;
    allowedExtensions: string[];
    maxSizeMB: number;
}

export default function AdminDocumentTypes() {
    const { t, language } = useTranslation();
    const [docTypes, setDocTypes] = useState<DocumentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<DocumentType, 'id'>>({
        name: { mn: '', en: '' },
        description: { mn: '', en: '' },
        isRequiredByDefault: false,
        allowedExtensions: ['pdf', 'jpg', 'png'],
        maxSizeMB: 5
    });

    useEffect(() => {
        if (!db) return;

        const q = query(collection(db, 'documentTypes'), orderBy('name.mn', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const typesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as DocumentType));
            setDocTypes(typesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredTypes = docTypes.filter(type =>
        type.name[language]?.toLowerCase().includes(search.toLowerCase()) ||
        type.description[language]?.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenModal = (type?: DocumentType) => {
        if (type) {
            setEditingId(type.id);
            setFormData({
                name: type.name,
                description: type.description,
                isRequiredByDefault: type.isRequiredByDefault,
                allowedExtensions: type.allowedExtensions,
                maxSizeMB: type.maxSizeMB
            });
        } else {
            setEditingId(null);
            setFormData({
                name: { mn: '', en: '' },
                description: { mn: '', en: '' },
                isRequiredByDefault: false,
                allowedExtensions: ['pdf', 'jpg', 'png'],
                maxSizeMB: 5
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!db) return;
        setSaving(true);

        try {
            if (editingId) {
                await updateDoc(doc(db, 'documentTypes', editingId), formData);
            } else {
                await addDoc(collection(db, 'documentTypes'), formData);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving document type:', error);
            alert('Алдаа гарлаа. Дахин оролдоно уу.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!db || !confirm('Та энэ төрлийг устгахдаа итгэлтэй байна уу?')) return;
        try {
            await deleteDoc(doc(db, 'documentTypes', id));
        } catch (error) {
            console.error('Error deleting document type:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('admin.documentTypes')}</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage master list of required documents</p>
                </div>
                <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => handleOpenModal()}>
                    {t('admin.addDocType') || 'Add Doc Type'}
                </Button>
            </div>

            <Card padding="md" className="bg-white/50 border-slate-200">
                <div className="flex-1">
                    <Input
                        placeholder={t('admin.searchPlaceholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                        className="bg-white"
                    />
                </div>
            </Card>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Name</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Rules</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={4} className="px-6 py-4"><div className="h-10 bg-slate-50 rounded-lg w-full" /></td>
                                </tr>
                            ))
                        ) : filteredTypes.length > 0 ? (
                            filteredTypes.map((type, idx) => (
                                <motion.tr
                                    key={type.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-slate-50/50 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{type.name[language]}</p>
                                                {type.isRequiredByDefault && (
                                                    <Badge variant="warning" size="sm" className="mt-1">REQUIRED BY DEFAULT</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="text-xs text-slate-500 font-medium line-clamp-2">
                                            {type.description[language]}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="info" size="sm" className="bg-blue-50 text-blue-600 border-none">
                                                {type.allowedExtensions.join(', ')}
                                            </Badge>
                                            <Badge variant="info" size="sm" className="bg-slate-50 text-slate-600 border-none">
                                                MAX {type.maxSizeMB}MB
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(type)}
                                                className="p-2 hover:bg-white hover:shadow-md rounded-xl text-slate-400 hover:text-blue-600 transition-all"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(type.id)}
                                                className="p-2 hover:bg-white hover:shadow-md rounded-xl text-slate-400 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center">
                                    <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-slate-900 font-bold">No document types found</h3>
                                    <p className="text-slate-500 text-sm">Create a master list of documents to use in services.</p>
                                    <Button className="mt-6" variant="outline" leftIcon={<Plus className="w-4 h-4" />} onClick={() => handleOpenModal()}>
                                        Add New Type
                                    </Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="w-full max-w-lg"
                        >
                            <Card className="bg-white shadow-2xl my-8">
                                <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {editingId ? 'Edit Document Type' : 'Add New Document Type'}
                                    </h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleSave} className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Name (MN)</label>
                                            <Input
                                                required
                                                value={formData.name.mn}
                                                onChange={(e) => setFormData({ ...formData, name: { ...formData.name, mn: e.target.value } })}
                                                placeholder="Жишээ: Иргэний үнэмлэх"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Name (EN)</label>
                                            <Input
                                                required
                                                value={formData.name.en}
                                                onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                                                placeholder="e.g., ID Card"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description (MN)</label>
                                        <textarea
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 min-h-[80px]"
                                            value={formData.description.mn}
                                            onChange={(e) => setFormData({ ...formData, description: { ...formData.description, mn: e.target.value } })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description (EN)</label>
                                        <textarea
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 min-h-[80px]"
                                            value={formData.description.en}
                                            onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Max Size (MB)</label>
                                            <Input
                                                type="number"
                                                value={formData.maxSizeMB}
                                                onChange={(e) => setFormData({ ...formData, maxSizeMB: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 pt-8">
                                            <input
                                                type="checkbox"
                                                id="isRequired"
                                                checked={formData.isRequiredByDefault}
                                                onChange={(e) => setFormData({ ...formData, isRequiredByDefault: e.target.checked })}
                                                className="w-4 h-4 text-blue-600 rounded"
                                            />
                                            <label htmlFor="isRequired" className="text-sm font-bold text-slate-600">Required by default</label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-6">
                                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                        <Button type="submit" isLoading={saving}>
                                            {editingId ? 'Update' : 'Create'}
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
