import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, Timestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';

const partnersData = [
    { name: 'Simon Fraser University (SFU)', country: 'Canada', contactPerson: 'Anna Liu', contactEmail: 'partners@sfu.ca', status: 'under_review', lastUpdateNote: 'Full-time MBA, MSc Finance, ESL, UG хөтөлбөрүүдтэй.' },
    { name: 'University of Auckland', country: 'New Zealand', contactPerson: 'Megan', contactEmail: 'int-marketing@auckland.ac.nz', status: 'contacted', lastUpdateNote: 'Шинэ агент болох хүсэлтээ илгээсэн. Хариу хүлээж байна.' },
    { name: 'University of Canterbury', country: 'New Zealand', contactPerson: 'Contact Centre', contactEmail: 'international@canterbury.ac.nz', status: 'contacted', lastUpdateNote: 'Автомат хариу ирсэн. 24 цагийн дотор хариу өгнө гэсэн.' },
    { name: 'Lincoln University', country: 'New Zealand', contactPerson: 'Partnership Team', contactEmail: 'international@lincoln.ac.nz', status: 'rejected', lastUpdateNote: 'Татгалзсан хариу. "Land-based" чиглэлээр дахин хандана.' },
    { name: 'IPU New Zealand', country: 'New Zealand', contactPerson: 'Jason D. Sheen', contactEmail: 'recruitment@ipu.ac.nz', status: 'submitted', lastUpdateNote: 'Jason-д бүх бичиг баримтыг илгээсэн.' },
    { name: 'NZLC (Language Centres)', country: 'New Zealand', contactPerson: 'Amanda Wong', contactEmail: 'amandaw@nzlc.ac.nz', status: 'under_review', lastUpdateNote: 'Amanda-гаас имэйл ирсэн. Narantungalag Ganbold-той үргэлжлүүлэн ажиллаж байна.' },
    { name: 'Languages International', country: 'New Zealand', contactPerson: 'Brett Shirreffs', contactEmail: 'brett@languages.ac.nz', status: 'applying', lastUpdateNote: 'Компанийн мэдээлэл илгээх хүлээгдэж байна.' },
    { name: 'Education Planner', country: 'Canada', contactPerson: 'Anna Liu', contactEmail: 'anna@educationplanner.ca', status: 'interested', lastUpdateNote: 'Жагсаалт ирсэн. "DD Info Request" форм бөглөх шаардлагатай.' },
    { name: 'Toronto Metropolitan University (TMU)', country: 'Canada', contactPerson: 'Intl. Admissions', contactEmail: 'international@torontomu.ca', status: 'under_review', lastUpdateNote: 'Anna Liu: PG & ESL, UG хөтөлбөрүүдтэй.' },
    { name: 'Vancouver Island University (VIU)', country: 'Canada', contactPerson: 'Support International', contactEmail: 'worldviu@viu.ca', status: 'under_review', lastUpdateNote: 'Anna Liu: Master, ESL, UG хөтөлбөрүүдтэй.' },
    { name: 'Niagara College Canada', country: 'Canada', contactPerson: 'Inquiry Response Team', contactEmail: 'international@niagaracollege.ca', status: 'contacted', lastUpdateNote: 'Автомат хариу ирсэн. Ажлын 3-5 хоногт хариу өгнө.' },
    { name: 'George Brown College', country: 'Canada', contactPerson: 'Mona Modaresi', contactEmail: 'international@georgebrown.ca', status: 'under_review', lastUpdateNote: 'Anna Liu-ийн "College" жагсаалтанд байна.' },
    { name: 'English Teaching College (ETC)', country: 'New Zealand', contactPerson: 'Peggy Chiew', contactEmail: 'peggy@etc.ac.nz', status: 'under_review', lastUpdateNote: 'Reference Check хийгдэж байна.' },
    { name: 'University of Manitoba', country: 'Canada', contactPerson: 'Undergraduate Admissions', contactEmail: 'international@umanitoba.ca', status: 'under_review', lastUpdateNote: 'MBA, Master, ESL, UG, Continuing Ed.' },
    { name: 'University Canada West (UCW)', country: 'Canada', contactPerson: 'UCW Info Team', contactEmail: 'international@ucanwest.ca', status: 'under_review', lastUpdateNote: 'PG & ESL, UG хөтөлбөрүүдтэй.' },
    { name: 'McMaster University', country: 'Canada', contactPerson: 'Nicole Stanfield', contactEmail: 'international@mcmaster.ca', status: 'dormant', lastUpdateNote: 'Шинэ агент авахгүй байгаа. Ирээдүйд хандах боломжтой.' },
    { name: 'Red River College Polytechnic', country: 'Canada', contactPerson: 'International Admissions', contactEmail: 'international@rrc.ca', status: 'contacted', lastUpdateNote: 'Автомат хариу ирсэн. Ажлын 3-5 хоногт хариу өгнө.' },
    { name: 'Sault College', country: 'Canada', contactPerson: 'International Office', contactEmail: 'international@saultcollege.ca', status: 'contacted', lastUpdateNote: 'Автомат хариу ирсэн. Ажлын 3 хоногт хариу өгнө.' },
    { name: 'Canadore College', country: 'Canada', contactPerson: 'International Office', contactEmail: 'agent.relations@canadorecollege.ca', status: 'contacted', lastUpdateNote: 'Ачаалал ихтэй байгаа тул хариу хүлээгдэж байна.' },
    { name: 'University of Otago', country: 'New Zealand', contactPerson: 'AskOtago', contactEmail: 'international.marketing@otago.ac.nz', status: 'contacted', lastUpdateNote: 'Тикет үүссэн (UO-01510214).' },
    { name: 'Otago Polytechnic', country: 'New Zealand', contactPerson: 'Cameron James-Pirie', contactEmail: 'cameron.james-pirie@op.ac.nz', status: 'contacted', lastUpdateNote: 'Захидал холбогдох ажилтан руу шилжсэн.' },
    { name: 'Fanshawe College', country: 'Canada', contactPerson: 'Wayne Racher', contactEmail: 'international@fanshawec.ca', status: 'applying', lastUpdateNote: 'Порталаар өргөдөл гаргах шаардлагатай. 2 references хэрэгтэй.' },
    { name: 'Algoma University', country: 'Canada', contactPerson: 'Jaden Cerasuolo', contactEmail: 'international@algomau.ca', status: 'submitted', lastUpdateNote: 'Онлайн форм бөглөж илгээсэн. Материал мэйлээр илгээнэ.' },
    { name: 'Centennial College', country: 'Canada', contactPerson: 'International Team', contactEmail: 'seasia@centennialcollege.ca', status: 'submitted', lastUpdateNote: 'Зүүн өмнөд Ази хариуцсан баг руу материал илгээсэн.' },
    { name: 'AUT New Zealand', country: 'New Zealand', contactPerson: 'Intl Agent Team', contactEmail: 'international.agents@aut.ac.nz', status: 'under_review', lastUpdateNote: 'Судалгааг бөглөж илгээсэн. 2-р сарын эхээр хариу өгнө.' },
    { name: 'University of Waikato', country: 'New Zealand', contactPerson: 'Partnerships Team', contactEmail: 'partnership.enquiries@waikato.ac.nz', status: 'submitted', lastUpdateNote: 'Partnerships team руу материал илгээсэн.' }
];

