// Mobile Layout for Customer Portal
'use client';

import React from 'react';
import { BottomNav } from '@/components/mobile/BottomNav';
import { MobileFooter } from '@/components/mobile/MobileFooter';

interface MobileLayoutProps {
    children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Main Content */}
            <main className="flex-grow pb-10">
                {children}
            </main>

            {/* Mobile Footer */}
            <MobileFooter />

            {/* Bottom Navigation spacer */}
            <div className="h-20" />

            {/* Bottom Navigation */}
            <BottomNav language="mn" />
        </div>
    );
}
