'use client';

import React from 'react';
import { Header, Footer } from '@/components/shared';
import { useAppStore } from '@/lib/store';

export default function TermsPage() {
    const { language } = useAppStore();

    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
            <Header />
            <main className="flex-grow pt-32 pb-20 px-6 lg:px-8">
                <div className="max-w-4xl mx-auto glass-dark rounded-[40px] p-8 lg:p-12 text-white">
                    <h1 className="text-4xl font-black mb-8">
                        {language === 'mn' ? 'Үйлчилгээний нөхцөл' : 'Terms of Service'}
                    </h1>
                    <div className="space-y-6 text-slate-300 leading-relaxed">
                        <p>
                            {language === 'mn'
                                ? 'NOBLE WORLD GATE LLC-ийн үйлчилгээг ашигласнаар та доорх нөхцөлүүдийг зөвшөөрч байгаа гэж үзнэ.'
                                : 'By using NOBLE WORLD GATE LLC services, you agree to the following terms and conditions.'}
                        </p>
                        <h2 className="text-2xl font-bold text-white mt-8">
                            {language === 'mn' ? 'Үйлчилгээ ашиглах' : 'Use of Services'}
                        </h2>
                        <p>
                            {language === 'mn'
                                ? 'Та манай системийг зөвхөн хууль ёсны зорилгоор ашиглах ёстой.'
                                : 'You must use our system only for lawful purposes.'}
                        </p>
                        {/* Add more sections as needed */}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
