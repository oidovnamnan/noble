// Profile Page
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    User,
    Settings,
    Bell,
    Shield,
    LogOut,
    ChevronRight,
    Mail,
    Phone,
    CreditCard,
    Globe,
    Loader2
} from 'lucide-react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Card, Button, Badge } from '@/components/ui';
import { useAuthStore, useAppStore } from '@/lib/store';
import { auth } from '@/lib/firebase/config';
import { signOut } from 'firebase/auth';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, logout: storeLogout } = useAuthStore();
    const { language, setLanguage } = useAppStore();

    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleLogout = async () => {
        try {
            if (auth) {
                await signOut(auth);
            }
            storeLogout();
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (isLoading) {
        return (
            <MobileLayout>
                <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-gray-500 font-medium">Уншиж байна...</p>
                </div>
            </MobileLayout>
        );
    }

    if (!isAuthenticated) return null;


    const menuItems = [
        {
            title: 'Хувийн мэдээлэл',
            titleEn: 'Personal Info',
            icon: User,
            href: '/profile/edit',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Төлбөрийн түүх',
            titleEn: 'Payments',
            icon: CreditCard,
            href: '/profile/payments',
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
        },
        {
            title: 'Мэдэгдэл',
            titleEn: 'Notifications',
            icon: Bell,
            href: '/profile/notifications',
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
        },
        {
            title: 'Аюулгүй байдал',
            titleEn: 'Security',
            icon: Shield,
            href: '/profile/security',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
    ];

    return (
        <MobileLayout>
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40 px-4 py-4">
                <h1 className="text-xl font-bold text-gray-900">Миний профайл</h1>
            </header>

            <div className="px-4 py-6 space-y-6">
                {/* User Card */}
                <section className="flex items-center gap-4 bg-gradient-primary p-6 rounded-3xl text-white shadow-xl shadow-blue-500/20">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 text-2xl font-bold">
                        {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold">
                            {user ? `${user.lastName} ${user.firstName}` : 'Зочин'}
                        </h2>
                        <p className="text-blue-100 text-sm">{user?.email || 'нэвтрэх шаардлагатай'}</p>
                        <div className="mt-2">
                            <Badge variant="purple" className="bg-white/20 text-white border-none text-[10px]">
                                {user?.role === 'admin' ? 'АДМИН' : user?.role === 'staff' ? 'МЕНЕЖЕР' : 'ҮЙЛЧЛҮҮЛЭГЧ'}
                            </Badge>
                        </div>
                    </div>
                </section>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <Card variant="outlined" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                            <Mail className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-400 font-medium">ИМЭЙЛ</p>
                            <p className="text-xs font-semibold truncate text-gray-700">{user?.email || '-'}</p>
                        </div>
                    </Card>
                    <Card variant="outlined" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                            <Phone className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-400 font-medium">УТАС</p>
                            <p className="text-xs font-semibold text-gray-700">{user?.phone || '-'}</p>
                        </div>
                    </Card>
                </div>

                {/* Menu Items */}
                <section className="space-y-2">
                    <h3 className="text-sm font-bold text-gray-400 ml-1 mb-3">ТОХИРГОО</h3>
                    <Card variant="outlined" padding="none" className="overflow-hidden">
                        {menuItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
                                        }`}
                                >
                                    <div className={`w-10 h-10 ${item.bgColor} rounded-xl flex items-center justify-center`}>
                                        <Icon className={`w-5 h-5 ${item.color}`} />
                                    </div>
                                    <span className="flex-1 font-semibold text-gray-700 text-sm">
                                        {language === 'mn' ? item.title : item.titleEn}
                                    </span>
                                    <ChevronRight className="w-5 h-5 text-gray-300" />
                                </Link>
                            );
                        })}
                    </Card>
                </section>

                {/* Language & Utilities */}
                <section className="space-y-2">
                    <h3 className="text-sm font-bold text-gray-400 ml-1 mb-3">БУСАД</h3>
                    <Card variant="outlined" padding="none" className="overflow-hidden">
                        <div className="flex items-center gap-4 p-4 border-b border-gray-50">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <Globe className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-700 text-sm">Хэл сонгох</p>
                                <p className="text-xs text-gray-400">{language === 'mn' ? 'Монгол' : 'English'}</p>
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setLanguage('mn')}
                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${language === 'mn' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'
                                        }`}
                                >
                                    MN
                                </button>
                                <button
                                    onClick={() => setLanguage('en')}
                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'
                                        }`}
                                >
                                    EN
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors text-red-600 group"
                        >
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                <LogOut className="w-5 h-5" />
                            </div>
                            <span className="flex-1 font-bold text-sm text-left">Системээс гарах</span>
                            <ChevronRight className="w-5 h-5 text-red-200" />
                        </button>
                    </Card>
                </section>

                <div className="text-center pt-4">
                    <p className="text-xs text-gray-400">Noble Consulting v1.0.0</p>
                </div>
            </div>
        </MobileLayout>
    );
}
