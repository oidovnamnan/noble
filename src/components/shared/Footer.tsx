// Footer Component
'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Send } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/nobleworld', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/noble.consulting', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/nobleworldgate', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/nobleworldgate', label: 'LinkedIn' },
];

const quickLinks = [
    { href: '/#services', label: { mn: 'Үйлчилгээ', en: 'Services' } },
    { href: '/#partners', label: { mn: 'Хамтрагчид', en: 'Partners' } },
    { href: '/#about', label: { mn: 'Бидний тухай', en: 'About Us' } },
    { href: '/news', label: { mn: 'Мэдээ', en: 'News' } },
];

const services = [
    { href: '/services?category=education', label: { mn: 'Боловсрол', en: 'Education' } },
    { href: '/services?category=travel', label: { mn: 'Аялал', en: 'Travel' } },
    { href: '/services?category=work', label: { mn: 'Ажил', en: 'Work' } },
    { href: '/services?category=visa', label: { mn: 'Виз', en: 'Visa' } },
];

export function Footer() {
    const { language } = useAppStore();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <footer id="contact" className="bg-slate-900 border-t border-slate-800">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-black text-lg">N</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Noble World Gate</h3>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            {language === 'mn'
                                ? 'Таны ирээдүйг хамтдаа. Олон улсын боловсрол, виз, ажлын зуучлалын мэргэжлийн зөвлөгөө.'
                                : 'Your future, together. Expert guidance for international education, visa, and career services.'}
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-slate-800 hover:bg-amber-500 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all"
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">
                            {language === 'mn' ? 'Холбоосууд' : 'Quick Links'}
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-amber-400 transition-colors text-sm"
                                    >
                                        {link.label[language]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-bold mb-6">
                            {language === 'mn' ? 'Үйлчилгээ' : 'Services'}
                        </h4>
                        <ul className="space-y-3">
                            {services.map((service) => (
                                <li key={service.href}>
                                    <Link
                                        href={service.href}
                                        className="text-slate-400 hover:text-amber-400 transition-colors text-sm"
                                    >
                                        {service.label[language]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-6">
                            {language === 'mn' ? 'Холбоо барих' : 'Contact'}
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-4 h-4 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">+976 7702-7702</p>
                                    <p className="text-slate-500 text-xs">{language === 'mn' ? 'Ажлын цаг: 09:00 - 18:00' : '9:00 AM - 6:00 PM'}</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-4 h-4 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">nobleworldgate@gmail.com</p>
                                    <p className="text-slate-500 text-xs">Email us</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-4 h-4 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm text-balance">
                                        {language === 'mn' ? 'Улаанбаатар хот, Чингэлтэй дүүрэг' : 'Ulaanbaatar, Chingeltei District'}
                                    </p>
                                    <p className="text-slate-500 text-xs text-balance">
                                        {language === 'mn'
                                            ? '5-р хороо, Их тойруу, Премиум Пэлас, 5-р давхар, 508 тоот'
                                            : '5th Khoroo, Ikh Toiruu, Premium Palace, 5th Floor, Room 508'}
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} NOBLE WORLD GATE LLC. {language === 'mn' ? 'Бүх эрх хуулиар хамгаалагдсан.' : 'All rights reserved.'}
                        </p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                                {language === 'mn' ? 'Нууцлалын бодлого' : 'Privacy Policy'}
                            </Link>
                            <Link href="/terms" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                                {language === 'mn' ? 'Үйлчилгээний нөхцөл' : 'Terms of Service'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
