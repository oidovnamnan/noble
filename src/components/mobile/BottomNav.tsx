// Mobile Bottom Navigation Component
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, FileText, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', icon: Home, labelMn: 'Нүүр', labelEn: 'Home' },
    { href: '/services', icon: Briefcase, labelMn: 'Үйлчилгээ', labelEn: 'Services' },
    { href: '/my-applications', icon: FileText, labelMn: 'Хүсэлт', labelEn: 'Apps' },
    { href: '/chat', icon: MessageCircle, labelMn: 'Туслах', labelEn: 'Chat' },
    { href: '/profile', icon: User, labelMn: 'Профайл', labelEn: 'Profile' },
];

interface BottomNavProps {
    language?: 'mn' | 'en';
}

export function BottomNav({ language = 'mn' }: BottomNavProps) {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-bottom">
            <div className="max-w-lg mx-auto px-2">
                <div className="flex items-center justify-around py-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href));
                        const Icon = item.icon;
                        const label = language === 'mn' ? item.labelMn : item.labelEn;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200',
                                    isActive
                                        ? 'text-blue-600'
                                        : 'text-gray-400 hover:text-gray-600'
                                )}
                            >
                                <div className={cn(
                                    'p-1.5 rounded-xl transition-all duration-200',
                                    isActive && 'bg-blue-50'
                                )}>
                                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={cn(
                                    'text-[10px] font-medium',
                                    isActive && 'font-semibold'
                                )}>
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
