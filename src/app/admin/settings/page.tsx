'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, Button, Input, Badge } from '@/components/ui';
import {
    Settings,
    Save,
    Globe,
    CreditCard,
    Bot,
    Database,
    Lock,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Tabs configuration
const TABS = [
    { id: 'general', label: 'Ерөнхий', icon: Globe },
    { id: 'firebase', label: 'Firebase Connect', icon: Database },
    { id: 'ai', label: 'AI & Chatbot', icon: Bot },
    { id: 'payment', label: 'Төлбөр (QPay)', icon: CreditCard },
];

export default function AdminSettingsPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

    // Form State
    const [formData, setFormData] = useState({
        // General
        companyNameMn: 'Noble Consulting',
        companyNameEn: 'Noble Consulting',
        email: 'nobleworldgate@gmail.com',
        phone: '+976 9911-2233',
        addressMn: 'Улаанбаатар, Чингэлтэй дүүрэг, 5-р хороо, Премиум палас, 508 тоот',
        addressEn: 'Suite 508, 5th Floor, Premium Palace, 5th Khoroo, Chingeltei District, Ulaanbaatar 15150',
        registrationNumber: '7233705',

        // Firebase (Environment generator)
        firebaseApiKey: '',
        firebaseAuthDomain: '',
        firebaseProjectId: '',
        firebaseStorageBucket: '',
        firebaseMessagingSenderId: '',
        firebaseAppId: '',

        // AI
        openaiApiKey: '',
        openaiModel: 'gpt-4o',
        aiAssistantName: 'Noble Assistant',
        aiSystemPrompt: 'You are a helpful assistant for Noble Consulting...',

        // Payment
        qpayInvoiceCode: '',
        qpayUsername: '',
        qpayPassword: '',
        qpayCallbackUrl: 'https://noble.mn/api/payment/callback',
        isSandbox: true
    });

    useEffect(() => {
        // Load settings from Firestore
        const fetchSettings = async () => {
            if (!db) return;
            setLoading(true);
            try {
                const docRef = doc(db, 'settings', 'system');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setFormData(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setStatus('idle');
    };

    const toggleSecret = (field: string) => {
        setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSave = async () => {
        if (!db) {
            alert('Database connection not initialized. Check .env.local');
            return;
        }

        setSaving(true);
        setStatus('idle');
        try {
            await setDoc(doc(db, 'settings', 'system'), formData, { merge: true });
            setStatus('success');

            // Temporary feedback
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setStatus('error');
        } finally {
            setSaving(false);
        }
    };

    const copyEnvSnippet = () => {
        const snippet = `NEXT_PUBLIC_FIREBASE_API_KEY=${formData.firebaseApiKey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${formData.firebaseAuthDomain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${formData.firebaseProjectId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${formData.firebaseStorageBucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${formData.firebaseMessagingSenderId}
NEXT_PUBLIC_FIREBASE_APP_ID=${formData.firebaseAppId}

# Server-side Keys
OPENAI_API_KEY=${formData.openaiApiKey}
QPAY_INVOICE_CODE=${formData.qpayInvoiceCode}
QPAY_USERNAME=${formData.qpayUsername}
QPAY_PASSWORD=${formData.qpayPassword}
QPAY_CALLBACK_URL=${formData.qpayCallbackUrl}
QPAY_IS_SANDBOX=${formData.isSandbox}`;

        navigator.clipboard.writeText(snippet);
        alert('Environment variables copied to clipboard! Paste this into .env.local');
    };

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Системийн Тохиргоо</h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">API холболтууд болон ерөнхий мэдээллийг удирдах</p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        leftIcon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        className={status === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                        {status === 'success' ? 'Хадгалагдлаа!' : saving ? 'Хадгалж байна...' : 'Тохиргоог хадгалах'}
                    </Button>
                </div>

                <div className="flex gap-6 items-start">
                    {/* Sidebar Tabs */}
                    <Card variant="outlined" padding="none" className="w-64 flex-shrink-0 overflow-hidden sticky top-24">
                        <div className="p-2 space-y-1">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Content Area */}
                    <div className="flex-1 space-y-6">

                        {/* 1. General Settings */}
                        {activeTab === 'general' && (
                            <div className="space-y-6 animate-fade-in">
                                <Card variant="outlined" className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Компанийн мэдээлэл</h3>
                                        <p className="text-sm text-slate-500">Үйлчлүүлэгчийн апп болон вебсайт дээр харагдах мэдээлэл</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Компанийн нэр (MN)" value={formData.companyNameMn} onChange={e => handleChange('companyNameMn', e.target.value)} />
                                        <Input label="Company Name (EN)" value={formData.companyNameEn} onChange={e => handleChange('companyNameEn', e.target.value)} />
                                        <Input label="Имэйл хаяг" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                                        <Input label="Утасны дугаар" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                                        <div className="col-span-2">
                                            <Input label="Хаяг (MN)" value={formData.addressMn} onChange={e => handleChange('addressMn', e.target.value)} />
                                        </div>
                                        <div className="col-span-2">
                                            <Input label="Address (EN)" value={formData.addressEn} onChange={e => handleChange('addressEn', e.target.value)} />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {/* 2. Firebase Configuration */}
                        {activeTab === 'firebase' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-bold mb-1">Анхааруулга</p>
                                        Эдгээр утгуудыг энд хадгалах нь мэдээллийн санд safe backup хийх зориулалттай.
                                        Систем ажиллахын тулд та эдгээр утгуудыг <b>.env.local</b> файл руу хуулж өгөх шаардлагатай.
                                    </div>
                                </div>

                                <Card variant="outlined" className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">Firebase Холболт</h3>
                                            <p className="text-sm text-slate-500">Project Settings &gt; General &gt; Your apps &gt; SDK setup and configuration</p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={copyEnvSnippet}>Copy .env Snippet</Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="relative">
                                            <Input
                                                label="API Key"
                                                type={showSecrets.firebaseApiKey ? 'text' : 'password'}
                                                value={formData.firebaseApiKey}
                                                onChange={e => handleChange('firebaseApiKey', e.target.value)}
                                                placeholder="AIzaSy..."
                                            />
                                            <button
                                                onClick={() => toggleSecret('firebaseApiKey')}
                                                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                                            >
                                                {showSecrets.firebaseApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Auth Domain" value={formData.firebaseAuthDomain} onChange={e => handleChange('firebaseAuthDomain', e.target.value)} placeholder="project.firebaseapp.com" />
                                            <Input label="Project ID" value={formData.firebaseProjectId} onChange={e => handleChange('firebaseProjectId', e.target.value)} placeholder="project-id" />
                                            <Input label="Storage Bucket" value={formData.firebaseStorageBucket} onChange={e => handleChange('firebaseStorageBucket', e.target.value)} placeholder="project.appspot.com" />
                                            <Input label="Messaging Sender ID" value={formData.firebaseMessagingSenderId} onChange={e => handleChange('firebaseMessagingSenderId', e.target.value)} />
                                            <Input label="App ID" value={formData.firebaseAppId} onChange={e => handleChange('firebaseAppId', e.target.value)} className="col-span-2" />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {/* 3. AI Settings */}
                        {activeTab === 'ai' && (
                            <div className="space-y-6 animate-fade-in">
                                <Card variant="outlined" className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">OpenAI & Chatbot</h3>
                                        <p className="text-sm text-slate-500">AI туслахын ажиллах зарчим болон API холболт</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Input
                                                label="OpenAI API Key (sk-...)"
                                                type={showSecrets.openaiApiKey ? 'text' : 'password'}
                                                value={formData.openaiApiKey}
                                                onChange={e => handleChange('openaiApiKey', e.target.value)}
                                                placeholder="sk-..."
                                            />
                                            <button
                                                onClick={() => toggleSecret('openaiApiKey')}
                                                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                                            >
                                                {showSecrets.openaiApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Model (GPT-4 / GPT-3.5)" value={formData.openaiModel} onChange={e => handleChange('openaiModel', e.target.value)} />
                                            <Input label="Assistant Name" value={formData.aiAssistantName} onChange={e => handleChange('aiAssistantName', e.target.value)} />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">System Prompt (Зааварчилгаа)</label>
                                            <textarea
                                                className="w-full min-h-[150px] p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                                                value={formData.aiSystemPrompt}
                                                onChange={e => handleChange('aiSystemPrompt', e.target.value)}
                                            />
                                            <p className="text-xs text-slate-400">AI хэрхэн ажиллах, ямар өнгө аясаар хариулахыг энд зааж өгнө.</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {/* 4. Payment Settings */}
                        {activeTab === 'payment' && (
                            <div className="space-y-6 animate-fade-in">
                                <Card variant="outlined" className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">Бэлэн бус төлбөр (QPay)</h3>
                                            <p className="text-sm text-slate-500">QPay төлбөрийн системийн тохиргоо</p>
                                        </div>
                                        <Badge variant={formData.isSandbox ? "warning" : "success"}>
                                            {formData.isSandbox ? "Sandbox Mode (Test)" : "Production Mode (Live)"}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <Input
                                            label="Invoice Code"
                                            value={formData.qpayInvoiceCode}
                                            onChange={e => handleChange('qpayInvoiceCode', e.target.value)}
                                            placeholder="INVOICE_CODE_..."
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Username"
                                                value={formData.qpayUsername}
                                                onChange={e => handleChange('qpayUsername', e.target.value)}
                                            />
                                            <div className="relative">
                                                <Input
                                                    label="Password"
                                                    type={showSecrets.qpayPassword ? 'text' : 'password'}
                                                    value={formData.qpayPassword}
                                                    onChange={e => handleChange('qpayPassword', e.target.value)}
                                                />
                                                <button
                                                    onClick={() => toggleSecret('qpayPassword')}
                                                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                                                >
                                                    {showSecrets.qpayPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <Input
                                            label="Callback URL"
                                            value={formData.qpayCallbackUrl}
                                            onChange={e => handleChange('qpayCallbackUrl', e.target.value)}
                                        />

                                        <div className="flex items-center gap-2 pt-2">
                                            <input
                                                type="checkbox"
                                                id="sandbox"
                                                checked={formData.isSandbox}
                                                onChange={e => handleChange('isSandbox', e.target.checked)}
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="sandbox" className="text-sm font-medium text-slate-700">
                                                Туршилтын горим (Sandbox) идэвхжүүлэх
                                            </label>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
