'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, Button, Input, Badge, StatusBadge, Modal, Select } from '@/components/ui';
import {
    Search,
    UserPlus,
    Shield,
    Mail,
    Phone,
    MoreVertical,
    Edit2,
    Trash2,
    Loader2,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, updateDoc, doc, addDoc, Timestamp } from 'firebase/firestore';
import { User, UserRole } from '@/types';

export default function StaffManagementPage() {
    const { t, language } = useTranslation();
    const [staff, setStaff] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newStaffData, setNewStaffData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'staff' as UserRole,
        department: ''
    });

    useEffect(() => {
        const fetchStaff = async () => {
            if (!db) return;
            try {
                // Fetch users who are staff or admin
                const q = query(collection(db, 'users'), where('role', 'in', ['staff', 'admin']));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
                setStaff(data);
            } catch (error) {
                console.error('Error fetching staff:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStaff();
    }, []);

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!db) return;
        setIsSubmitting(true);
        try {
            const docRef = await addDoc(collection(db, 'users'), {
                ...newStaffData,
                language: 'mn',
                notifications: { email: true, push: true, sms: false },
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });

            const freshStaff = { id: docRef.id, ...newStaffData, createdAt: new Date() } as any;
            setStaff([...staff, freshStaff]);
            setIsAddModalOpen(false);
            setNewStaffData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                role: 'staff',
                department: ''
            });
        } catch (error) {
            console.error('Error adding staff:', error);
            alert('Ажилтан нэмэхэд алдаа гарлаа.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateRole = async (staffId: string, newRole: UserRole) => {
        if (!db) return;
        try {
            await updateDoc(doc(db, 'users', staffId), {
                role: newRole,
                updatedAt: Timestamp.now()
            });
            setStaff(staff.map(s => s.id === staffId ? { ...s, role: newRole } : s));
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const filteredStaff = staff.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('admin.staff')}</h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">Системийн админ болон менежерүүдийг удирдах</p>
                    </div>
                    <Button leftIcon={<UserPlus className="w-4 h-4" />} onClick={() => setIsAddModalOpen(true)}>
                        Ажилтан нэмэх
                    </Button>
                </div>

                {/* Search */}
                <Card variant="outlined" padding="sm" className="bg-slate-50/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Нэр эсвэл имэйлээр хайх..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </Card>

                {/* Staff List */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-slate-500 font-medium tracking-widest text-xs uppercase">Уншиж байна...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStaff.map((member) => (
                            <Card key={member.id} variant="elevated" className="group hover:-translate-y-1 transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg ring-4 ring-white shadow-sm">
                                            {member.lastName?.charAt(0) || member.firstName?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 leading-tight">{member.lastName} {member.firstName}</h3>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                                                {member.department || (member.role === 'admin' ? 'System Admin' : 'Manager')}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant={member.role === 'admin' ? 'warning' : 'info'} size="sm">
                                        {member.role.toUpperCase()}
                                    </Badge>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <Mail className="w-4 h-4" />
                                        <span className="text-sm font-medium">{member.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <Phone className="w-4 h-4" />
                                        <span className="text-sm font-medium">{member.phone || 'Утасгүй'}</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-[10px] font-black uppercase p-0 h-auto text-blue-600"
                                            onClick={() => handleUpdateRole(member.id, member.role === 'admin' ? 'staff' : 'admin')}
                                        >
                                            Change Role
                                        </Button>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Staff Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Шинэ ажилтан нэмэх"
            >
                <form onSubmit={handleAddStaff} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Овог"
                            value={newStaffData.lastName}
                            onChange={e => setNewStaffData({ ...newStaffData, lastName: e.target.value })}
                            required
                        />
                        <Input
                            label="Нэр"
                            value={newStaffData.firstName}
                            onChange={e => setNewStaffData({ ...newStaffData, firstName: e.target.value })}
                            required
                        />
                    </div>
                    <Input
                        label="Имэйл хаяг"
                        type="email"
                        value={newStaffData.email}
                        onChange={e => setNewStaffData({ ...newStaffData, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Утасны дугаар"
                        value={newStaffData.phone}
                        onChange={e => setNewStaffData({ ...newStaffData, phone: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Эрх"
                            options={[
                                { value: 'staff', label: 'Менежер' },
                                { value: 'admin', label: 'Админ' }
                            ]}
                            value={newStaffData.role}
                            onChange={e => setNewStaffData({ ...newStaffData, role: e.target.value as UserRole })}
                        />
                        <Input
                            label="Алба хэлтэс"
                            value={newStaffData.department}
                            onChange={e => setNewStaffData({ ...newStaffData, department: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Цуцлах</Button>
                        <Button type="submit" isLoading={isSubmitting}>Бүртгэх</Button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
