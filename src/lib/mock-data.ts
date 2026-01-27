export const MOCK_SERVICES = [
    {
        id: 'diploma',
        name: { mn: 'Дипломны хөтөлбөр', en: 'Diploma Programs' },
        description: {
            mn: 'Шинэ Зеланд, Австрали, Канад улсын магадлан итгэмжлэгдсэн колежүүдэд 1-2 жилийн хугацаатай мэргэжлийн боловсрол олгох хөтөлбөрүүд. Энэхүү хөтөлбөр нь практик ур чадвар олгоход чиглэгдсэн бөгөөд төгсөөд тухайн улсдаа ажиллах эрх нээгддэгээрээ давуу талтай.',
            en: '1-2 year professional diploma programs at accredited colleges in New Zealand, Australia, and Canada. These programs focus on practical skills and often provide post-study work rights.'
        },
        category: 'education',
        processingTime: '4-6 weeks',
        isActive: true,
        displayOrder: 1,
        requiredDocuments: ['passport', 'transcript', 'english-cert'],
        steps: [
            { order: 1, title: { mn: 'Мэргэжил сонголт', en: 'Program Selection' }, description: { mn: 'Таны сонирхол болон хөдөлмөрийн зах зээлийн эрэлтэд тулгуурлан мэргэжил сонгох.', en: 'Choose a program based on your interests and market demand.' } },
            { order: 2, title: { mn: 'Элсэлтийн материал', en: 'Application' }, description: { mn: 'Сургуулийн элсэлтийн шаардлага хангасан материалуудыг бүрдүүлж илгээх.', en: 'Prepare and submit documents according to school requirements.' } },
            { order: 3, title: { mn: 'Урилга хүлээн авах', en: 'Offer Letter' }, description: { mn: 'Сургуулиас суралцах эрхийн бичиг буюу Offer Letter хүлээн авах.', en: 'Receive your formal offer of place from the institution.' } }
        ],
        faq: [
            { q: 'Англи хэлний оноо шаардлагатай юу?', a: 'Тийм, ихэнхдээ IELTS 5.5-6.0 эсвэл түүнтэй дүйцэх оноо шаардагдана. Хэрэв оноо байхгүй бол сургуулийн хэлний бэлтгэлээс эхэлж болно.' },
            { q: 'Ажиллах эрх өгөх үү?', a: 'Тийм, суралцаж байх хугацаандаа долоо хоногийн 20 цаг, амралтын хугацаанд бүтэн цагаар ажиллах эрхтэй.' }
        ]
    },
    {
        id: 'undergrad',
        name: { mn: 'Бакалаврын хөтөлбөр', en: 'Undergraduate Programs' },
        description: {
            mn: 'Дэлхийн шилдэг QS Ranking-тай их сургуулиудад академик боловсрол эзэмших боломж. Бид танд сургууль сонголтоос эхлээд тэтгэлэгт хамрагдах, визний материал бүрдүүлэх хүртэлх бүх шатанд мэргэжлийн зөвлөгөө өгч ажиллана.',
            en: 'Opportunities for academic excellence at top QS-ranked universities globally. We provide end-to-end consulting from university selection and scholarship applications to visa processing.'
        },
        category: 'education',
        processingTime: '8-12 weeks',
        isActive: true,
        displayOrder: 2,
        requiredDocuments: ['passport', 'high-school-diploma', 'transcript', 'ielts-toefl', 'sop'],
        steps: [
            { order: 1, title: { mn: 'Зөвлөгөө', en: 'Consultation' }, description: { mn: 'Суралцах зорилго, төсөвт тохирсон сургууль, улсыг тодорхойлох.', en: 'Identify suitable universities and countries based on goals and budget.' } },
            { order: 2, title: { mn: 'Тэтгэлэг хайх', en: 'Scholarship Search' }, description: { mn: 'Боломжит тэтгэлэгт хөтөлбөрүүдийг судалж, өргөдөл гаргах.', en: 'Research and apply for available scholarship opportunities.' } },
            { order: 3, title: { mn: 'Визний бэлтгэл', en: 'Visa Preparation' }, description: { mn: 'Санхүүгийн баталгаа болон бусад визний бичиг баримтыг бэлдэх.', en: 'Prepare financial proof and other visa-related documentation.' } }
        ],
        faq: [
            { q: 'Тэтгэлэг авах боломж хэр байдаг вэ?', a: 'Таны сурлагын дүн, англи хэлний оноо болон нийгмийн идэвхээс хамаарч 20-100% тэтгэлэг авах боломжтой.' },
            { q: 'Элсэлт хэзээ авдаг вэ?', a: 'Ихэнх улс орнууд 9-р сар болон 2-р сард үндсэн элсэлтээ авдаг.' }
        ]
    },
    {
        id: 'visa-consult',
        name: { mn: 'Визний зөвлөгөө', en: 'Visa Consulting' },
        description: {
            mn: 'Манай визний мэргэжилтнүүд Шинэ Зеланд, Австрали, АНУ, Шенгений орнуудын виз мэдүүлгийн хууль тогтоомж, журмын өөрчлөлтийг цаг алдалгүй судалж, таны виз гарах магадлалыг хамгийн дээд түвшинд хүргэж ажилладаг. Сүүлийн 5 жилийн виз олголтын амжилт 95%.',
            en: 'Our visa specialists stay updated with the latest regulations for NZ, Australia, USA, and Schengen countries to maximize your success rate. We maintain a 95% visa approval record over the last 5 years.'
        },
        category: 'visa',
        processingTime: '3-10 days',
        isActive: true,
        displayOrder: 3,
        requiredDocuments: ['passport', 'bank-statement', 'employment-proof', 'legal-docs'],
        steps: [
            { order: 1, title: { mn: 'Төлөв байдал', en: 'Assessment' }, description: { mn: 'Таны виз гарах магадлалыг урьдчилсан байдлаар дүгнэх.', en: 'Evaluate your initial visa success probability.' } },
            { order: 2, title: { mn: 'Материал бүрдүүлэлт', en: 'Documentation' }, description: { mn: 'Элчин сайдын яамны шаардлагад нийцүүлэн материалыг цэгцлэх.', en: 'Organize documents according to embassy requirements.' } },
            { order: 3, title: { mn: 'Ярилцлагын бэлтгэл', en: 'Interview Prep' }, description: { mn: 'Визний ярилцлагад ороход бэлтгэж, зөвлөгөө өгөх.', en: 'Provide coaching and tips for the visa interview.' } }
        ]
    },
    {
        id: 'travel-nz',
        name: { mn: 'Шинэ Зеландын аялал', en: 'New Zealand Travel' },
        description: {
            mn: 'Шинэ Зеланд улсын байгалийн үзэсгэлэнт газруудаар аялах цогц хөтөлбөр. Бид таны аяллын маршрутыг төлөвлөх, зочид буудал захиалах, виз мэдүүлэх зэрэг бүхий л асуудлыг хариуцаж, танд мартагдашгүй дурсамж үлдээхэд туслах болно.',
            en: 'Comprehensive travel packages to explore the natural wonders of New Zealand. We handle everything from itinerary planning and hotel bookings to visa applications for an unforgettable experience.'
        },
        category: 'travel',
        processingTime: '2-4 weeks',
        isActive: true,
        displayOrder: 4,
        requiredDocuments: ['passport', 'financial-proof', 'travel-itinerary'],
        steps: [
            { order: 1, title: { mn: 'Маршрут', en: 'Itinerary' }, description: { mn: 'Таны сонирхолд нийцсэн аяллын төлөвлөгөө гаргах.', en: 'Create a customized travel plan based on your interests.' } },
            { order: 2, title: { mn: 'Виз мэдүүлэх', en: 'Visa Application' }, description: { mn: 'Аяллын визний материалыг бүрдүүлж, мэдүүлэх.', en: 'Prepare and submit your tourist visa application.' } }
        ]
    },
    {
        id: 'work-nz',
        name: { mn: 'Ажлын зуучлал', en: 'Job Recruitment' },
        description: {
            mn: 'Шинэ Зеланд болон бусад улс орнуудад мэргэжлээрээ ажиллах, дадлагажих хүсэлтэй залуусыг ажил олгогчидтой холбох гүүр болж ажиллана. Бид зөвхөн итгэмжлэгдсэн ажил олгогчидтой хамтран ажиллаж, хууль ёсны дагуу ажиллах боломжийг олгодог.',
            en: 'Bridging the gap between young professionals and employers in New Zealand and beyond. We partner exclusively with accredited employers to ensure legal and secure work opportunities.'
        },
        category: 'work',
        processingTime: '3-6 months',
        isActive: true,
        displayOrder: 5,
        requiredDocuments: ['passport', 'cv', 'experience-proof', 'criminal-record'],
        steps: [
            { order: 1, title: { mn: 'CV бэлтгэл', en: 'CV Preparation' }, description: { mn: 'Олон улсын стандартад нийцсэн CV болон Cover Letter бэлтгэх.', en: 'Prepare an international standard CV and Cover Letter.' } },
            { order: 2, title: { mn: 'Ажил олгогчийн хайлт', en: 'Employer Match' }, description: { mn: 'Тохирох ажил олгогчийг олж, ярилцлага товлох.', en: 'Find matching employers and schedule interviews.' } }
        ]
    }
];

