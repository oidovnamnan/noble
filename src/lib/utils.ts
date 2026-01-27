// Utility functions
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

// Format currency in Mongolian Tugrik
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('mn-MN', {
        style: 'currency',
        currency: 'MNT',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

// Format date
export function formatDate(date: Date | string, locale: 'mn' | 'en' = 'mn'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale === 'mn' ? 'mn-MN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(d);
}

// Format relative time
export function formatRelativeTime(date: Date | string, locale: 'mn' | 'en' = 'mn'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (locale === 'mn') {
        if (diffMins < 1) return 'Дөнгөж сая';
        if (diffMins < 60) return `${diffMins} минутын өмнө`;
        if (diffHours < 24) return `${diffHours} цагийн өмнө`;
        if (diffDays < 7) return `${diffDays} өдрийн өмнө`;
        return formatDate(d, locale);
    } else {
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        return formatDate(d, locale);
    }
}

// Generate application number
export function generateApplicationNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `NOB-${year}-${random}`;
}

// Get status color
export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        pending: 'bg-gray-100 text-gray-800',
        consultation: 'bg-blue-100 text-blue-800',
        payment_pending: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800',
        documents_pending: 'bg-orange-100 text-orange-800',
        documents_incomplete: 'bg-red-100 text-red-800',
        documents_complete: 'bg-emerald-100 text-emerald-800',
        processing: 'bg-indigo-100 text-indigo-800',
        submitted: 'bg-purple-100 text-purple-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        completed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

// Calculate progress percentage based on status
export function calculateProgress(status: string): number {
    const progressMap: Record<string, number> = {
        pending: 5,
        consultation: 10,
        payment_pending: 15,
        paid: 25,
        documents_pending: 35,
        documents_incomplete: 40,
        documents_complete: 55,
        processing: 70,
        submitted: 85,
        approved: 95,
        rejected: 100,
        completed: 100,
    };
    return progressMap[status] || 0;
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

// Validate email
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone (Mongolian format)
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+976)?[0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// File size formatter
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get file extension
export function getFileExtension(filename: string): string {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}
