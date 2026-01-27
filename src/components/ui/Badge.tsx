// Badge Component
import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
    size?: 'sm' | 'md';
}

export function Badge({
    children,
    className,
    variant = 'default',
    size = 'md',
    ...props
}: BadgeProps) {
    const variants = {
        default: 'bg-gray-100 text-gray-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-amber-100 text-amber-700',
        error: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
        purple: 'bg-purple-100 text-purple-700',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center font-medium rounded-full',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}

// Status Badge with dot indicator
interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: string;
    label: string;
}

export function StatusBadge({ status, label, className, ...props }: StatusBadgeProps) {
    const getStatusStyles = (status: string) => {
        const styles: Record<string, { bg: string; dot: string; text: string }> = {
            pending: { bg: 'bg-gray-100', dot: 'bg-gray-500', text: 'text-gray-700' },
            consultation: { bg: 'bg-blue-100', dot: 'bg-blue-500', text: 'text-blue-700' },
            payment_pending: { bg: 'bg-amber-100', dot: 'bg-amber-500', text: 'text-amber-700' },
            paid: { bg: 'bg-green-100', dot: 'bg-green-500', text: 'text-green-700' },
            documents_pending: { bg: 'bg-orange-100', dot: 'bg-orange-500', text: 'text-orange-700' },
            documents_incomplete: { bg: 'bg-red-100', dot: 'bg-red-500', text: 'text-red-700' },
            documents_complete: { bg: 'bg-emerald-100', dot: 'bg-emerald-500', text: 'text-emerald-700' },
            processing: { bg: 'bg-indigo-100', dot: 'bg-indigo-500', text: 'text-indigo-700' },
            submitted: { bg: 'bg-purple-100', dot: 'bg-purple-500', text: 'text-purple-700' },
            approved: { bg: 'bg-green-100', dot: 'bg-green-500', text: 'text-green-700' },
            rejected: { bg: 'bg-red-100', dot: 'bg-red-500', text: 'text-red-700' },
            completed: { bg: 'bg-green-100', dot: 'bg-green-500', text: 'text-green-700' },
        };
        return styles[status] || styles.pending;
    };

    const style = getStatusStyles(status);

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                style.bg,
                style.text,
                className
            )}
            {...props}
        >
            <span className={cn('w-1.5 h-1.5 rounded-full', style.dot)} />
            {label}
        </span>
    );
}
