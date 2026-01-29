// Landing Page - Noble Consulting
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  GraduationCap,
  Plane,
  Briefcase,
  FileCheck,
  ChevronRight,
  Sparkles,
  Users,
  Globe2,
  Award,
  Clock,
  ArrowRight,
  Star,
  MessageCircle,
  Bell,
  Newspaper
} from 'lucide-react';
import { Header, Footer } from '@/components/shared';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Card } from '@/components/ui';
import { useAppStore } from '@/lib/store';

// Stats data
const stats = [
  { icon: Globe2, value: '15+', label: { mn: 'Хамтрагч сургууль', en: 'Partner Institutions' } },
  { icon: Users, value: '20+', label: { mn: 'Төлөвлөсөн оюутнууд', en: 'Projected Students' } },
  { icon: Award, value: '100%', label: { mn: 'Сэтгэл ханамж', en: 'Client Satisfaction' } },
  { icon: Clock, value: '24/7', label: { mn: 'Зөвлөгөө', en: 'Dedicated Support' } },
];

// Services data
const services = [
  {
    id: 'education',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    title: { mn: 'Боловсрол', en: 'Education' },
    description: { mn: 'Диплом, Бакалавр, Магистр болон Англи хэлний хөтөлбөрүүд.', en: 'Diploma, Undergrad, Post-grad, and English studies.' },
  },
  {
    id: 'travel',
    icon: Plane,
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    title: { mn: 'Дэмжлэг', en: 'Support' },
    description: { mn: 'Зорчихын өмнөх зөвлөгөө, суурьших дэмжлэг үйлчилгээ.', en: 'Pre-departure briefings and settlement support.' },
  },
  {
    id: 'work',
    icon: Briefcase,
    gradient: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
    title: { mn: 'Мэргэжил', en: 'Career' },
    description: { mn: 'Мэргэжлийн чиг баримжаа, карьер төлөвлөлтийн зөвлөгөө.', en: 'Professional counselling and career guidance.' },
  },
  {
    id: 'visa',
    icon: FileCheck,
    gradient: 'from-purple-500 to-violet-600',
    bgLight: 'bg-purple-50',
    title: { mn: 'Виз', en: 'Visa' },
    description: { mn: 'Визийн бүрдүүлэлт, дүрэм журмын иж бүрэн зөвлөгөө.', en: 'Full visa guidance ensuring complete compliance.' },
  },
];

// Partner universities from CSV
const partners = [
  { name: 'University of Auckland', logo: '🇳🇿' },
  { name: 'University of Canterbury', logo: '🇳🇿' },
  { name: 'University of Waikato', logo: '🇳🇿' },
  { name: 'AUT University', logo: '🇳🇿' },
  { name: 'Simon Fraser University', logo: '🇨🇦' },
  { name: 'University of Manitoba', logo: '🇨🇦' },
  { name: 'Lincoln University', logo: '🇳🇿' },
  { name: 'Toronto Metropolitan', logo: '🇨🇦' },
  { name: 'Fanshawe College', logo: '🇨🇦' },
  { name: 'Centennial College', logo: '🇨🇦' },
  { name: 'IPU New Zealand', logo: '🇳🇿' },
  { name: 'Algoma University', logo: '🇨🇦' },
];

