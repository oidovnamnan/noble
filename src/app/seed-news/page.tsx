'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Loader2, CheckCircle } from 'lucide-react';

const newsData = [
    {
        title: { mn: "Шинэ Зеландын 'Working Holiday' визний бүртгэл эхэллээ", en: "New Zealand Working Holiday Visa 2026 Registration Open" },
        content: {
            mn: "<p>Шинэ Зеланд улсад аялангаа ажиллах боломжтой 'Working Holiday' визний 2026 оны бүртгэл албан ёсоор эхэллээ. Энэхүү виз нь залуучуудад 12 сарын хугацаанд тус улсад амьдрах, аялах, мөн хууль ёсоор хөдөлмөр эрхлэх боломжийг олгодог.</p><p><strong>Тавигдах шаардлага:</strong></p><ul><li>18-30 насны байх</li><li>Эрүүл мэндийн болон гэмт хэрэгт холбогдоогүй байх</li><li>Санхүүгийн баталгаатай байх</li></ul>",
            en: "<p>Registration for the 2026 New Zealand Working Holiday Visa is officially open. This visa allows young people to live, travel, and work legally in the country for up to 12 months.</p><p><strong>Requirements:</strong></p><ul><li>Aged 18-30</li><li>Good health and character</li><li>Proof of funds</li></ul>"
        },
        excerpt: { mn: "12 сарын хугацаанд Шинэ Зеландад аялангаа ажиллах боломж.", en: "Opportunity to travel and work in New Zealand for 12 months." },
        category: "work",
        coverImage: "https://images.unsplash.com/photo-1507699622177-38889b583133?q=80&w=1000&auto=format&fit=crop",
        author: { id: "admin", name: "Noble Admin" },
        isPublished: true,
        publishedAt: new Date('2026-01-12'),
        views: 156
    },
    {
        title: { mn: "Солонгосын засгийн газрын тэтгэлэг (GKS) зарлагдлаа", en: "Global Korea Scholarship (GKS) Announced" },
        content: {
            mn: "<p>БНСУ-ын засгийн газрын тэтгэлэгт хөтөлбөр (GKS) нь гадаад оюутнуудад Солонгосын их дээд сургуулиудад бакалавр, магистр, докторын зэргээр үнэ төлбөргүй суралцах боломжийг олгодог.</p><p>Тэтгэлэгт сургалтын төлбөр, сар бүрийн амьжиргааны зардал, онгоцны тийз зэрэг багтсан.</p>",
            en: "<p>The Global Korea Scholarship (GKS) offers international students the opportunity to study at Korean universities for undergraduate and graduate degrees tuition-free.</p><p>The scholarship covers tuition, monthly stipend, and airfare.</p>"
        },
        excerpt: { mn: "БНСУ-д 100% тэтгэлэгтэй суралцах алтан боломж.", en: "Golden opportunity to study in Korea with 100% scholarship." },
        category: "education",
        coverImage: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1000&auto=format&fit=crop",
        author: { id: "admin", name: "Noble Admin" },
        isPublished: true,
        publishedAt: new Date('2026-01-10'),
        views: 890
    },
    {
        title: { mn: "Австралийн оюутны визний цагт өөрчлөлт орлоо", en: "Changes to Australian Student Visa Work Hours" },
        content: {
            mn: "<p>Австралийн засгийн газраас гадаад оюутнуудын ажиллах цагийн хязгаарлалтыг шинэчиллээ. Оюутнууд одоо хичээлийн үеэр хоёр долоо хоногт 48 цаг ажиллах эрхтэй болж байна.</p><p>Энэ нь өмнөх 40 цагийн хязгаарыг нэмэгдүүлсэн таатай мэдээ юм.</p>",
            en: "<p>The Australian government has updated work hour limits for international students. Students are now allowed to work 48 hours per fortnight during school terms.</p><p>This is an increase from the previous 40-hour limit.</p>"
        },
        excerpt: { mn: "Гадаад оюутнууд 2 долоо хоногт 48 цаг ажиллах боломжтой боллоо.", en: "International students can now work 48 hours per fortnight." },
        category: "work",
        coverImage: "https://images.unsplash.com/photo-1523482580672-01e6f083734b?q=80&w=1000&auto=format&fit=crop",
        author: { id: "admin", name: "Noble Admin" },
        isPublished: true,
        publishedAt: new Date('2026-01-08'),
        views: 432
    },
    {
        title: { mn: "Европ руу аялах: Шенгений визний зөвлөгөө", en: "Traveling to Europe: Schengen Visa Tips" },
        content: {
            mn: "<p>Европын 27 улсаар чөлөөтэй аялах боломжтой Шенгений визийг хэрхэн амжилттай мэдүүлэх вэ?</p><ol><li>Аяллын төлөвлөгөөгөө тодорхой гаргах</li><li>Санхүүгийн баталгааг үнэн зөв бүрдүүлэх</li><li>Даатгалд хамрагдах</li></ol>",
            en: "<p>How to successfully apply for a Schengen visa to travel freely across 27 European countries?</p><ol><li>Clear travel itinerary</li><li>Accurate proof of funds</li><li>Travel insurance</li></ol>"
        },
        excerpt: { mn: "Шенгений виз мэдүүлэхэд анхаарах 3 чухал зүйл.", en: "3 important things to know when applying for a Schengen visa." },
        category: "travel",
        coverImage: "https://images.unsplash.com/photo-1471623432079-b009d30b6729?q=80&w=1000&auto=format&fit=crop",
        author: { id: "admin", name: "Noble Admin" },
        isPublished: true,
        publishedAt: new Date('2026-01-05'),
        views: 210
    },
    {
        title: { mn: "Германы 'Chancenkarte' буюу Боломжийн Карт", en: "Germany's Opportunity Card Explained" },
        content: {
            mn: "<p>Герман улс гадаадын мэргэжилтнүүдийг татах зорилгоор 'Chancenkarte' буюу оноонд суурилсан шинэ визний системийг нэвтрүүлж байна. Энэ нь ажил хайх зорилгоор Германд ирэх боломжийг олгоно.</p><p>Боловсрол, хэлний мэдлэг, нас, ажлын туршлага зэргээр оноо цуглуулна.</p>",
            en: "<p>Germany is introducing the 'Opportunity Card', a points-based visa system to attract skilled workers. This allows you to come to Germany to look for work.</p><p>Points are awarded for education, language skills, age, and experience.</p>"
        },
        excerpt: { mn: "Германд ажил хайх шинэ боломж нээгдлээ.", en: "New opportunity to look for work in Germany." },
        category: "work",
        coverImage: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1000&auto=format&fit=crop",
        author: { id: "admin", name: "Noble Admin" },
        isPublished: true,
        publishedAt: new Date('2026-01-03'),
        views: 654
    },
    {
        title: { mn: "Шинэ Зеланд: Байгалийн үзэсгэлэнт газрууд", en: "New Zealand: Must-Visit Natural Wonders" },
        content: {
            mn: "<p>Бөгжний эзэн киноны зураг авалт хийгдсэн Hobbiton-оос эхлээд Milford Sound-ийн гайхалтай фьордуудыг үзэх боломжтой. Шинэ Зеланд бол байгальд хайртай хүмүүсийн диваажин юм.</p>",
            en: "<p>From Hobbiton where Lord of the Rings was filmed to the breathtaking fjords of Milford Sound. New Zealand is a paradise for nature lovers.</p>"
        },
        excerpt: { mn: "Шинэ Зеландын аялал жуулчлалын шилдэг цэгүүд.", en: "Top tourist destinations in New Zealand." },
        category: "travel",
        coverImage: "https://images.unsplash.com/photo-1469521669194-babb45f83544?q=80&w=1000&auto=format&fit=crop",
        author: { id: "admin", name: "Noble Admin" },
        isPublished: true,
        publishedAt: new Date('2026-01-01'),
        views: 345
    },
    {
        title: { mn: "Солонгос улсад ажиллах E-9 визний мэдээлэл", en: "Korea E-9 Working Visa Information" },
        content: {
            mn: "<p>Солонгос улсад гэрээгээр ажиллах хүсэлтэй иргэдэд зориулсан E-9 визний шалгалт болон бүртгэлийн үйл явцын талаар дэлгэрэнгүй мэдээлэл.</p><p>Солонгос хэлний түвшин тогтоох шалгалт (EPS-TOPIK)-д бэлдэх зөвлөмжүүд.</p>",
            en: "<p>Detailed information on the E-9 visa exam and registration process for those wishing to work in Korea under contract.</p><p>Tips for preparing for the EPS-TOPIK Korean language proficiency test.</p>"
        },
        excerpt: { mn: "Гэрээт ажилчны визний шаардлага ба шалгалт.", en: "Requirements and exams for contract worker visas." },
        category: "visa",
        coverImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop",
        author: { id: "admin", name: "Noble Admin" },
        isPublished: true,
        publishedAt: new Date('2025-12-28'),
        views: 1102
    },
    {
        title: { mn: "IELTS эсвэл TOEFL: Аль шалгалтыг өгөх вэ?", en: "IELTS vs TOEFL: Which test should you take?" },
        content: {
            mn: "<p>Гадаадад сурахад хэлний оноо хамгийн чухал. Их Британи, Австралид IELTS илүү түгээмэл байдаг бол АНУ-д TOEFL давуу талтай байж мэднэ. Гэхдээ ихэнх сургуулиуд хоёуланг нь хүлээн зөвшөөрдөг.</p>",
            en: "<p>Language scores are crucial for studying abroad. IELTS is more common in UK/Australia, while TOEFL might be preferred in USA. However, most universities accept both.</p>"
        },
        excerpt: { mn: "Англи хэлний шалгалтуудын ялгаа болон сонголт.", en: "Differences and choices between English language tests." },
        category: "education",
        coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop",
        author: { id: "admin", name: "Noble Admin" },
        isPublished: true,
        publishedAt: new Date('2025-12-25'),
        views: 765
    },
    {
        title: { mn: "Визний ярилцлагад хэрхэн бэлдэх вэ?", en: "How to Prepare for a Visa Interview" },
        content: {
            mn: "<p>Визний ярилцлагад орохдоо өөртөө итгэлтэй байдал, үнэн зөв хариулт хамгийн чухал. Ярилцлагын үеэр ирдэг нийтлэг асуултууд болон тэдгээрт хэрхэн хариулах зөвлөгөө.</p>",
            en: "<p>Confidence and honest answers are key during a visa interview. Common interview questions and tips on how to answer them.</p>"
        },
        excerpt: { mn: "Амжилттай ярилцлага хийх зөвлөмжүүд.", en: "Tips for a successful interview." },
        category: "visa",
        coverImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop",
        author: { id: "admin", name: "Noble Admin" },
        isPublished: true,
        publishedAt: new Date('2025-12-20'),
        views: 888
    },
    {
        title: { mn: "Австрали: Сидней хотоор аялах хөтөч", en: "Australia: Sydney Travel Guide" },
        content: {
            mn: "<p>Дуурийн театр (Opera House)-аас эхлээд Бонди далайн эрэг хүртэл. Сидней хотод заавал үзэх ёстой газрууд болон нийтийн тээврээр зорчих зөвлөмж.</p>",
            en: "<p>From the Opera House to Bondi Beach. Must-see places in Sydney and tips for getting around by public transport.</p>"
        },
        excerpt: { mn: "Сидней хотын аяллын төлөвлөгөө.", en: "Sydney travel itinerary." },
        category: "travel",
        coverImage: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000&auto=format&fit=crop",
        author: { id: "admin", name: "Noble Admin" },
        isPublished: true,
        publishedAt: new Date('2025-12-15'),
        views: 320
    }
];

