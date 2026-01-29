'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, Button } from '@/components/ui';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, Timestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Loader2, Database, Trash2, CheckCircle2 } from 'lucide-react';

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

    const seedData = async () => {
        if (!db) return;
        setLoading(true);
        setStatus('Seeding data...');
        try {
            for (const partner of partnersData) {
                await addDoc(collection(db, 'partnerships'), {
                    ...partner,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                    statusHistory: [{
                        status: partner.status,
                        note: 'Initial seed data import',
                        updatedAt: Timestamp.now(),
                        updatedBy: 'System'
                    }]
                });
            }
            setStatus('Success! All partners imported.');
        } catch (error) {
            console.error(error);
            setStatus('Error seeding data.');
        } finally {
            setLoading(false);
        }
    };

    const clearData = async () => {
        if (!db) return;
        if (!confirm('Are you sure? This will delete all partnerships.')) return;
        setLoading(true);
        setStatus('Clearing data...');
        try {
            const snap = await getDocs(collection(db!, 'partnerships'));
            const deletions = snap.docs.map(d => deleteDoc(doc(db!, 'partnerships', d.id)));
            await Promise.all(deletions);
            setStatus('Cleared!');
        } catch (error) {
            console.error(error);
            setStatus('Error clearing data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto py-12">
                <Card className="p-8 space-y-6">
                    <div className="flex items-center gap-4 text-blue-600">
                        <Database className="w-8 h-8" />
                        <h1 className="text-2xl font-bold text-slate-900">Partnership Data Seeding</h1>
                    </div>
                    <p className="text-slate-500">
                        This tool will import {partnersData.length} records from your CSV into the Firestore database.
                    </p>

                    <div className="flex gap-4">
                        <Button onClick={seedData} disabled={loading} className="flex-1">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                            Import Partners
                        </Button>
                        <Button variant="outline" onClick={clearData} disabled={loading} className="text-red-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear Database
                        </Button>
                    </div>

                    {status && (
                        <div className={`p-4 rounded-xl text-sm font-bold ${status.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                            {status}
                        </div>
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}