// Check if device is mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// Desktop Landing Page Component
function DesktopLanding({ language }: { language: 'mn' | 'en' }) {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1e3a5f 100%)',
      }}
    >
      <Header />

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              {language === 'mn' ? 'Олон улсын боловсролын зөвлөгөө' : 'International Education Consulting'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
          >
            {language === 'mn' ? (
              <>Таны <span className="text-gradient">Ирээдүй</span>,<br />Хамтдаа</>
            ) : (
              <>Your <span className="text-gradient">Future</span>,<br />Together</>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-10"
          >
            {language === 'mn'
              ? 'Итгэлцэл, мэргэжлийн хандлагаар таныг дэлхийн шилдэг боловсролд хөтөлнө.'
              : 'Built on trust and professionalism, we guide you to your success in global education.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/#services"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold rounded-2xl hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105"
            >
              {language === 'mn' ? 'Үйлчилгээ үзэх' : 'Our Services'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
            >
              {language === 'mn' ? 'Холбоо барих' : 'Contact Us'}
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* AI Assistant Card */}
      <section className="relative -mt-20 px-6 lg:px-8 z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/chat"
              className="group flex items-center gap-6 glass-dark rounded-3xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">AI {language === 'mn' ? 'Туслах' : 'Assistant'}</h3>
                <p className="text-slate-400">
                  {language === 'mn'
                    ? 'Хиймэл оюун ухааны тусламжтай асуултандаа хариулт аваарай'
                    : 'Get instant answers with our AI-powered assistant'}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-amber-500 group-hover:border-amber-500 transition-all">
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.value}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-dark rounded-3xl p-6 text-center hover:bg-white/10 transition-all group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-amber-400" />
                  </div>
                  <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label[language]}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black text-white mb-8">
                {language === 'mn' ? 'Бидний тухай' : 'About Noble World Gate'}
              </h2>
              <div className="space-y-6 text-slate-400 leading-relaxed">
                <p>
                  {language === 'mn'
                    ? 'Манай агентлаг нь итгэлцэл, мэргэжлийн хандлага, оюутны амжилтад хүрэх чин эрмэлзэл дээр суурилдаг. Бид олон улсын боловсролын салбарт тэргүүлэх зөвлөх үйлчилгээ үзүүлэгч юм.'
                    : 'Our agency is built on trust, professionalism, and a commitment to student success. We are a leading education & visa consulting provider in Mongolia.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  <div className="glass-dark rounded-2xl p-6 border-l-4 border-amber-400">
                    <h4 className="text-white font-bold mb-2">{language === 'mn' ? 'Бидний зорилго' : 'Our Mission'}</h4>
                    <p className="text-xs">{language === 'mn' ? 'Оюутнуудад дэлхийн түвшний боловсрол эзэмших боломжийг нээж өгөх.' : 'Unlocking global education opportunities for our students.'}</p>
                  </div>
                  <div className="glass-dark rounded-2xl p-6 border-l-4 border-blue-400">
                    <h4 className="text-white font-bold mb-2">{language === 'mn' ? 'Зөвлөх үйлчилгээ' : 'Core Focus'}</h4>
                    <p className="text-xs">{language === 'mn' ? 'Диплом, Бакалавр, Магистр болон Англи хэлний хөтөлбөрүүд.' : 'Diploma, Undergraduate, Post-Graduate, and English Language Studies.'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-dark rounded-[40px] p-8 lg:p-12 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">
                  {language === 'mn' ? 'Бидний амлалт' : 'Our Commitment'}
                </h3>
                <ul className="space-y-4">
                  {[
                    { mn: 'Итгэлцэл болон мэргэжлийн ёс зүйг дээдлэх', en: 'Pledge to maintain highest integrity' },
                    { mn: 'Зөвхөн шаардлага хангасан чанартай оюутнуудыг бэлтгэх', en: 'Recruit only genuine and qualified students' },
                    { mn: 'Олон улсын ёс зүйн стандарт, визийн журмыг чанд мөрдөх', en: 'Adhere to ethical standards and visa regulations' },
                    { mn: 'Оюутанд чиглэсэн цогц дэмжлэг үзүүлэх', en: 'Provide comprehensive student-centric support' }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-amber-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span className="text-sm text-slate-300">{item[language]}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Decoration */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white mb-4">
              {language === 'mn' ? 'Бидний үйлчилгээ' : 'Our Services'}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {language === 'mn'
                ? 'Таны ирээдүйн зорилгодоо хүрэхэд бид тусална'
                : 'We help you achieve your future goals'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    href={`/services?category=${service.id}`}
                    className="group block h-full glass-dark rounded-3xl p-8 hover:bg-white/10 transition-all"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{service.title[language]}</h3>
                    <p className="text-slate-400 text-sm">{service.description[language]}</p>
                    <div className="mt-6 flex items-center gap-2 text-amber-400 font-medium text-sm group-hover:gap-3 transition-all">
                      {language === 'mn' ? 'Дэлгэрэнгүй' : 'Learn more'}
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quality Focus Section */}
      <section className="py-24 px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square lg:aspect-video rounded-[40px] overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10" />
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2670&auto=format&fit=crop"
                alt="Education Quality"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="p-8 glass-dark rounded-3xl text-center border-white/20">
                  <Star className="w-12 h-12 text-amber-400 mx-auto mb-4 animate-star-glow" />
                  <p className="text-2xl font-black text-white uppercase tracking-widest">Quality over Quantity</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-black text-white mb-6">
                  {language === 'mn' ? 'Бидний зарчим: Чанарыг эрхэмлэнэ' : 'Our Philosophy: Quality First'}
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {language === 'mn'
                    ? 'Бид олон тооны оюутныг биш, харин тухайн сургууль болон визний шаардлагыг бүрэн хангасан "Чанартай" оюутнуудыг бэлтгэхийг зоридог. Энэ нь бидний 95%+ визний амжилтын үндэс юм.'
                    : 'We focus on recruiting genuine, high-quality students who meet the academic and financial requirements of world-class institutions. This commitment ensures our 95%+ visa success rate.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: { mn: 'Нарийн шалгалт', en: 'Pre-screening' }, desc: { mn: 'Оюутан бүрийн материалыг 3 үе шаттай шалгана.', en: '3-step rigorous background and financial checks.' } },
                  { title: { mn: 'Хувийн зөвлөгөө', en: 'Personalized' }, desc: { mn: 'Оюутан бүрийн зорилгод нийцсэн карьер төлөвлөлт.', en: 'Tailored career path based on individual goals.' } },
                ].map((item, i) => (
                  <div key={i} className="glass-dark p-6 rounded-2xl border border-white/5 hover:border-amber-400/30 transition-all">
                    <h4 className="text-white font-bold mb-2">{item.title[language]}</h4>
                    <p className="text-sm text-slate-400">{item.desc[language]}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-24 px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-white mb-4">
              {language === 'mn' ? 'Бидний хамтрагчид' : 'Our Global Partners'}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {language === 'mn'
                ? 'Дэлхийн шилдэг их сургуулиуд болон байгууллагуудтай хамтран ажилладаг'
                : 'Partnering with world-leading universities and institutions'}
            </p>
          </motion.div>

          {/* Scrolling logos */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0f172a] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0f172a] to-transparent z-10" />

            <div className="flex animate-scroll">
              {[...partners, ...partners].map((partner, idx) => (
                <div
                  key={`${partner.name}-${idx}`}
                  className="flex-shrink-0 mx-6 glass-dark rounded-2xl px-8 py-6 flex items-center gap-4 min-w-[250px]"
                >
                  <span className="text-4xl">{partner.logo}</span>
                  <span className="text-white font-medium whitespace-nowrap">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative glass-dark rounded-[40px] p-12 lg:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-purple-500/10" />
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
                {language === 'mn' ? 'Ирээдүйгээ эхлүүлэхэд бэлэн үү?' : 'Ready to start your journey?'}
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                {language === 'mn'
                  ? 'Манай мэргэжилтнүүдтэй холбогдож, боломжуудаа судлаарай.'
                  : 'Connect with our experts and explore your opportunities.'}
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold text-lg rounded-2xl hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 animate-glow"
              >
                {language === 'mn' ? 'Бүртгүүлэх' : 'Get Started Now'}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Mobile Landing Page Component
function MobileLanding({ language }: { language: 'mn' | 'en' }) {
  return (
    <MobileLayout>
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-hero text-white pt-12 pb-8 px-4 rounded-b-[40px] shadow-xl shadow-blue-500/10"
      >
        <div className="container-mobile">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Noble World Gate</h1>
              <p className="text-blue-100/80 text-xs font-medium uppercase tracking-widest mt-1">
                {language === 'en' ? 'Education & Visa Consulting' : 'Боловсрол & Виз Зуучлал'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold border-2 border-indigo-700">
                1
              </span>
            </motion.button>
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 rounded-2xl p-5 backdrop-blur-md border border-white/10 shadow-inner"
          >
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80">
              {language === 'en' ? 'Noble World Gate LLC' : 'Ноубл Уорлд Гэйт ХХК'}
            </p>
            <p className="font-bold text-base leading-tight">
              {language === 'en'
                ? 'Trust and professionalism for your study abroad journey'
                : 'Гадаадад сурах таны аяллын найдвартай хөтөч'}
            </p>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="px-4 -mt-5 space-y-8 pb-10">
        {/* Quick AI Chat */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="elevated" className="hover:shadow-2xl transition-all duration-500 border-none bg-white/95 backdrop-blur-sm p-1">
            <Link href="/chat" className="flex items-center gap-4 p-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base">AI {language === 'en' ? 'Assistant' : 'Туслах'}</h3>
                <p className="text-xs text-gray-500 font-medium">{language === 'en' ? 'Ask anything' : 'Асуултаа асуугаарай'}</p>
              </div>
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                <MessageCircle className="w-5 h-5 text-blue-500" />
              </div>
            </Link>
          </Card>
        </motion.div>

        {/* About Us - Mobile */}
        <section id="about">
          <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="text-lg font-bold text-gray-900 leading-none">
              {language === 'en' ? 'About Us' : 'Бидний тухай'}
            </h2>
          </div>
          <Card variant="outlined" padding="md" className="border-slate-100 bg-white shadow-sm overflow-hidden text-left">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🏛️</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Noble World Gate</h3>
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">{language === 'en' ? 'Trust & Excellence' : 'Итгэлцэл & Амжилт'}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'mn'
                  ? 'Манай агентлаг нь итгэлцэл, мэргэжлийн хандлага, оюутны амжилтад хүрэх чин эрмэлзэл дээр суурилан олон улсын боловсролын салбарт тэргүүлэх зөвлөх үйлчилгээ үзүүлдэг.'
                  : 'Built on trust and professionalism, we guide you to your success in global education with our student-centric approach.'}
              </p>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">{language === 'mn' ? 'Зорилго' : 'Mission'}</p>
                  <p className="text-[10px] font-medium text-slate-600">{language === 'mn' ? 'Дэлхийн боловсрол' : 'Global Education'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">{language === 'mn' ? 'Үйлчилгээ' : 'Core Focus'}</p>
                  <p className="text-[10px] font-medium text-slate-600">{language === 'mn' ? 'Цогц зөвлөгөө' : 'Full Support'}</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Service Categories */}
        <section id="services">
          <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="text-lg font-bold text-gray-900 leading-none">
              {language === 'en' ? 'Services' : 'Үйлчилгээнүүд'}
            </h2>
            <Link href="/services" className="text-[10px] text-blue-600 font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
              {language === 'en' ? 'See all' : 'Бүгд'}
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                >
                  <Link
                    href={`/services?category=${service.id}`}
                    className="group h-full block"
                  >
                    <Card variant="outlined" padding="md" className="hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl h-full border-slate-100 bg-white/50 backdrop-blur-sm group-active:scale-95">
                      <div className={`w-12 h-12 ${service.bgLight} rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-all shadow-sm`}>
                        <Icon className={`w-6 h-6 bg-gradient-to-br ${service.gradient} bg-clip-text`} style={{ color: service.gradient.includes('blue') ? '#3b82f6' : service.gradient.includes('emerald') ? '#10b981' : service.gradient.includes('amber') ? '#f59e0b' : '#8b5cf6' }} />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm">{service.title[language]}</h3>
                      <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-wider">{service.description[language]}</p>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Partners */}
        <section id="partners">
          <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="text-lg font-bold text-gray-900 leading-none">
              {language === 'en' ? 'Our Partners' : 'Хамтрагчид'}
            </h2>
          </div>

          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {partners.slice(0, 6).map((partner) => (
              <div
                key={partner.name}
                className="flex-shrink-0 bg-white border border-slate-100 rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <span className="text-2xl">{partner.logo}</span>
                <span className="text-sm font-medium text-slate-700 whitespace-nowrap">{partner.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="pb-6">
          <div className="grid grid-cols-2 gap-4">
            {stats.slice(0, 2).map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.value} variant="outlined" padding="md" className="text-center border-slate-100">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label[language]}</p>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </MobileLayout>
  );
}

// Main HomePage Component
export default function HomePage() {
  const { language } = useAppStore();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isMobile ? <MobileLanding language={language} /> : <DesktopLanding language={language} />;
}
