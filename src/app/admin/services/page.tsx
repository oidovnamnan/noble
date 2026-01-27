'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    MoreVertical,
    ChevronRight,
    FileText,
    Globe,
    Clock,
    DollarSign,
    CheckCircle2,
    XCircle,
    X,
    Loader2
} from 'lucide-react';
import { Card, Button, Input, Badge } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Service {
    id: string;
    name: { mn: string; en: string };
    description: { mn: string; en: string };
    category: string;
    baseFee: number;
    processingTime: string;
    isActive: boolean;
    displayOrder: number;
    requiredDocuments: string[]; // Array of document type IDs
    steps: { order: number; title: { mn: string; en: string }; description: { mn: string; en: string } }[];
}

interface DocumentType {
    id: string;
    name: { mn: string; en: string };
}

export default function AdminServices() {
    const { t, language } = useTranslation();
    const [services, setServices] = useState<Service[]>([]);
    const [docTypes, setDocTypes] = useState<DocumentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Service, 'id'>>({
        name: { mn: '', en: '' },
        description: { mn: '', en: '' },
        category: 'visa',
        baseFee: 0,
        processingTime: '',
        isActive: true,
        displayOrder: 0,
        requiredDocuments: [],
        steps: []
    });

    useEffect(() => {
        if (!db) return;

        const q = query(collection(db, 'services'), orderBy('displayOrder', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const servicesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Service));
            setServices(servicesData);
            setLoading(false);
        });

        // Fetch doc types for mapping
        const qDocs = query(collection(db, 'documentTypes'), orderBy('name.mn', 'asc'));
        const unsubscribeDocs = onSnapshot(qDocs, (snapshot) => {
            const docsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as DocumentType));
            setDocTypes(docsData);
        });

        return () => {
            unsubscribe();
            unsubscribeDocs();
        };
    }, []);

    const categories = ['all', 'education', 'travel', 'work', 'visa'];

    const filteredServices = services.filter(service => {
        const matchesSearch = service.name[language]?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleOpenModal = (service?: Service) => {
        if (service) {
            setEditingId(service.id);
            setFormData({
                name: service.name,
                description: service.description,
                category: service.category,
                baseFee: service.baseFee,
                processingTime: service.processingTime,
                isActive: service.isActive,
                displayOrder: service.displayOrder,
                requiredDocuments: service.requiredDocuments || [],
                steps: service.steps || []
            });
        } else {
            setEditingId(null);
            setFormData({
                name: { mn: '', en: '' },
                description: { mn: '', en: '' },
                category: 'visa',
                baseFee: 0,
                processingTime: '',
                isActive: true,
                displayOrder: services.length,
                requiredDocuments: [],
                steps: []
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
                await updateDoc(doc(db, 'services', editingId), formData);
            } else {
                await addDoc(collection(db, 'services'), formData);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving service:', error);
            alert('Алдаа гарлаа.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!db || !confirm('Устгахдаа итгэлтэй байна уу?')) return;
        try {
            await deleteDoc(doc(db, 'services', id));
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('admin.services')}</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage service offerings and requirements</p>
                </div>
                <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => handleOpenModal()}>
                    {t('admin.addService') || 'Add Service'}
                </Button>
            </div>

            <Card padding="md" className="bg-white/50 border-slate-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder={t('admin.searchPlaceholder')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                            className="bg-white"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border",
                                    selectedCategory === cat
                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                                )}
                            >
                                {cat.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <Card key={i} className="h-48 animate-pulse bg-slate-100" />
                    ))
                ) : filteredServices.length > 0 ? (
                    filteredServices.map((service, idx) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card variant="outlined" padding="none" className="bg-white overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-blue-200 h-full">
                                <div className="p-5 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            <Globe className="w-6 h-6" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={service.isActive ? 'success' : 'default'} size="sm">
                                                {service.isActive ? 'ACTIVE' : 'INACTIVE'}
                                            </Badge>
                                            <button
                                                onClick={() => handleOpenModal(service)}
                                                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <MoreVertical className="w-4 h-4 text-slate-400" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {service.name[language]}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">
                                            {service.description[language]}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                <DollarSign className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fee</p>
                                                <p className="text-xs font-bold text-slate-700">₮{service.baseFee.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</p>
                                                <p className="text-xs font-bold text-slate-700">{service.processingTime}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                            <FileText className="w-3 h-3 text-blue-500" />
                                            {service.requiredDocuments?.length || 0} Required Docs
                                        </p>
                                        <Button
                                            onClick={() => handleOpenModal(service)}
                                            size="sm" variant="ghost" className="text-blue-600 p-0 h-auto hover:bg-transparent" rightIcon={<ChevronRight className="w-4 h-4" />}
                                        >
                                            Manage
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Filter className="w-8 h-8" />
                        </div>
                        <h3 className="text-slate-900 font-bold">No services found</h3>
                        <p className="text-slate-500 text-sm">Try adjusting your filters or add a new service.</p>
                        <Button className="mt-6" variant="outline" leftIcon={<Plus className="w-4 h-4" />} onClick={() => handleOpenModal()}>
                            Create First Service
                        </Button>
                    </div>
                )}
            </motion.div>

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
                            className="w-full max-w-4xl"
                        >
                            <Card className="bg-white shadow-2xl my-8">
                                <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {editingId ? 'Edit Service' : 'Add New Service'}
                                    </h2>
                                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleSave} className="p-6 space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-blue-600 border-b border-blue-100 pb-2">BASIC INFORMATION</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Name (MN)</label>
                                                <Input
                                                    required
                                                    value={formData.name.mn}
                                                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, mn: e.target.value } })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Name (EN)</label>
                                                <Input
                                                    required
                                                    value={formData.name.en}
                                                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                                                <select
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                >
                                                    <option value="education">Education</option>
                                                    <option value="travel">Travel</option>
                                                    <option value="work">Work</option>
                                                    <option value="visa">Visa</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fee (MNT)</label>
                                                <Input
                                                    type="number"
                                                    value={formData.baseFee}
                                                    onChange={(e) => setFormData({ ...formData, baseFee: Number(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-blue-600 border-b border-blue-100 pb-2">REQUIRED DOCUMENTS</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-xl">
                                            {docTypes.map(type => (
                                                <label key={type.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.requiredDocuments.includes(type.id)}
                                                        onChange={(e) => {
                                                            const newDocs = e.target.checked
                                                                ? [...formData.requiredDocuments, type.id]
                                                                : formData.requiredDocuments.filter(id => id !== type.id);
                                                            setFormData({ ...formData, requiredDocuments: newDocs });
                                                        }}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                    <span className="text-xs font-medium text-slate-700">{type.name[language]}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                                            <h3 className="text-sm font-bold text-blue-600">SERVICE STEPS</h3>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    steps: [...formData.steps, { order: formData.steps.length + 1, title: { mn: '', en: '' }, description: { mn: '', en: '' } }]
                                                })}
                                            >
                                                Add Step
                                            </Button>
                                        </div>
                                        <div className="space-y-4">
                                            {formData.steps.map((step, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, steps: formData.steps.filter((_, i) => i !== idx) })}
                                                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {idx + 1} Title (MN)</label>
                                                            <Input
                                                                value={step.title.mn}
                                                                onChange={(e) => {
                                                                    const newSteps = [...formData.steps];
                                                                    newSteps[idx].title.mn = e.target.value;
                                                                    setFormData({ ...formData, steps: newSteps });
                                                                }}
                                                                className="h-9 text-xs"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {idx + 1} Title (EN)</label>
                                                            <Input
                                                                value={step.title.en}
                                                                onChange={(e) => {
                                                                    const newSteps = [...formData.steps];
                                                                    newSteps[idx].title.en = e.target.value;
                                                                    setFormData({ ...formData, steps: newSteps });
                                                                }}
                                                                className="h-9 text-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 sticky bottom-0 bg-white">
                                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                        <Button type="submit" isLoading={saving}>
                                            {editingId ? 'Update Service' : 'Create Service'}
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
