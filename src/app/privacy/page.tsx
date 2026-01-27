'use client';

import React from 'react';
import { Header, Footer } from '@/components/shared';
import { useAppStore } from '@/lib/store';

export default function PrivacyPage() {
    const { language } = useAppStore();

    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
            <Header />
            <main className="flex-grow pt-32 pb-20 px-6 lg:px-8">
                <div className="max-w-4xl mx-auto glass-dark rounded-[40px] p-8 lg:p-12 text-white">
                    <h1 className="text-4xl font-black mb-8">
                        {language === 'mn' ? 'Нууцлалын бодлого' : 'Privacy Policy'}
                    </h1>
                    <div className="space-y-6 text-slate-300 leading-relaxed">
                        <p>
                            {language === 'mn'
                                ? 'NOBLE WORLD GATE LLC нь таны хувийн мэдээллийн нууцлалыг чандлан хамгаалахаа амлаж байна.'
                                : 'NOBLE WORLD GATE LLC is committed to protecting your personal information and privacy.'}
                        </p>
                        <h2 className="text-2xl font-bold text-white mt-8">
                            {language === 'mn' ? 'Мэдээлэл цуглуулах' : 'Data Collection'}
                        </h2>
                        <p>
                            {language === 'mn'
                                ? 'Бид таныг бүртгүүлэх, үйлчилгээ авах үед таны нэр, имэйл, утасны дугаар зэрэг мэдээллийг цуглуулдаг.'
                                : 'We collect information such as your name, email, and phone number when you register or use our services.'}
                        </p>
                        {/* Add more sections as needed */}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
