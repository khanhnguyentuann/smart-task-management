"use client"

import { createContext, useContext, useState, ReactNode } from 'react';
import {
    Toast,
    ToastProvider as RadixToastProvider,
    ToastViewport,
    ToastTitle,
    ToastDescription,
    ToastClose,
} from '@/components/ui/Toast';

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning';

interface ToastData {
    id: string;
    title: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
}

interface ToastContextType {
    toasts: ToastData[];
    toast: (data: Omit<ToastData, 'id'>) => void;
    dismiss: (id: string) => void;
    dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const toast = (data: Omit<ToastData, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: ToastData = { 
            id, 
            variant: 'default',
            duration: 5000,
            ...data 
        };

        setToasts((prev) => [...prev, newToast]);

        // Auto dismiss after duration
        const duration = data.duration || 5000;
        setTimeout(() => {
            dismiss(id);
        }, duration);
    };

    const dismiss = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const dismissAll = () => {
        setToasts([]);
    };

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
            <RadixToastProvider>
                {children}
                <ToastViewport />
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        open={true}
                        onOpenChange={(open) => {
                            if (!open) dismiss(toast.id);
                        }}
                        variant={toast.variant}
                    >
                        {toast.title && (
                            <ToastTitle>{toast.title}</ToastTitle>
                        )}
                        {toast.description && (
                            <ToastDescription>{toast.description}</ToastDescription>
                        )}
                        <ToastClose />
                    </Toast>
                ))}
            </RadixToastProvider>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}