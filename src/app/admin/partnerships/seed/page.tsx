'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, Button } from '@/components/ui';
import { db } from '@/lib/firebase/config';
import { cn } from '@/lib/utils';
import { collection, addDoc, Timestamp, getDocs, deleteDoc, doc, terminate, clearIndexedDbPersistence } from 'firebase/firestore';
import { Loader2, Database, Trash2, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';

const partnersData = [
    { name: 'Simon Fraser University (SFU)', country: 'Canada', contactPerson: 'Anna Liu', contactEmail: 'partners@sfu.ca', status: 'processing', lastUpdateNote: 'Full-time MBA, MSc Finance, ESL, UG хөтөлбөрүүдтэй.' },
    { name: 'University of Auckland', country: 'New Zealand', contactPerson: 'Megan', contactEmail: 'int-marketing@auckland.ac.nz', status: 'pending', lastUpdateNote: 'Шинэ агент болох хүсэлтээ илгээсэн. Хариу хүлээж байна.' },
    { name: 'University of Canterbury', country: 'New Zealand', contactPerson: 'Contact Centre', contactEmail: 'international@canterbury.ac.nz', status: 'pending', lastUpdateNote: 'Автомат хариу ирсэн. 24 цагийн дотор хариу өгнө гэсэн.' },
    { name: 'Lincoln University', country: 'New Zealand', contactPerson: 'Partnership Team', contactEmail: 'international@lincoln.ac.nz', status: 'rejected', lastUpdateNote: 'Татгалзсан хариу. "Land-based" чиглэлээр дахин хандана.' },
    { name: 'IPU New Zealand', country: 'New Zealand', contactPerson: 'Jason D. Sheen', contactEmail: 'recruitment@ipu.ac.nz', status: 'submitted', lastUpdateNote: 'Jason-д бүх бичиг баримтыг илгээсэн.' },
    { name: 'NZLC (Language Centres)', country: 'New Zealand', contactPerson: 'Amanda Wong', contactEmail: 'amandaw@nzlc.ac.nz', status: 'processing', lastUpdateNote: 'Amanda-гаас имэйл ирсэн. Narantungalag Ganbold-той үргэлжлүүлэн ажиллаж байна.' },
    { name: 'Languages International', country: 'New Zealand', contactPerson: 'Brett Shirreffs', contactEmail: 'brett@languages.ac.nz', status: 'incomplete', lastUpdateNote: 'Компанийн мэдээлэл илгээх хүлээгдэж байна.' },
    { name: 'Education Planner', country: 'Canada', contactPerson: 'Anna Liu', contactEmail: 'anna@educationplanner.ca', status: 'processing', lastUpdateNote: 'Жагсаалт ирсэн. "DD Info Request" форм бөглөх шаардлагатай.' },
    { name: 'Toronto Metropolitan University (TMU)', country: 'Canada', contactPerson: 'Intl. Admissions', contactEmail: 'international@torontomu.ca', status: 'processing', lastUpdateNote: 'Anna Liu: PG & ESL, UG хөтөлбөрүүдтэй.' },
    { name: 'Vancouver Island University (VIU)', country: 'Canada', contactPerson: 'Support International', contactEmail: 'worldviu@viu.ca', status: 'processing', lastUpdateNote: 'Anna Liu: Master, ESL, UG хөтөлбөрүүдтэй.' },
    { name: 'Niagara College Canada', country: 'Canada', contactPerson: 'Inquiry Response Team', contactEmail: 'international@niagaracollege.ca', status: 'pending', lastUpdateNote: 'Автомат хариу ирсэн. Ажлын 3-5 хоногт хариу өгнө.' },
    { name: 'George Brown College', country: 'Canada', contactPerson: 'Mona Modaresi', contactEmail: 'international@georgebrown.ca', status: 'processing', lastUpdateNote: 'Anna Liu-ийн "College" жагсаалтанд байна.' },
    { name: 'English Teaching College (ETC)', country: 'New Zealand', contactPerson: 'Peggy Chiew', contactEmail: 'peggy@etc.ac.nz', status: 'processing', lastUpdateNote: 'Reference Check хийгдэж байна.' },
    { name: 'University of Manitoba', country: 'Canada', contactPerson: 'Undergraduate Admissions', contactEmail: 'international@umanitoba.ca', status: 'processing', lastUpdateNote: 'MBA, Master, ESL, UG, Continuing Ed.' },
    { name: 'University Canada West (UCW)', country: 'Canada', contactPerson: 'UCW Info Team', contactEmail: 'international@ucanwest.ca', status: 'processing', lastUpdateNote: 'PG & ESL, UG хөтөлбөрүүдтэй.' },
    { name: 'McMaster University', country: 'Canada', contactPerson: 'Nicole Stanfield', contactEmail: 'international@mcmaster.ca', status: 'dormant', lastUpdateNote: 'Шинэ агент авахгүй байгаа. Ирээдүйд хандах боломжтой.' },
    { name: 'Red River College Polytechnic', country: 'Canada', contactPerson: 'International Admissions', contactEmail: 'international@rrc.ca', status: 'pending', lastUpdateNote: 'Автомат хариу ирсэн. Ажлын 3-5 хоногт хариу өгнө.' },
    { name: 'Sault College', country: 'Canada', contactPerson: 'International Office', contactEmail: 'international@saultcollege.ca', status: 'pending', lastUpdateNote: 'Автомат хариу ирсэн. Ажлын 3 хоногт хариу өгнө.' },
    { name: 'Canadore College', country: 'Canada', contactPerson: 'International Office', contactEmail: 'agent.relations@canadorecollege.ca', status: 'pending', lastUpdateNote: 'Ачаалал ихтэй байгаа тул хариу хүлээгдэж байна.' },
    { name: 'University of Otago', country: 'New Zealand', contactPerson: 'AskOtago', contactEmail: 'international.marketing@otago.ac.nz', status: 'pending', lastUpdateNote: 'Тикет үүссэн (UO-01510214).' },
    { name: 'Otago Polytechnic', country: 'New Zealand', contactPerson: 'Cameron James-Pirie', contactEmail: 'cameron.james-pirie@op.ac.nz', status: 'pending', lastUpdateNote: 'Захидал холбогдох ажилтан руу шилжсэн.' },
    { name: 'Fanshawe College', country: 'Canada', contactPerson: 'Wayne Racher', contactEmail: 'international@fanshawec.ca', status: 'incomplete', lastUpdateNote: 'Порталаар өргөдөл гаргах шаардлагатай. 2 references хэрэгтэй.' },
    { name: 'Algoma University', country: 'Canada', contactPerson: 'Jaden Cerasuolo', contactEmail: 'international@algomau.ca', status: 'submitted', lastUpdateNote: 'Онлайн форм бөглөж илгээсэн. Материал мэйлээр илгээнэ.' },
    { name: 'Centennial College', country: 'Canada', contactPerson: 'International Team', contactEmail: 'seasia@centennialcollege.ca', status: 'submitted', lastUpdateNote: 'Зүүн өмнөд Ази хариуцсан баг руу материал илгээсэн.' },
    { name: 'AUT New Zealand', country: 'New Zealand', contactPerson: 'Intl Agent Team', contactEmail: 'international.agents@aut.ac.nz', status: 'pending', lastUpdateNote: 'Судалгааг бөглөж илгээсэн. 2-р сарын эхээр хариу өгнө.' },
    { name: 'University of Waikato', country: 'New Zealand', contactPerson: 'Partnerships Team', contactEmail: 'partnership.enquiries@waikato.ac.nz', status: 'submitted', lastUpdateNote: 'Partnerships team руу материал илгээсэн.' }
];

export default function SeedPartnerships() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [selectedSchools, setSelectedSchools] = useState<string[]>([]);

    useEffect(() => {
        // Default to all selected
        setSelectedSchools(partnersData.map(p => p.name));
    }, []);

    const toggleSchool = (name: string) => {
        setSelectedSchools(prev =>
            prev.includes(name)
                ? prev.filter(n => n !== name)
                : [...prev, name]
        );
    };

    const toggleAll = () => {
        if (selectedSchools.length === partnersData.length) {
            setSelectedSchools([]);
        } else {
            setSelectedSchools(partnersData.map(p => p.name));
        }
    };

    const handleFixConnection = async () => {
        setLoading(true);
        setStatus('Fixing connection (Resetting Firebase)...');
        try {
            if (db) {
                await terminate(db);
                await clearIndexedDbPersistence(db);
            }
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
        if (selectedSchools.length === 0) {
            setStatus('Error: Please select at least one school.');
            return;
        }

        setLoading(true);
        setStatus(`Connecting to Server and Seeding ${selectedSchools.length} partners...`);
        setProgress(0);

        try {
            const response = await fetch('/api/admin/partnerships/seed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'seed', schoolNames: selectedSchools })
            });

            let result;
            try {
                result = await response.json();
            } catch (e) {
                throw new Error('Server returned an invalid response. Check terminal.');
            }

            if (!response.ok) {
                throw new Error(result.error || `Server Error ${response.status}`);
            }

            setProgress(100);
            setStatus(`Success! ${result.message}`);
        } catch (error: any) {
            console.error('[SEED] Error during server-side import:', error);
            setStatus(`Error: ${error.message || 'Unknown error'}.`);
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

    const allSelected = selectedSchools.length === partnersData.length;

    return (
        <AdminLayout>
            <div className="max-w-3xl mx-auto py-12">
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
                        Select the schools you want to import into the database. Use this tool to populate your system with initial partner data.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={toggleAll}
                                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="text-sm font-bold text-slate-700">Select All ({partnersData.length})</span>
                            </div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{selectedSchools.length} Selected</span>
                        </div>

                        <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {partnersData.map((p, i) => {
                                const isSelected = selectedSchools.includes(p.name);
                                return (
                                    <div
                                        key={i}
                                        onClick={() => toggleSchool(p.name)}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group",
                                            isSelected
                                                ? "bg-blue-50/50 border-blue-100 ring-1 ring-blue-100"
                                                : "bg-white border-slate-100 hover:border-slate-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                readOnly
                                                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-slate-900 leading-none">{p.name}</p>
                                                <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-widest">{p.country}</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border",
                                            p.status === 'processing' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                p.status === 'approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    p.status === 'rejected' ? "bg-red-50 text-red-600 border-red-100" :
                                                        "bg-slate-50 text-slate-600 border-slate-100"
                                        )}>
                                            {p.status}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="flex gap-4">
                            <Button
                                onClick={seedData}
                                disabled={loading || selectedSchools.length === 0}
                                className="flex-1 h-14 rounded-2xl shadow-lg shadow-blue-500/20 font-bold"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                                Import {selectedSchools.length} Selected
                            </Button>
                            <Button
                                variant="outline"
                                onClick={clearData}
                                disabled={loading}
                                className="h-14 px-6 rounded-2xl text-red-500 border-red-100 hover:bg-red-50"
                            >
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
                </Card>
            </div>
        </AdminLayout>
    );
}
