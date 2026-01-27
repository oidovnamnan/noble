// Desktop Header Component
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useAppStore, useAuthStore } from '@/lib/store';

const navItems = [
    { href: '/#about', label: { mn: 'Бидний тухай', en: 'About' } },
    { href: '/#services', label: { mn: 'Үйлчилгээ', en: 'Services' } },
    { href: '/#partners', label: { mn: 'Хамтрагчид', en: 'Partners' } },
    { href: '/#contact', label: { mn: 'Холбоо барих', en: 'Contact' } },
];

export function Header() {
    const { language, setLanguage } = useAppStore();
    const { isAuthenticated, user } = useAuthStore();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) return null;

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-black/10'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                            <span className="text-white font-black text-lg">N</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-tight">Noble World Gate</h1>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{language === 'mn' ? 'Боловсрол & Виз Зуучлал' : 'Education & Visa Consulting'}</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                            >
                                {item.label[language]}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        {/* Language Toggle */}
                        <button
                            onClick={() => setLanguage(language === 'mn' ? 'en' : 'mn')}
                            className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        >
                            <Globe className="w-4 h-4" />
                            {language === 'mn' ? 'EN' : 'MN'}
                        </button>

                        {/* Conditional Auth Button */}
                        {isAuthenticated ? (
                            <Link
                                href="/profile"
                                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-bold text-sm rounded-xl hover:bg-white/20 transition-all border border-white/10"
                            >
                                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs text-slate-900">
                                    {user?.firstName?.charAt(0) || 'U'}
                                </div>
                                {language === 'mn' ? 'Профайл' : 'Profile'}
                            </Link>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="hidden sm:inline-flex px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold text-sm rounded-xl hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105"
                            >
                                {language === 'mn' ? 'Эхлэх' : 'Get Started'}
                            </Link>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-slate-900/98 backdrop-blur-xl border-t border-slate-800"
                    >
                        <nav className="px-6 py-4 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                >
                                    {item.label[language]}
                                </Link>
                            ))}
                            <Link
                                href="/auth/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 mt-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold text-center rounded-xl"
                            >
                                {language === 'mn' ? 'Эхлэх' : 'Get Started'}
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
