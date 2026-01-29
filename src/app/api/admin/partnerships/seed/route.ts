import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, Timestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';

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

export async function POST(req: Request) {
    try {
        const { action } = await req.json();

        if (!db) {
            return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
        }

        if (action === 'clear') {
            const snap = await getDocs(collection(db!, 'partnerships'));
            const deletions = snap.docs.map(d => deleteDoc(doc(db!, 'partnerships', d.id)));
            await Promise.all(deletions);
            return NextResponse.json({ message: 'Database cleared' });
        }

        if (action === 'seed') {
            const { schoolNames } = await req.json();
            let count = 0;
            const partnersToImport = schoolNames
                ? partnersData.filter(p => schoolNames.includes(p.name))
                : partnersData;

            for (const partner of partnersToImport) {
                await addDoc(collection(db!, 'partnerships'), {
                    ...partner,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                    statusHistory: [{
                        status: partner.status,
                        note: 'Initial seed data import (Server-side)',
                        updatedAt: Timestamp.now(),
                        updatedBy: 'System'
                    }]
                });
                count++;
            }
            return NextResponse.json({ message: `Successfully seeded ${count} partners` });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error('Seed API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
