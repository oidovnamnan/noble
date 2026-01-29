// Admin Layout wrapper
'use client';

import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Bell, Search, User as UserIcon, Globe, Moon, Sun, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const { sidebarOpen, language, setLanguage } = useAppStore();

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading || (!isAuthenticated && !user)) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Хянаж байна...</p>
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div
                className={cn(
                    "flex-1 flex flex-col transition-all duration-300",
                    sidebarOpen ? "pl-64" : "pl-20"
                )}
            >
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Хайх..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setLanguage(language === 'mn' ? 'en' : 'mn')}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-all font-bold text-xs"
                        >
                            <Globe className="w-4 h-4" />
                            <span className="uppercase">{language}</span>
                        </button>
                        <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-all">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="h-6 w-[1px] bg-slate-200 mx-2" />
                        <button
                            onClick={() => router.push('/profile')}
                            className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-50 rounded-xl transition-all group border border-transparent hover:border-slate-100"
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                                {user?.firstName?.charAt(0) || 'A'}
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-slate-900 leading-none">{user?.lastName} {user?.firstName}</p>
                                <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase">{user?.role === 'admin' ? 'SYSTEM ADMIN' : 'STAFF'}</p>
                            </div>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
