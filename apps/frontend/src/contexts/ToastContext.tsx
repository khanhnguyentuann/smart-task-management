"use client"

import { createContext, useContext, useState, ReactNode } from 'react';
import { Toast, ToastProvider as RadixToastProvider } from '@/components/ui/Toast';

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
        const newToast: ToastData = { id, ...data };

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
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        variant={toast.variant}
                        onOpenChange={(open) => {
                            if (!open) dismiss(toast.id);
                        }}
                    >
                        {toast.title && <div className="font-semibold">{toast.title}</div>}
                        {toast.description && <div className="text-sm">{toast.description}</div>}
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