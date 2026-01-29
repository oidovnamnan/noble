// Login Page
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
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
    const [status, setStatus] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setStatus('Нэвтэрч байна...');

        if (!auth) {
            setError('Системийн тохиргоо дутуу байна (Firebase API key).');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Имэйл хаяг буруу байна');
            setStatus(null);
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setStatus('Амжилттай! Шилжиж байна...');

            // Redirect based on email
            if (email === 'nobleworldgate@gmail.com') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            console.error(err);
            setStatus(null);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('Имэйл эсвэл нууц үг буруу байна');
            } else {
                setError('Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setStatus('Google-ээр нэвтэрч байна...');

        if (!auth) {
            setError('Системийн тохиргоо дутуу байна.');
            return;
        }

        try {
            setLoading(true);
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });

            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                setStatus('Амжилттай нэвтэрлээ. Шилжиж байна...');

                // Redirect admin
                if (result.user.email === 'nobleworldgate@gmail.com') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            }
        } catch (err: any) {
            console.error('Google Login Error:', err);
            setStatus(null);
            if (err.code === 'auth/popup-blocked') {
                setError('Цонх хаагдсан байна. Хөтөч дээрээ "Popups" зөвшөөрөөд дахин оролдоно уу.');
            } else if (err.code === 'auth/cancelled-popup-request') {
                setError('Нэвтрэх үйлдлийг цуцаллаа.');
            } else {
                setError('Google-ээр нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.');
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

                        {status && (
                            <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-xl border border-blue-100 animate-pulse">
                                {status}
                            </p>
                        )}

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
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full gap-3"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
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
