// Forgot Password Page
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Button, Input, Card } from '@/components/ui';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { isValidEmail } from '@/lib/utils';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!isValidEmail(email)) {
            setError('Имэйл хаяг буруу байна');
            return;
        }

        if (!auth) {
            setError('System error: Auth not initialized');
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess(true);
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/user-not-found') {
                setError('Бүртгэлгүй имэйл хаяг байна');
            } else {
                setError('Алдаа гарлаа. Дахин оролдоно уу');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8">
            <div className="w-full max-w-sm mx-auto space-y-6">

                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">Нууц үг сэргээх</h1>
                    <p className="text-gray-500">Бүртгэлтэй имэйл хаягаа оруулна уу</p>
                </div>

                <Card variant="elevated" padding="lg">
                    {success ? (
                        <div className="text-center space-y-4 py-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Имэйл илгээгдлээ!</h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    {email} хаяг руу нууц үг сэргээх холбоос илгээлээ. Спам фолдероо шалгаарай.
                                </p>
                            </div>
                            <Link href="/auth/login">
                                <Button variant="outline" className="w-full mt-4">
                                    Нэвтрэх хэсэг рүү буцах
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-4">
                            <Input
                                label="Имэйл"
                                type="email"
                                placeholder="example@mail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                leftIcon={<Mail className="w-4 h-4" />}
                                required
                            />

                            {error && (
                                <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 italic">
                                    {error}
                                </p>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={loading}
                            >
                                Илгээх
                            </Button>

                            <Link
                                href="/auth/login"
                                className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-900 mt-4"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Буцах
                            </Link>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
}
