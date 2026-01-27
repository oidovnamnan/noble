// AI Chat Page
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    ArrowLeft,
    Send,
    Sparkles,
    User,
    Loader2,
    Image as ImageIcon,
    Paperclip,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Card, Input, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useAuthStore, useAppStore } from '@/lib/store';
import { db } from '@/lib/firebase/config';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: Date;
}

export default function ChatPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [servicesContext, setServicesContext] = useState<string>('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const { language } = useAppStore();

    // Fetch services for AI context
    useEffect(() => {
        const fetchServices = async () => {
            if (!db) return;
            try {
                const q = query(collection(db, 'services'), orderBy('displayOrder', 'asc'));
                const snapshot = await getDocs(q);
                const servicesData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return `- ${data.name[language]}: ${data.description[language]}. Fee: ₮${data.baseFee.toLocaleString()}. Time: ${data.processingTime}.`;
                }).join('\n');
                setServicesContext(servicesData);
            } catch (err) {
                console.error('Error fetching services for AI:', err);
            }
        };
        fetchServices();
    }, [language]);

    // Initial welcome message
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: 'welcome',
                    role: 'assistant',
                    content: `Сайн байна уу! Би Noble Consulting-ийн ухаалаг туслах байна. Танд виз, сургалт, ажлын зуучлал эсвэл хүсэлтийн явцын талаар асуух зүйл байна уу?`,
                    createdAt: new Date(),
                }
            ]);
        }
    }, []);

    // Auto scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            createdAt: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                    context: servicesContext
                }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.content,
                createdAt: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            console.error('Chat Error:', err);
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Уучлаарай, AI-тай холбогдоход алдаа гарлаа. Та дахин оролдоно уу эсвэл менежертэй холбогдоно уу.',
                createdAt: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const clearChat = () => {
        if (confirm('Чатны түүхийг устгах уу?')) {
            setMessages([
                {
                    id: 'welcome',
                    role: 'assistant',
                    content: `Сайн байна уу! Чатны түүхийг цэвэрлэлээ. Танд хэрхэн туслах вэ?`,
                    createdAt: new Date(),
                }
            ]);
        }
    };

    if (isLoading || (!isAuthenticated && messages.length === 0)) {
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

    return (
        <MobileLayout>
            <div className="flex flex-col h-[calc(100vh-64px)]">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 -ml-2 hover:bg-gray-50 rounded-xl">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-sm font-bold text-gray-900 leading-tight">AI Туслах</h1>
                                <p className="text-[10px] text-green-500 font-bold uppercase">Online</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={clearChat}
                        className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </header>

                {/* Messages */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar"
                >
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className={cn(
                                    "flex items-start gap-2 max-w-[85%]",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm",
                                    msg.role === 'user' ? "bg-blue-100 text-blue-600" : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                                )}>
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                </div>
                                <div className={cn(
                                    "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-blue-600 text-white rounded-tr-none"
                                        : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                                )}>
                                    {msg.content}
                                    <p className={cn(
                                        "text-[10px] mt-1 opacity-60",
                                        msg.role === 'user' ? "text-right" : "text-left"
                                    )}>
                                        {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="flex items-start gap-2 mr-auto max-w-[85%]"
                            >
                                <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white ring-2 ring-white shadow-sm">
                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                </div>
                                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Input area */}
                <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
                    <form onSubmit={handleSend} className="relative flex items-end gap-2">
                        <div className="flex-1 relative">
                            <textarea
                                rows={1}
                                placeholder="Асуултаа бичнэ үү..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                className={cn(
                                    "w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 pr-10",
                                    "text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                                    "resize-none transition-all duration-200"
                                )}
                            />
                            <div className="absolute right-3 bottom-3 flex gap-2">
                                <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <ImageIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className={cn(
                                "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg shadow-blue-500/25",
                                input.trim() && !isTyping
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                            )}
                        >
                            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </form>
                    <p className="text-[10px] text-gray-400 text-center mt-3 font-medium">
                        AI нь тодорхой мэдээлэл өгөхөд алдаж болзошгүйг анхаарна уу.
                    </p>
                </div>
            </div>
        </MobileLayout>
    );
}
