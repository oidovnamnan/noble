// Poster Generator Page (Admin)
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, Button, Input, Badge } from '@/components/ui';
import {
    Image as ImageIcon,
    Download,
    Sun,
    Megaphone,
    Calendar,
    Sparkles,
    RefreshCw,
    Phone,
    Building2
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';

// Poster templates configuration
const posterTemplates = [
    {
        id: 'morning',
        icon: Sun,
        gradient: 'from-amber-400 via-orange-500 to-rose-500',
        bgGradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
    },
    {
        id: 'promo',
        icon: Megaphone,
        gradient: 'from-blue-500 via-indigo-600 to-purple-600',
        bgGradient: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    },
    {
        id: 'event',
        icon: Calendar,
        gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
        bgGradient: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    },
];

// Default poster content per type
const defaultContent: Record<string, any> = {
    morning: {
        title: 'Өглөөний мэнд! ☀️',
        subtitle: 'NOBLE CONSULTING',
        tagline: 'Таны ирээдүйг хамтдаа',
        services: '🎓 Гадаадад суралцах\n✈️ Визийн зөвлөгөө\n💼 Ажлын зуучлал',
        phone: '77027702',
    },
    promo: {
        title: '🎉 Онцгой санал!',
        subtitle: 'NOBLE CONSULTING',
        tagline: 'Хязгаарлагдмал хугацаанд',
        services: '🎓 Боловсролын зөвлөгөө\n✈️ Виз мэдүүлэг\n💼 Ажлын байр олох',
        phone: '77027702',
    },
    event: {
        title: '📅 Үйл явдал',
        subtitle: 'NOBLE CONSULTING',
        tagline: 'Бидэнтэй нэгдээрэй',
        services: '📍 Байршил\n🕐 Цаг\n🎯 Сэдэв',
        phone: '77027702',
    },
};

export default function AdminPostersPage() {
    const { t, language } = useTranslation();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTemplate, setSelectedTemplate] = useState('morning');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Form state
    const [posterContent, setPosterContent] = useState(defaultContent.morning);

    // Set client flag after mount
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Handle template change
    const handleTemplateChange = (templateId: string) => {
        setSelectedTemplate(templateId);
        setPosterContent(defaultContent[templateId]);
    };

    // Draw poster on canvas
    const drawPoster = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Canvas size (Instagram square)
        canvas.width = 1080;
        canvas.height = 1080;

        // Background gradient based on template
        let gradient;
        if (selectedTemplate === 'morning') {
            gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#1a1a2e');
            gradient.addColorStop(0.5, '#16213e');
            gradient.addColorStop(1, '#0f3460');
        } else if (selectedTemplate === 'promo') {
            gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
        } else {
            gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#11998e');
            gradient.addColorStop(1, '#38ef7d');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add sunrise effect for morning
        if (selectedTemplate === 'morning') {
            const sunGradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height * 0.7, 0,
                canvas.width / 2, canvas.height * 0.7, 400
            );
            sunGradient.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
            sunGradient.addColorStop(0.5, 'rgba(255, 150, 50, 0.4)');
            sunGradient.addColorStop(1, 'rgba(255, 100, 50, 0)');
            ctx.fillStyle = sunGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 72px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(posterContent.title, canvas.width / 2, 180);

        // Subtitle (Company name)
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 56px Arial, sans-serif';
        ctx.fillText(posterContent.subtitle, canvas.width / 2, 280);

        // Tagline
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '32px Arial, sans-serif';
        ctx.fillText(posterContent.tagline, canvas.width / 2, 340);

        // Services box
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.roundRect(140, 420, canvas.width - 280, 350, 30);
        ctx.fill();

        // Services text
        ctx.fillStyle = '#ffffff';
        ctx.font = '36px Arial, sans-serif';
        ctx.textAlign = 'left';
        const services = posterContent.services.split('\n');
        services.forEach((service: string, index: number) => {
            ctx.fillText(service, 200, 500 + index * 80);
        });

        // Phone box at bottom
        ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        ctx.beginPath();
        ctx.roundRect(canvas.width / 2 - 200, 850, 400, 80, 40);
        ctx.fill();

        ctx.fillStyle = '#1a1a2e';
        ctx.font = 'bold 42px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`📞 ${posterContent.phone}`, canvas.width / 2, 905);

        // Border
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.roundRect(30, 30, canvas.width - 60, canvas.height - 60, 40);
        ctx.stroke();
    }, [selectedTemplate, posterContent]);

    // Generate poster
    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            drawPoster();
            setIsGenerating(false);
        }, 500);
    };

    // Download poster
    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `noble-poster-${selectedTemplate}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    // Generate on mount and when content changes
    useEffect(() => {
        if (isClient) {
            drawPoster();
        }
    }, [isClient, drawPoster]);

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('admin.posterGenerator')}</h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">{t('admin.posters')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            leftIcon={<RefreshCw className="w-4 h-4" />}
                            onClick={handleGenerate}
                            isLoading={isGenerating}
                        >
                            {t('admin.generatePoster')}
                        </Button>
                        <Button
                            leftIcon={<Download className="w-4 h-4" />}
                            onClick={handleDownload}
                        >
                            {t('admin.downloadPoster')}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left - Settings */}
                    <div className="space-y-6">
                        {/* Template Selection */}
                        <Card variant="outlined" padding="md">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                {t('admin.selectTemplate')}
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {posterTemplates.map((template) => {
                                    const Icon = template.icon;
                                    const isSelected = selectedTemplate === template.id;
                                    return (
                                        <motion.button
                                            key={template.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleTemplateChange(template.id)}
                                            className={`p-4 rounded-2xl border-2 transition-all ${isSelected
                                                ? 'border-blue-500 bg-blue-50 shadow-lg'
                                                : 'border-slate-100 hover:border-slate-200 bg-white'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center mx-auto mb-3`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <p className={`text-sm font-bold ${isSelected ? 'text-blue-600' : 'text-slate-700'}`}>
                                                {t(`admin.poster${template.id.charAt(0).toUpperCase() + template.id.slice(1)}`)}
                                            </p>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Content Editor */}
                        <Card variant="outlined" padding="md">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-500" />
                                {t('admin.posterText')}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        {t('admin.posterTitle')}
                                    </label>
                                    <Input
                                        value={posterContent.title}
                                        onChange={(e) => setPosterContent({ ...posterContent, title: e.target.value })}
                                        placeholder="Өглөөний мэнд! ☀️"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        {t('admin.posterSubtitle')}
                                    </label>
                                    <Input
                                        value={posterContent.subtitle}
                                        onChange={(e) => setPosterContent({ ...posterContent, subtitle: e.target.value })}
                                        placeholder="NOBLE CONSULTING"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        {t('admin.posterServices')}
                                    </label>
                                    <textarea
                                        value={posterContent.services}
                                        onChange={(e) => setPosterContent({ ...posterContent, services: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium resize-none"
                                        placeholder="🎓 Гадаадад суралцах..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        {t('admin.posterPhone')}
                                    </label>
                                    <Input
                                        value={posterContent.phone}
                                        onChange={(e) => setPosterContent({ ...posterContent, phone: e.target.value })}
                                        leftIcon={<Phone className="w-4 h-4" />}
                                        placeholder="77027702"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right - Preview */}
                    <div className="space-y-4">
                        <Card variant="outlined" padding="md">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-emerald-500" />
                                {t('admin.posterPreview')}
                            </h3>
                            <div className="bg-slate-100 rounded-2xl p-4 flex items-center justify-center">
                                <canvas
                                    ref={canvasRef}
                                    className="max-w-full h-auto rounded-xl shadow-2xl"
                                    style={{ maxHeight: '500px' }}
                                />
                            </div>
                        </Card>

                        {/* Quick tips */}
                        <Card variant="outlined" padding="sm" className="bg-amber-50 border-amber-100">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-4 h-4 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-amber-900">Зөвлөмж</p>
                                    <p className="text-xs text-amber-700 mt-1">
                                        Emoji ашиглавал постер илүү гоё харагдана! 🎓✈️💼
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