export const MOCK_DOC_TYPES = {
    'passport': { id: 'passport', name: { mn: 'Гадаад паспорт', en: 'Passport' } },
    'transcript': { id: 'transcript', name: { mn: 'Дүнгийн хуулбар', en: 'Academic Transcript' } },
    'ielts': { id: 'ielts', name: { mn: 'Англи хэлний оноо', en: 'IELTS/TOEFL Score' } }
};

export const MOCK_NEWS = [
    {
        id: 'news-1',
        title: { mn: "Шинэ Зеландын 'Working Holiday' визний бүртгэл эхэллээ", en: "New Zealand Working Holiday Visa 2026 Registration Open" },
        content: {
            mn: "<p>Шинэ Зеланд улсад аялангаа ажиллах боломжтой 'Working Holiday' визний 2026 оны бүртгэл албан ёсоор эхэллээ.</p>",
            en: "<p>Registration for the 2026 New Zealand Working Holiday Visa is officially open.</p>"
        },
        category: "work",
        coverImage: "https://images.unsplash.com/photo-1507699622177-38889b583133?q=80&w=1000&auto=format&fit=crop",
        isPublished: true,
        publishedAt: new Date('2026-01-20'),
        views: 156
    },
    {
        id: 'news-2',
        title: { mn: "Солонгосын засгийн газрын тэтгэлэг (GKS) зарлагдлаа", en: "Global Korea Scholarship (GKS) Announced" },
        content: {
            mn: "<p>БНСУ-ын засгийн газрын тэтгэлэгт хөтөлбөр (GKS) зарлагдлаа.</p>",
            en: "<p>The Global Korea Scholarship (GKS) has been announced.</p>"
        },
        category: "education",
        coverImage: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1000&auto=format&fit=crop",
        isPublished: true,
        publishedAt: new Date('2026-01-15'),
        views: 890
    }
];
