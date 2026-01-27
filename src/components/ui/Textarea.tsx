import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={cn(
                        'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl min-h-[120px]',
                        'text-gray-900 placeholder:text-gray-400',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
                        'transition-all duration-200',
                        'disabled:bg-gray-50 disabled:cursor-not-allowed',
                        error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
