'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, Button } from '@/components/ui';
import { db } from '@/lib/firebase/config';
import { cn } from '@/lib/utils';
import { collection, addDoc, Timestamp, getDocs, deleteDoc, doc, terminate, clearIndexedDbPersistence } from 'firebase/firestore';
import { Loader2, Database, Trash2, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';

const partnersData = [
    { name: 'Simon Fraser University (SFU)', country: 'Canada', contactPerson: 'Anna Liu', status: 'processing', lastUpdateNote: 'Full-time MBA, MSc Finance, ESL, UG хөтөлбөрүүдтэй.' },
    { name: 'University of Auckland', country: 'New Zealand', contactPerson: 'Megan', status: 'pending', lastUpdateNote: 'Шинэ агент болох хүсэлтээ илгээсэн. Хариу хүлээж байна.' },
    { name: 'University of Canterbury', country: 'New Zealand', contactPerson: 'Contact Centre', status: 'pending', lastUpdateNote: 'Автомат хариу ирсэн. 24 цагийн дотор хариу өгнө гэсэн.' },
    { name: 'Lincoln University', country: 'New Zealand', contactPerson: 'Partnership Team', status: 'rejected', lastUpdateNote: 'Татгалзсан хариу. "Land-based" чиглэлээр дахин хандана.' },
    { name: 'IPU New Zealand', country: 'New Zealand', contactPerson: 'Jason D. Sheen', status: 'submitted', lastUpdateNote: 'Jason-д бүх бичиг баримтыг илгээсэн.' },
    { name: 'NZLC (Language Centres)', country: 'New Zealand', contactPerson: 'Amanda Wong', status: 'processing', lastUpdateNote: 'Amanda-гаас имэйл ирсэн. Narantungalag Ganbold-той үргэлжлүүлэн ажиллаж байна.' },
    { name: 'Languages International', country: 'New Zealand', contactPerson: 'Brett Shirreffs', status: 'incomplete', lastUpdateNote: 'Компанийн мэдээлэл илгээх хүлээгдэж байна.' },
    { name: 'Education Planner', country: 'Canada', contactPerson: 'Anna Liu', status: 'processing', lastUpdateNote: 'Жагсаалт ирсэн. "DD Info Request" форм бөглөх шаардлагатай.' },
    { name: 'Toronto Metropolitan University (TMU)', country: 'Canada', contactPerson: 'Intl. Admissions', status: 'processing', lastUpdateNote: 'Anna Liu: PG & ESL, UG хөтөлбөрүүдтэй.' },
    { name: 'Vancouver Island University (VIU)', country: 'Canada', contactPerson: 'Support International', status: 'processing', lastUpdateNote: 'Anna Liu: Master, ESL, UG хөтөлбөрүүдтэй.' },
    { name: 'Niagara College Canada', country: 'Canada', contactPerson: 'Inquiry Response Team', status: 'pending', lastUpdateNote: 'Автомат хариу ирсэн. Ажлын 3-5 хоногт хариу өгнө.' },
    { name: 'George Brown College', country: 'Canada', contactPerson: 'Mona Modaresi', status: 'processing', lastUpdateNote: 'Anna Liu-ийн "College" жагсаалтанд байна.' },
    { name: 'English Teaching College (ETC)', country: 'New Zealand', contactPerson: 'Peggy Chiew', status: 'processing', lastUpdateNote: 'Reference Check хийгдэж байна.' },
    { name: 'University of Manitoba', country: 'Canada', contactPerson: 'Undergraduate Admissions', status: 'processing', lastUpdateNote: 'MBA, Master, ESL, UG, Continuing Ed.' },
    { name: 'University Canada West (UCW)', country: 'Canada', contactPerson: 'UCW Info Team', status: 'processing', lastUpdateNote: 'PG & ESL, UG хөтөлбөрүүдтэй.' },
    { name: 'McMaster University', country: 'Canada', contactPerson: 'Nicole Stanfield', status: 'dormant', lastUpdateNote: 'Шинэ агент авахгүй байгаа. Ирээдүйд хандах боломжтой.' },
    { name: 'Red River College Polytechnic', country: 'Canada', contactPerson: 'International Admissions', status: 'pending', lastUpdateNote: 'Автомат хариу ирсэн. Ажлын 3-5 хоногт хариу өгнө.' },
    { name: 'Sault College', country: 'Canada', contactPerson: 'International Office', status: 'pending', lastUpdateNote: 'Автомат хариу ирсэн. Ажлын 3 хоногт хариу өгнө.' },
    { name: 'Canadore College', country: 'Canada', contactPerson: 'International Office', status: 'pending', lastUpdateNote: 'Ачаалал ихтэй байгаа тул хариу хүлээгдэж байна.' },
    { name: 'University of Otago', country: 'New Zealand', contactPerson: 'AskOtago', status: 'pending', lastUpdateNote: 'Тикет үүссэн (UO-01510214).' },
    { name: 'Otago Polytechnic', country: 'New Zealand', contactPerson: 'Cameron James-Pirie', status: 'pending', lastUpdateNote: 'Захидал холбогдох ажилтан руу шилжсэн.' },
    { name: 'Fanshawe College', country: 'Canada', contactPerson: 'Wayne Racher', status: 'incomplete', lastUpdateNote: 'Порталаар өргөдөл гаргах шаардлагатай. 2 references хэрэгтэй.' },
    { name: 'Algoma University', country: 'Canada', contactPerson: 'Jaden Cerasuolo', status: 'submitted', lastUpdateNote: 'Онлайн форм бөглөж илгээсэн. Материал мэйлээр илгээнэ.' },
    { name: 'Centennial College', country: 'Canada', contactPerson: 'International Team', status: 'submitted', lastUpdateNote: 'Зүүн өмнөд Ази хариуцсан баг руу материал илгээсэн.' },
    { name: 'AUT New Zealand', country: 'New Zealand', contactPerson: 'Intl Agent Team', status: 'pending', lastUpdateNote: 'Судалгааг бөглөж илгээсэн. 2-р сарын эхээр хариу өгнө.' },
    { name: 'University of Waikato', country: 'New Zealand', contactPerson: 'Partnerships Team', status: 'submitted', lastUpdateNote: 'Partnerships team руу материал илгээсэн.' }
];

export default function SeedPartnerships() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const handleFixConnection = async () => {
        if (!db) return;
        setLoading(true);
        setStatus('Fixing connection (Resetting Firebase)...');
        try {
            await terminate(db);
            await clearIndexedDbPersistence(db);
            setStatus('Connection cache cleared. Please refresh the page.');
            window.location.reload();
        } catch (error) {
            console.error(error);
            setStatus('Error fixing connection.');
        } finally {
            setLoading(false);
        }
    };

    const seedData = async () => {
        setLoading(true);
        setStatus('Connecting to Server and Seeding (Server-side)...');
        setProgress(0);

        try {
            const response = await fetch('/api/admin/partnerships/seed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'seed' })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Server error during seeding');
            }

            setProgress(100);
            setStatus(`Success! ${result.message}`);
        } catch (error: any) {
            console.error('[SEED] Error during server-side import:', error);
            setStatus(`Error: ${error.message || 'Unknown error'}. Check console.`);
        } finally {
            setLoading(false);
        }
    };

    const clearData = async () => {
        if (!confirm('Are you sure? This will delete all partnerships.')) return;
        setLoading(true);
        setStatus('Clearing data (Server-side)...');
        try {
            const response = await fetch('/api/admin/partnerships/seed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'clear' })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Server error during clear');
            }

            setStatus('Database cleared!');
            setProgress(0);
        } catch (error: any) {
            console.error(error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto py-12">
                <Card className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-blue-600">
                            <Database className="w-8 h-8" />
                            <h1 className="text-2xl font-bold text-slate-900">Partnership Seeding</h1>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleFixConnection} className="text-slate-400">
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Fix Connection
                        </Button>
                    </div>

                    <p className="text-slate-500 font-medium">
                        This tool will import {partnersData.length} school records. If it gets stuck, use "Fix Connection" or check if you are offline.
                    </p>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <Button onClick={seedData} disabled={loading} className="flex-1 h-14 rounded-2xl shadow-lg shadow-blue-500/20">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                                Start Import
                            </Button>
                            <Button variant="outline" onClick={clearData} disabled={loading} className="h-14 px-6 rounded-2xl text-red-500 border-red-100 hover:bg-red-50">
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        </div>

                        {loading && (
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-600 h-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}
                    </div>

                    {status && (
                        <div className={cn(
                            "p-4 rounded-2xl flex items-start gap-3 border transition-all animate-fade-in",
                            status.includes('Error')
                                ? "bg-red-50 border-red-100 text-red-700"
                                : status.includes('Success')
                                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                    : "bg-blue-50 border-blue-100 text-blue-700"
                        )}>
                            {status.includes('Error') ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <Loader2 className={cn("w-5 h-5 flex-shrink-0", loading && "animate-spin")} />}
                            <p className="text-sm font-bold">{status}</p>
                        </div>
                    )}

                    <div className="pt-6 border-t border-slate-100">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Schools to be imported</h3>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
                            {partnersData.map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700">
                                    <span>{p.name}</span>
                                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-100 whitespace-nowrap">{p.country}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
