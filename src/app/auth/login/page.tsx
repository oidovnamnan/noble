// Login Page
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Button, Input, Card } from '@/components/ui';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { isValidEmail } from '@/lib/utils';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!auth) {
            setError('Системийн тохиргоо дутуу байна (Firebase API key).');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Имэйл хаяг буруу байна');
            return;
        }

        if (password.length < 6) {
            setError('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой');
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Имэйл эсвэл нууц үг буруу байна');
            } else if (err.code === 'auth/invalid-credential') {
                setError('Имэйл эсвэл нууц үг буруу байна');
            } else {
                setError('Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8">
            <div className="w-full max-w-sm mx-auto space-y-6">
                {/* Logo/Title */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
                        <span className="text-2xl font-bold text-white">N</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Тавтай морил</h1>
                    <p className="text-gray-500">Noble Consulting-д нэвтрэх</p>
                </div>

                <Card variant="elevated" padding="lg" className="animate-fade-in">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            label="Имэйл"
                            type="email"
                            placeholder="example@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            leftIcon={<Mail className="w-4 h-4" />}
                            required
                        />

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                    Нууц үг
                                </label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-xs text-blue-600 font-medium hover:underline"
                                >
                                    Мартсан уу?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                leftIcon={<Lock className="w-4 h-4" />}
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 italic">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={loading}
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            Нэвтрэх
                        </Button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-white text-gray-400 font-medium">Эсвэл</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button variant="outline" className="w-full gap-3">
                                <Github className="w-4 h-4" />
                                Google-ээр нэвтрэх
                            </Button>
                        </div>
                    </div>
                </Card>

                <p className="text-center text-sm text-gray-500">
                    Бүртгэлгүй юу?{' '}
                    <Link
                        href="/auth/register"
                        className="text-blue-600 font-bold hover:underline"
                    >
                        Бүртгүүлж байна
                    </Link>
                </p>
            </div>
        </div>
    );
}
