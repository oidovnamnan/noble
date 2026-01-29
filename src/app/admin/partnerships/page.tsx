// Partnership Management Page
'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, Button, Badge, StatusBadge } from '@/components/ui';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Globe,
    User,
    Clock,
    FileText,
    ArrowUpRight,
    Download,
    RefreshCw,
    Bot,
    PanelLeftClose,
    PanelRightClose
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

import { db } from '@/lib/firebase/config';
import { collection, query, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { Partnership } from '@/types';
import { Loader2 } from 'lucide-react';

import { Modal, Input, Select, Textarea } from '@/components/ui';
import { addDoc, Timestamp } from 'firebase/firestore';

export default function PartnershipsPage() {
    const { t } = useTranslation();
    const [partnerships, setPartnerships] = useState<Partnership[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<Partnership | null>(null);
    const [detailsTab, setDetailsTab] = useState<'info' | 'comms' | 'docs'>('info');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [aiEmailText, setAiEmailText] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<any>(null);

    // New partner form state
    const [newPartnerData, setNewPartnerData] = useState({
        name: '',
        country: '',
        contactPerson: '',
        contactEmail: '',
        status: 'pending' as any,
        lastUpdateNote: ''
    });

    useEffect(() => {
        const fetchPartnerships = async () => {
            if (!db) return;
            try {
                const q = query(collection(db, 'partnerships'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Partnership));
                setPartnerships(data);
            } catch (error) {
                console.error('Error fetching partnerships:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPartnerships();
    }, []);

    const handleAddPartner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!db) return;
        setIsSubmitting(true);
        try {
            const docRef = await addDoc(collection(db, 'partnerships'), {
                ...newPartnerData,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            const freshPartner = { id: docRef.id, ...newPartnerData, createdAt: new Date() } as any;
            setPartnerships([freshPartner, ...partnerships]);
            setIsAddModalOpen(false);
            setNewPartnerData({
                name: '',
                country: '',
                contactPerson: '',
                contactEmail: '',
                status: 'pending',
                lastUpdateNote: ''
            });
        } catch (error) {
            console.error('Error adding partner:', error);
            alert('Сургууль нэмэхэд алдаа гарлаа.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGenerateLetterhead = (partner: Partnership) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Noble Letterhead - ${partner.name}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
                    body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background: #f1f5f9; }
                    .page { width: 210mm; min-height: 297mm; padding: 20mm; margin: 10mm auto; background: white; position: relative; box-sizing: border-box; }
                    .side-bar { position: absolute; top: 0; left: 0; width: 5mm; height: 100%; background: #0f172a; }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 40px; }
                    .logo-section { display: flex; align-items: center; gap: 15px; }
                    .company-name h1 { margin: 0; font-size: 22px; font-weight: 900; color: #0f172a; }
                    .content { font-size: 14px; line-height: 1.6; color: #334155; min-height: 180mm; }
                    .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; display: grid; grid-template-cols: repeat(4, 1fr); gap: 10px; font-size: 9px; color: #94a3b8; }
                    @media print { body { background: none; } .page { margin: 0; width: 100%; } }
                </style>
            </head>
            <body>
                <div class="page">
                    <div class="side-bar"></div>
                    <div class="header">
                        <div class="logo-section">
                            <div style="width: 60px; height: 60px; background: #0f172a; border-radius: 50%; display: flex; items-center; justify-content: center; color: white; font-weight: 900; font-size: 24px;">N</div>
                            <div class="company-name">
                                <h1>Noble World Gate</h1>
                                <div style="font-size: 10px; color: #94a3b8;">Excellence in International Education</div>
                            </div>
                        </div>
                        <div style="text-align: right; color: #94a3b8; font-size: 12px; font-weight: 700;">OFFICIAL REQUEST</div>
                    </div>
                    <div class="content">
                        <p style="text-align: right;">Date: ${new Date().toLocaleDateString()}</p>
                        <h3>To: Admissions Team, ${partner.name}</h3>
                        <p>Subject: Partnership Inquiry for Student Recruitment</p>
                        <br>
                        <p>Dear ${partner.contactPerson || 'Admissions Team'},</p>
                        <p>We are writing to express our strong interest in establishing a formal partnership with <strong>${partner.name}</strong> for recruiting students from Mongolia.</p>
                        <p>Noble World Gate LLC is a leading education consultancy based in Ulaanbaatar, committed to providing high-quality guidance to Mongolian students seeking international education opportunities. We believe your programs align perfectly with the aspirations of our students.</p>
                        <p>We look forward to hearing from you regarding the next steps for agent appointment.</p>
                        <br><br>
                        <p>Sincerely,</p>
                        <p><strong>Narantungalag Ganbold</strong><br>CEO, Noble World Gate LLC</p>
                    </div>
                    <div class="footer">
                        <div><strong>Address</strong>Suite 508, Premium Palace, UB</div>
                        <div><strong>Contact</strong>+976 7702-7702<br>nobleworldgate@gmail.com</div>
                        <div><strong>Online</strong>www.nobleworldgate.com</div>
                        <div><strong>Reg</strong>7233705</div>
                    </div>
                </div>
                <script>window.onload = () => { window.print(); }</script>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    };

    const handleSendEmail = (partner: Partnership) => {
        const subject = encodeURIComponent(`Partnership Inquiry - Noble World Gate LLC`);
        const body = encodeURIComponent(`Dear ${partner.contactPerson || 'Admissions Team'},\n\nWe are interested in becoming an authorized representative for ${partner.name}.\n\nPlease let us know the requirements.\n\nBest regards,\nNoble World Gate Team`);
        window.open(`mailto:${partner.contactEmail || ''}?subject=${subject}&body=${body}`);
    };

    const filteredPartners = partnerships.filter(p => {
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
            case 'incomplete': return 'bg-purple-100 text-purple-700';
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
                        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddModalOpen(true)}>Add Partner</Button>
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
                            {['all', 'pending', 'submitted', 'processing', 'approved', 'rejected', 'incomplete'].map((status) => (
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
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-slate-500 font-medium">Түншлэлийн мэдээллийг уншиж байна...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPartners.map((partner) => (
                            <Card
                                key={partner.id}
                                variant="elevated"
                                className="group hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                onClick={() => setSelectedPartner(partner)}
                            >
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
                                        <span className="text-sm font-medium">{partner.contactPerson || 'No contact person'}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-slate-500">
                                        <Clock className="w-4 h-4 mt-0.5" />
                                        <span className="text-sm font-medium line-clamp-2">{partner.lastUpdateNote || 'No recent updates'}</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs font-bold p-0 text-blue-600 hover:bg-transparent"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPartner(partner);
                                        }}
                                    >
                                        View Details
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-8 h-8 rounded-lg p-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleGenerateLetterhead(partner);
                                            }}
                                        >
                                            <FileText className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="w-8 h-8 rounded-lg p-0" onClick={(e) => e.stopPropagation()}>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredPartners.length === 0 && (
                    <Card variant="outlined" className="py-24 flex flex-col items-center justify-center border-dashed border-2 bg-slate-50/50 rounded-[48px]">
                        <div className="w-24 h-24 bg-white rounded-[40px] shadow-2xl shadow-blue-500/10 flex items-center justify-center mb-8 relative">
                            <Plus className="w-12 h-12 text-slate-200" />
                            <div className="absolute -right-2 -top-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center animate-bounce">
                                <Globe className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Партнер одоогоор байхгүй байна</h3>
                        <p className="text-slate-500 mt-2 mb-10 max-w-sm text-center font-medium leading-relaxed">
                            Та партнеруудын жагсаалтыг CSV файлаас олноор нь импортлох эсвэл шинээр нэмэх боломжтой.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-8">
                            <Button
                                variant="outline"
                                className="flex-1 bg-white h-14 rounded-2xl font-bold"
                                onClick={() => window.location.href = '/admin/partnerships/seed'}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                CSV-ээс импортлох
                            </Button>
                            <Button
                                className="flex-1 h-14 rounded-2xl font-bold shadow-lg shadow-blue-500/20"
                                onClick={() => setIsAddModalOpen(true)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Шинэ партнер нэмэх
                            </Button>
                        </div>
                    </Card>
                )}

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

            {/* Add Partner Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Шинэ түншлэл бүртгэх"
            >
                <form onSubmit={handleAddPartner} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Сургуулийн нэр"
                            placeholder="University of..."
                            value={newPartnerData.name}
                            onChange={e => setNewPartnerData({ ...newPartnerData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Улс"
                            placeholder="New Zealand"
                            value={newPartnerData.country}
                            onChange={e => setNewPartnerData({ ...newPartnerData, country: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Харилцагч ажилтан"
                            placeholder="Name..."
                            value={newPartnerData.contactPerson}
                            onChange={e => setNewPartnerData({ ...newPartnerData, contactPerson: e.target.value })}
                        />
                        <Input
                            label="Имэйл"
                            type="email"
                            placeholder="admissions@..."
                            value={newPartnerData.contactEmail}
                            onChange={e => setNewPartnerData({ ...newPartnerData, contactEmail: e.target.value })}
                        />
                    </div>
                    <Select
                        label="Одоогийн төлөв"
                        options={[
                            { value: 'pending', label: 'Хариу хүлээж буй' },
                            { value: 'submitted', label: 'Өргөдөл илгээсэн' },
                            { value: 'processing', label: 'Хянагдаж байгаа' },
                            { value: 'incomplete', label: 'Мэдээлэл дутуу' },
                        ]}
                        value={newPartnerData.status}
                        onChange={e => setNewPartnerData({ ...newPartnerData, status: e.target.value })}
                    />
                    <Textarea
                        label="Сүүлийн явц / Тайлбар"
                        placeholder="Ямар шатанд байгаа тухай..."
                        value={newPartnerData.lastUpdateNote}
                        onChange={e => setNewPartnerData({ ...newPartnerData, lastUpdateNote: e.target.value })}
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Цуцлах</Button>
                        <Button type="submit" isLoading={isSubmitting}>Бүртгэх</Button>
                    </div>
                </form>
            </Modal>

            {/* Partnership Details Modal */}
            <Modal
                isOpen={!!selectedPartner}
                onClose={() => setSelectedPartner(null)}
                title={selectedPartner?.name || 'Partnership Details'}
                maxWidth="max-w-4xl"
            >
                {selectedPartner && (
                    <div className="space-y-8">
                        {/* Tabs Navigation */}
                        <div className="flex border-b border-slate-100">
                            {['info', 'comms', 'docs'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setDetailsTab(tab as any)}
                                    className={cn(
                                        "px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2",
                                        detailsTab === tab
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {tab === 'info' ? 'Мэдээлэл' : tab === 'comms' ? 'Communication Hub' : 'Documents'}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[400px]">
                            {detailsTab === 'info' && (
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <section>
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Сургуулийн мэдээлэл</h4>
                                            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                                <div>
                                                    <p className="text-xs text-slate-400 mb-1">Нэр</p>
                                                    <p className="font-bold text-slate-900">{selectedPartner.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400 mb-1">Улс</p>
                                                    <p className="font-bold text-slate-900">{selectedPartner.country}</p>
                                                </div>
                                            </div>
                                        </section>
                                        <section>
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Холбоо барих</h4>
                                            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                                <div>
                                                    <p className="text-xs text-slate-400 mb-1">Ажилтан</p>
                                                    <p className="font-bold text-slate-900">{selectedPartner.contactPerson || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400 mb-1">Имэйл</p>
                                                    <p className="font-bold text-blue-600">{selectedPartner.contactEmail || '-'}</p>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                    <div className="space-y-6">
                                        <section>
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Статус</h4>
                                            <div className="bg-slate-50 rounded-2xl p-6">
                                                <Badge className={cn("mb-4", getStatusColor(selectedPartner.status))}>
                                                    {selectedPartner.status.toUpperCase()}
                                                </Badge>
                                                <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                                                    "{selectedPartner.lastUpdateNote}"
                                                </p>
                                            </div>
                                        </section>
                                        <div className="flex flex-col gap-3">
                                            <Button
                                                className="w-full"
                                                leftIcon={<Download className="w-4 h-4" />}
                                                onClick={() => handleGenerateLetterhead(selectedPartner)}
                                            >
                                                Generate Letterhead
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                leftIcon={<Globe className="w-4 h-4" />}
                                                onClick={() => window.open(selectedPartner.website || '#', '_blank')}
                                            >
                                                Visit Website
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {detailsTab === 'comms' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Communication Hub</h4>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-blue-600"
                                            leftIcon={<RefreshCw className={cn("w-4 h-4", isAiLoading && "animate-spin")} />}
                                            onClick={() => { setAiEmailText(''); setAiAnalysis(null); }}
                                        >
                                            Reset
                                        </Button>
                                    </div>

                                    {!aiAnalysis ? (
                                        <div className="space-y-4">
                                            <div className="bg-blue-50/50 border border-blue-100 rounded-[32px] p-6">
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <Bot className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-slate-900">Email Analyzer</h5>
                                                        <p className="text-xs text-slate-500">Paste an email from this partner to automatically update status and generate a reply.</p>
                                                    </div>
                                                </div>
                                                <textarea
                                                    className="w-full min-h-[200px] bg-white border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
                                                    placeholder="Paste the partner email here..."
                                                    value={aiEmailText}
                                                    onChange={(e) => setAiEmailText(e.target.value)}
                                                />
                                                <Button
                                                    className="w-full mt-4"
                                                    isLoading={isAiLoading}
                                                    disabled={!aiEmailText.trim()}
                                                    onClick={async () => {
                                                        setIsAiLoading(true);
                                                        try {
                                                            const res = await fetch('/api/admin/ai/analyze-email', {
                                                                method: 'POST',
                                                                body: JSON.stringify({ emailText: aiEmailText, partnerTarget: selectedPartner.name })
                                                            });
                                                            const data = await res.json();
                                                            setAiAnalysis(data);
                                                        } catch (e) {
                                                            alert('AI Analysis failed.');
                                                        } finally {
                                                            setIsAiLoading(false);
                                                        }
                                                    }}
                                                >
                                                    Analyze with AI
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 animate-fade-in">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Suggested Status</p>
                                                    <Badge variant="info" className="uppercase font-bold">{aiAnalysis.status}</Badge>
                                                </div>
                                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Summary</p>
                                                    <p className="text-xs font-medium text-slate-700">{aiAnalysis.summary}</p>
                                                </div>
                                            </div>

                                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
                                                <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">Proposed Reply</p>
                                                <p className="text-xs text-slate-700 leading-relaxed font-serif italic mb-4">
                                                    "{aiAnalysis.proposedReply}"
                                                </p>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" className="flex-1 bg-white" onClick={() => navigator.clipboard.writeText(aiAnalysis.proposedReply)}>
                                                        Copy Reply
                                                    </Button>
                                                    <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 border-none" onClick={async () => {
                                                        if (!db) return;
                                                        await updateDoc(doc(db, 'partnerships', selectedPartner.id), {
                                                            status: aiAnalysis.status.toLowerCase(),
                                                            lastUpdateNote: aiAnalysis.summary,
                                                            updatedAt: Timestamp.now()
                                                        });
                                                        alert('Partner updated successfully!');
                                                        setAiAnalysis(null);
                                                        setAiEmailText('');
                                                    }}>
                                                        Apply Updates
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
                                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Bot className="w-4 h-4 text-amber-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-amber-700 uppercase">Next Step</p>
                                                    <p className="text-xs text-amber-800 font-bold">{aiAnalysis.nextAction}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {detailsTab === 'docs' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <Card variant="outlined" className="p-6 border-dashed border-2 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <FileText className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-600">Company Letterhead</p>
                                        <Button variant="ghost" size="sm" onClick={() => handleGenerateLetterhead(selectedPartner)}>Generate New</Button>
                                    </Card>
                                    <Card variant="outlined" className="p-6 border-dashed border-2 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                                            <Plus className="w-6 h-6 text-slate-400 group-hover:text-amber-600" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-600">Upload Document</p>
                                        <Button variant="ghost" size="sm">Select File</Button>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
