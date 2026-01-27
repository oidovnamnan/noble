'use client';

import React, { useState } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { Lock, Shield, Smartphone, Key } from 'lucide-react';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAuth } from '@/lib/firebase/auth-context';

export default function SecurityPage() {
    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('Шинэ нууц үгнүүд таарахгүй байна.');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Нууц үг дор хаяж 6 оронтой байх ёстой.');
            setLoading(false);
            return;
        }

        const currentUser = auth?.currentUser;

        if (currentUser && currentUser.email) {
            try {
                // If the user signed in a long time ago, we might need re-auth.
                // For simplicity, we try update first. If it fails with 'requires-recent-login', we handle it.
                // Note: To re-authenticate, we need the USER to provide current password.

                // 1. Re-authenticate first to be safe (and verify current password)
                const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
                await reauthenticateWithCredential(currentUser, credential);

                // 2. Update password
                await updatePassword(currentUser, newPassword);

                setMessage('Нууц үг амжилттай солигдлоо!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } catch (err: any) {
                console.error(err);
                if (err.code === 'auth/wrong-password') {
                    setError('Одоогийн нууц үг буруу байна.');
                } else if (err.code === 'auth/requires-recent-login') {
                    setError('Аюулгүй байдлын үүднээс дахин нэвтэрсний дараа солино уу.');
                } else {
                    setError('Алдаа гарлаа: ' + err.message);
                }
            }
        } else {
            setError('Хэрэглэгч нэвтрээгүй байна.');
        }

        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Аюулгүй байдал</h1>
                    <p className="text-gray-500">Нууц үг болон нэвтрэх тохиргоо</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Change Password */}
                <Card variant="elevated" className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Lock className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-bold text-gray-900">Нууц үг солих</h2>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <Input
                            type="password"
                            label="Одоогийн нууц үг"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            label="Шинэ нууц үг"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            label="Шинэ нууц үг давтах"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        {error && <p className="text-sm text-red-500">{error}</p>}
                        {message && <p className="text-sm text-green-500 font-medium">{message}</p>}

                        <Button type="submit" isLoading={loading} className="w-full">
                            Хадгалах
                        </Button>
                    </form>
                </Card>

                {/* 2FA Placeholder */}
                <div className="space-y-6">
                    <Card variant="outline" className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Smartphone className="w-5 h-5 text-gray-400" />
                            <h2 className="text-lg font-bold text-gray-900">2-Алхамт баталгаажуулалт</h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            Таны бүртгэлийг илүү аюулгүй байлгах үүднээс SMS-ээр код авч нэвтрэх.
                        </p>
                        <Button variant="outline" disabled className="w-full">
                            Тун удахгүй
                        </Button>
                    </Card>

                    <Card variant="outline" className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Key className="w-5 h-5 text-gray-400" />
                            <h2 className="text-lg font-bold text-gray-900">Нэвтэрсэн төхөөрөмжүүд</h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            Таны бүртгэлээр нэвтэрсэн байгаа бусад төхөөрөмжүүдийг хянах.
                        </p>
                        <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Chrome on Mac OS</p>
                                    <p className="text-xs text-gray-400">Яг одоо (Энэ төхөөрөмж)</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
