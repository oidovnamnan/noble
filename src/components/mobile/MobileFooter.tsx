// Mobile-Optimized Minimalist Footer
'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/nobleworld', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/noble.consulting', label: 'Instagram' },
];

const quickLinks = [
    { href: '/#about', label: { mn: 'Бидний тухай', en: 'About Us' } },
    { href: '/#services', label: { mn: 'Үйлчилгээ', en: 'Services' } },
    { href: '/news', label: { mn: 'Мэдээ', en: 'News' } },
];

export function MobileFooter() {
    const { language } = useAppStore();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100 pt-10 pb-6 px-6">
            <div className="flex flex-col items-center text-center space-y-8">
                {/* Logo & Tagline */}
                <div className="space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
                        <span className="text-white font-black text-xl">N</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Noble World Gate</h3>
                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-[0.2em] mt-1">
                            {language === 'mn' ? 'Итгэлцэл & Амжилт' : 'Trust & Excellence'}
                        </p>
                    </div>
                </div>

                {/* Quick Links - Minimalist Row */}
                <div className="flex items-center justify-center gap-6">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
                        >
                            {link.label[language]}
                        </Link>
                    ))}
                </div>

                {/* Contact Minimalist Grid */}
                <div className="grid grid-cols-1 gap-4 w-full max-w-[280px]">
                    <a href="tel:+97677027702" className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl active:scale-95 transition-all">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                            <Phone className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-left">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Call Us</p>
                            <p className="text-sm font-bold text-gray-900">+976 7702-7702</p>
                        </div>
                    </a>
                    <a href="mailto:nobleworldgate@gmail.com" className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl active:scale-95 transition-all">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                            <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-left">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Email Us</p>
                            <p className="text-xs font-bold text-gray-900 truncate">nobleworldgate@gmail.com</p>
                        </div>
                    </a>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                    {socialLinks.map((social) => {
                        const Icon = social.icon;
                        return (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-11 h-11 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 active:bg-blue-600 active:text-white active:border-blue-600 shadow-sm transition-all"
                                aria-label={social.label}
                            >
                                <Icon className="w-5 h-5" />
                            </a>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-100" />

                {/* Bottom Bar */}
                <div className="space-y-4 w-full">
                    <p className="text-[10px] text-gray-400 font-medium">
                        © {currentYear} NOBLE WORLD GATE LLC.<br />
                        {language === 'mn' ? 'Бүх эрх хуулиар хамгаалагдсан.' : 'All rights reserved.'}
                    </p>
                    <div className="flex justify-center gap-6">
                        <Link href="/privacy" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {language === 'mn' ? 'Нууцлал' : 'Privacy'}
                        </Link>
                        <Link href="/terms" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {language === 'mn' ? 'Нөхцөл' : 'Terms'}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