export default function SeedNewsPage() {
    const [status, setStatus] = useState('idle');
    const [log, setLog] = useState<string[]>([]);

    const seed = async () => {
        setStatus('loading');
        setLog([]);
        try {
            if (!db) {
                throw new Error('Firebase DB is not initialized. Please check configuration.');
            }

            for (const item of newsData) {
                await addDoc(collection(db, 'news'), {
                    ...item,
                    createdAt: Timestamp.fromDate(new Date()),
                    updatedAt: Timestamp.fromDate(new Date()),
                    publishedAt: Timestamp.fromDate(item.publishedAt)
                });
                setLog(prev => [...prev, `Added: ${item.title.mn} (${item.category})`]);
            }
            setStatus('success');
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setLog(prev => [...prev, `Error: ${error?.message || error}`]);
        }
    };

    useEffect(() => {
        // Only run seed explicitly when user clicks, or keep auto-seed with safety check
        // Here we'll keep auto-seed but with robust check
        if (typeof window !== 'undefined') {
            const timer = setTimeout(() => {
                seed();
            }, 1000); // Give Firebase a moment to initialize
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <div className="p-10 max-w-lg mx-auto text-center space-y-6">
            <h1 className="text-2xl font-bold">News Seeding</h1>

            {status === 'loading' && (
                <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-2" />
                    <p className="text-gray-500">Adding news items to Firestore...</p>
                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col items-center text-green-600">
                    <CheckCircle className="w-16 h-16 mb-2" />
                    <p className="font-bold">Successfully populated 10 news items!</p>
                </div>
            )}

            {status === 'error' && (
                <div className="text-red-500 font-bold mb-4">
                    An error occurred.
                </div>
            )}

            <div className="text-left bg-gray-100 p-4 rounded-xl text-xs font-mono h-64 overflow-y-auto">
                {log.map((l, i) => <div key={i}>{l}</div>)}
            </div>

            {status === 'error' && (
                <button
                    onClick={seed}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                >
                    Retry
                </button>
            )}
        </div>
    );
}
