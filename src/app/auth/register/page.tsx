// Register Page
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { Button, Input, Card } from '@/components/ui';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { isValidEmail, isValidPhone } from '@/lib/utils';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!auth || !db) {
            setError('Системийн тохиргоо дутуу байна (Firebase API key).');
            return;
        }

        // Validation
        if (!formData.firstName || !formData.lastName) {
            setError('Овог нэрээ оруулна уу');
            return;
        }
        if (!isValidEmail(formData.email)) {
            setError('Имэйл хаяг буруу байна');
            return;
        }
        if (!isValidPhone(formData.phone)) {
            setError('Утасны дугаар буруу байна');
            return;
        }
        if (formData.password.length < 6) {
            setError('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Нууц үгүүд зөрж байна');
            return;
        }

        setLoading(true);
        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            const user = userCredential.user;

            // 2. Create User Profile in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                role: 'customer',
                language: 'mn',
                notifications: {
                    email: true,
                    push: true,
                    sms: false,
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            router.push('/');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Имэйл хаяг бүртгэлтэй байна');
            } else {
                setError('Бүртгүүлэхэд алдаа гарлаа. Дахин оролдоно уу');
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
                    <h1 className="text-2xl font-bold text-gray-900">Бүртгүүлэх</h1>
                    <p className="text-gray-500">Шинэ бүртгэл үүсгэх</p>
                </div>

                <Card variant="elevated" padding="lg" className="animate-fade-in">
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Овог"
                                name="lastName"
                                placeholder="LastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Нэр"
                                name="firstName"
                                placeholder="FirstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <Input
                            label="Имэйл"
                            name="email"
                            type="email"
                            placeholder="example@mail.com"
                            value={formData.email}
                            onChange={handleChange}
                            leftIcon={<Mail className="w-4 h-4" />}
                            required
                        />

                        <Input
                            label="Утас"
                            name="phone"
                            type="tel"
                            placeholder="88xxxxxx"
                            value={formData.phone}
                            onChange={handleChange}
                            leftIcon={<Phone className="w-4 h-4" />}
                            required
                        />

                        <Input
                            label="Нууц үг"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            leftIcon={<Lock className="w-4 h-4" />}
                            required
                        />

                        <Input
                            label="Нууц үг давтах"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            leftIcon={<Lock className="w-4 h-4" />}
                            required
                        />

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 italic">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full mt-2"
                            isLoading={loading}
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            Бүртгүүлэх
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-sm text-gray-500">
                    Бүртгэлтэй юу?{' '}
                    <Link
                        href="/auth/login"
                        className="text-blue-600 font-bold hover:underline"
                    >
                        Нэвтрэх
                    </Link>
                </p>
            </div>
        </div>
    );
}
