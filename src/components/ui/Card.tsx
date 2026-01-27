// Card Component
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
    children,
    className,
    variant = 'default',
    padding = 'md',
    ...props
}: CardProps) {
    const variants = {
        default: 'bg-white shadow-sm',
        elevated: 'bg-white shadow-lg shadow-gray-200/50',
        outlined: 'bg-white border border-gray-200',
    };

    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-4 md:p-5',
        lg: 'p-5 md:p-6',
    };

    return (
        <div
            className={cn(
                'rounded-2xl',
                variants[variant],
                paddings[padding],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// Card Header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
    return (
        <div className={cn('mb-4', className)} {...props}>
            {children}
        </div>
    );
}

// Card Title
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> { }

export function CardTitle({ children, className, ...props }: CardTitleProps) {
    return (
        <h3 className={cn('text-lg font-semibold text-gray-900', className)} {...props}>
            {children}
        </h3>
    );
}

// Card Description
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> { }

export function CardDescription({ children, className, ...props }: CardDescriptionProps) {
    return (
        <p className={cn('text-sm text-gray-500 mt-1', className)} {...props}>
            {children}
        </p>
    );
}

// Card Content
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> { }

export function CardContent({ children, className, ...props }: CardContentProps) {
    return (
        <div className={cn('', className)} {...props}>
            {children}
        </div>
    );
}

// Card Footer
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> { }

export function CardFooter({ children, className, ...props }: CardFooterProps) {
    return (
        <div className={cn('mt-4 pt-4 border-t border-gray-100', className)} {...props}>
            {children}
        </div>
    );
}
