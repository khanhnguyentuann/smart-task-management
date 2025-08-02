"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
} from 'react';
import {
    Toast,
    ToastProvider as RadixToastProvider,
    ToastViewport,
    ToastTitle,
    ToastDescription,
    ToastClose,
} from '@/components/ui/Toast';

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning';

export interface ToastData {
    id: string;
    title: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
}
export interface ToastContextType {
    toasts: ToastData[];
    toast: (data: Omit<ToastData, 'id'>) => void;
    dismiss: (id: string) => void;
    dismissAll: () => void;
}

/** Default no‑op implementation to make the hook safe outside of the provider. */
const defaultToastContext: ToastContextType = {
    toasts: [],
    toast: () => { },
    dismiss: () => { },
    dismissAll: () => { },
};

const ToastContext = createContext<ToastContextType>(defaultToastContext);

export function ToastProvider({ children }: { children: ReactNode }): JSX.Element {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const toast = useCallback((data: Omit<ToastData, 'id'>) => {
        const id = Math.random().toString(36).slice(2, 9);
        const newToast: ToastData = {
            id,
            variant: 'default',
            duration: 5000,
            ...data,
        };
        setToasts(prev => [...prev, newToast]);
    }, []);

    /** Remove an individual toast from the queue. */
    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    /** Clear all toasts. Useful when navigating to a new route. */
    const dismissAll = useCallback(() => {
        setToasts([]);
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
            <RadixToastProvider>
                {children}
                {toasts.map(toastData => (
                    <Toast
                        key={toastData.id}
                        open
                        onOpenChange={open => {
                            if (!open) dismiss(toastData.id);
                        }}
                        variant={toastData.variant}
                    >
                        {toastData.title && <ToastTitle>{toastData.title}</ToastTitle>}
                        {toastData.description && (
                            <ToastDescription>{toastData.description}</ToastDescription>
                        )}
                        <ToastClose />
                    </Toast>
                ))}
                <ToastViewport />
            </RadixToastProvider>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextType {
    return useContext(ToastContext);
}