export async function POST(req: Request) {
    try {
        console.log('[SEED API] Request received');
        const body = await req.json();
        const { action, schoolNames } = body;
        console.log(`[SEED API] Action: ${action}, Schools: ${schoolNames?.length || 'all'}`);

        if (!db) {
            console.error('[SEED API] Database NOT initialized. Config check:', {
                hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
            });
            return NextResponse.json({
                error: 'Database not initialized. Check server environment variables.'
            }, { status: 500 });
        }

        if (action === 'clear') {
            const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
            const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'nobleworldgate-e915b';

            const listUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/partnerships?key=${apiKey}`;
            const listRes = await fetch(listUrl);
            const data = await listRes.json();

            if (data.documents) {
                console.log(`[SEED API REST] Clearing ${data.documents.length} documents`);
                for (const doc of data.documents) {
                    const deleteUrl = `https://firestore.googleapis.com/v1/${doc.name}?key=${apiKey}`;
                    await fetch(deleteUrl, { method: 'DELETE' });
                }
            }

            return NextResponse.json({ message: 'Database cleared (via REST)' });
        }

        if (action === 'seed') {
            const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
            const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'nobleworldgate-e915b';

            if (!apiKey) {
                return NextResponse.json({ error: 'Missing Firebase API Key on server.' }, { status: 500 });
            }

            let count = 0;
            const partnersToImport = schoolNames
                ? partnersData.filter(p => schoolNames.includes(p.name))
                : partnersData;

            console.log(`[SEED API REST] Starting import for ${partnersToImport.length} records`);

            for (const partner of partnersToImport) {
                console.log(`[SEED API REST] [${count + 1}/${partnersToImport.length}] Writing: ${partner.name}`);

                const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/partnerships?key=${apiKey}`;
                console.log(`[SEED API REST] URL: ${url.replace(apiKey || '', 'REDACTED')}`);

                // Map all common fields to Firestore REST string format
                const fields: any = {};
                Object.entries(partner).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        fields[key] = { stringValue: String(value) };
                    }
                });

                // Add Timestamps and Complex types
                fields.createdAt = { timestampValue: new Date().toISOString() };
                fields.updatedAt = { timestampValue: new Date().toISOString() };
                fields.statusHistory = {
                    arrayValue: {
                        values: [{
                            mapValue: {
                                fields: {
                                    status: { stringValue: partner.status },
                                    note: { stringValue: 'Initial seed data import (via REST)' },
                                    updatedAt: { timestampValue: new Date().toISOString() },
                                    updatedBy: { stringValue: 'System' }
                                }
                            }
                        }]
                    }
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fields })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`[SEED API REST] Error body for ${partner.name}:`, errorText);

                    let errorDetail = errorText;
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorDetail = errorJson.error?.message || errorText;
                    } catch (e) { }

                    throw new Error(`REST Error: ${response.status} - ${errorDetail}`);
                }

                count++;
            }
            console.log(`[SEED API REST] Successfully seeded ${count} partners`);
            return NextResponse.json({ message: `Successfully seeded ${count} partners (via REST)` });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error('Seed API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
