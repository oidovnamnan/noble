// Admin Sidebar Component
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    FileText,
    Newspaper,
    Settings,
    Briefcase,
    CreditCard,
    LogOut,
    ChevronLeft,
    Menu,
    FileBadge,
    Image
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore, useAuthStore } from '@/lib/store';
import { useTranslation } from '@/hooks/useTranslation';
import { auth } from '@/lib/firebase/config';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const menuItems = [
    {
        group: 'admin.menu.main', items: [
            { href: '/admin', icon: LayoutDashboard, label: 'admin.dashboard' },
            { href: '/admin/customers', icon: Users, label: 'admin.customers' },
            { href: '/admin/applications', icon: FileText, label: 'admin.applications' },
        ]
    },
    {
        group: 'admin.menu.content', items: [
            { href: '/admin/news', icon: Newspaper, label: 'admin.news' },
            { href: '/admin/services', icon: Briefcase, label: 'admin.services' },
            { href: '/admin/document-types', icon: FileBadge, label: 'admin.documentTypes' },
            { href: '/admin/posters', icon: Image, label: 'admin.posters' },
        ]
    },
    {
        group: 'admin.menu.system', items: [
            { href: '/admin/staff', icon: Users, label: 'admin.staff' },
            { href: '/admin/payments', icon: CreditCard, label: 'admin.payments' },
            { href: '/admin/settings', icon: Settings, label: 'admin.settings' },
        ]
    },
];

export function AdminSidebar() {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();
    const { sidebarOpen, toggleSidebar } = useAppStore();
    const { logout: storeLogout } = useAuthStore();

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

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen bg-slate-900 text-slate-300 transition-all duration-300 z-50 flex flex-col",
                sidebarOpen ? "w-64" : "w-20"
            )}
        >
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/50">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">N</span>
                </div>
                {sidebarOpen && (
                    <span className="ml-3 font-bold text-white tracking-widest text-sm">NOBLE ADMIN</span>
                )}
            </div>

            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-20 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-50"
            >
                {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto pt-8 px-3 space-y-8 scrollbar-hide">
                {menuItems.map((group, idx) => (
                    <div key={idx} className="space-y-4">
                        {sidebarOpen && (
                            <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {t(group.group)}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center p-3 rounded-xl transition-all duration-200 group",
                                            isActive
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                                : "hover:bg-slate-800 hover:text-white"
                                        )}
                                    >
                                        <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "" : "text-slate-500 group-hover:text-slate-300")} />
                                        {sidebarOpen && (
                                            <span className="ml-3 text-sm font-medium">{t(item.label)}</span>
                                        )}
                                        {!sidebarOpen && (
                                            <div className="absolute left-20 bg-slate-800 text-white px-3 py-1.5 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-all ml-2 whitespace-nowrap shadow-xl">
                                                {t(item.label)}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/30">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center p-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors group"
                >
                    <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-500" />
                    {sidebarOpen && (
                        <span className="ml-3 text-sm font-medium">{t('auth.logout')}</span>
                    )}
                </button>
            </div>
        </aside>
    );
}
