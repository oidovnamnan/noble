// Partnership Management Page
'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, Button, Badge, StatusBadge } from '@/components/ui';
import {
    Briefcase,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Globe,
    User,
    Clock,
    FileText,
    ArrowUpRight,
    Download
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

// Mock data based on school_partnerships.csv
const mockPartnerships = [
    { id: 1, name: 'University of Auckland', country: 'New Zealand', contact: 'Megan / Intl. Marketing', status: 'pending', lastUpdate: 'Шинэ агент болох хүсэлт илгээсэн.' },
    { id: 2, name: 'University of Canterbury', country: 'New Zealand', contact: 'Contact Centre', status: 'pending', lastUpdate: 'Автомат хариу ирсэн. 24 цаг.' },
    { id: 3, name: 'Lincoln University', country: 'New Zealand', contact: 'Partnership Team', status: 'rejected', lastUpdate: 'Land-based чиглэлээр дахин хандана.' },
    { id: 4, name: 'IPU New Zealand', country: 'New Zealand', contact: 'Jason D. Sheen', status: 'submitted', lastUpdate: 'Бүх бичиг баримтыг илгээсэн.' },
    { id: 5, name: 'NZLC', country: 'New Zealand', contact: 'Amanda Wong', status: 'processing', lastUpdate: 'Reference Check хийгдэж байна.' },
    { id: 6, name: 'Languages International', country: 'New Zealand', contact: 'Brett Shirreffs', status: 'incomplete', lastUpdate: 'Мэдээлэл дутуу.' },
    { id: 7, name: 'AUT New Zealand', country: 'New Zealand', contact: 'Intl Team', status: 'pending', lastUpdate: 'Судалгаа бөглөж илгээсэн. 2-р сар.' },
    { id: 8, name: 'Centennial College', country: 'Canada', contact: 'seasia@', status: 'submitted', lastUpdate: 'Бүх материал илгээсэн.' },
    { id: 9, name: 'Algoma University', country: 'Canada', contact: 'Jaden Cerasuolo', status: 'submitted', lastUpdate: 'Материал мэйлээр илгээсэн.' },
    { id: 10, name: 'University of Waikato', country: 'New Zealand', contact: 'Partnerships Team', status: 'submitted', lastUpdate: 'Материал илгээсэн.' }
];

export default function PartnershipsPage() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredPartners = mockPartnerships.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.country.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'submitted': return 'bg-blue-100 text-blue-700';
            case 'processing': return 'bg-amber-100 text-amber-700';
            case 'approved': return 'bg-emerald-100 text-emerald-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('admin.partnerships')}</h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">Manage international school partnerships and applications</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>Export CSV</Button>
                        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>Add Partner</Button>
                    </div>
                </div>

                {/* Filters & Actions */}
                <Card variant="outlined" className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or country..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                            {['all', 'pending', 'submitted', 'processing', 'rejected'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                                        filterStatus === status
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                            : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Partnership Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPartners.map((partner) => (
                        <Card key={partner.id} variant="elevated" className="group hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                    <Globe className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                                </div>
                                <div className={cn("px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest", getStatusColor(partner.status))}>
                                    {partner.status}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{partner.name}</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{partner.country}</p>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3 text-slate-500">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm font-medium">{partner.contact}</span>
                                </div>
                                <div className="flex items-start gap-3 text-slate-500">
                                    <Clock className="w-4 h-4 mt-0.5" />
                                    <span className="text-sm font-medium line-clamp-2">{partner.lastUpdate}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                                <Button variant="ghost" size="sm" className="text-xs font-bold p-0 text-blue-600 hover:bg-transparent">
                                    View Details
                                </Button>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="w-8 h-8 rounded-lg p-0">
                                        <FileText className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-8 h-8 rounded-lg p-0">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Automation Hub */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card variant="elevated" className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none shadow-blue-500/30">
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Document Generator</h3>
                                    <p className="text-blue-100 text-sm mt-1">Generate Company Profiles and Marketing Strategies instantly.</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50 font-bold">Launch Generator</Button>
                                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 font-bold border border-white/20">Templates</Button>
                                </div>
                            </div>
                            <div className="hidden sm:block opacity-20">
                                <Globe className="w-32 h-32" />
                            </div>
                        </div>
                    </Card>

                    <Card variant="elevated" className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-none shadow-amber-500/30">
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Smart Screening</h3>
                                    <p className="text-amber-100 text-sm mt-1">Check student eligibility for partner universities automatically.</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button size="sm" className="bg-white text-amber-600 hover:bg-amber-50 font-bold">Run Checker</Button>
                                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 font-bold border border-white/20">Config</Button>
                                </div>
                            </div>
                            <div className="hidden sm:block opacity-20">
                                <Globe className="w-32 h-32" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
