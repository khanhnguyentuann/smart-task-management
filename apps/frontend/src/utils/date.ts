import { format, formatDistance, formatRelative, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Sun, Moon, Coffee } from 'lucide-react';

export function formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (!isValid(dateObj)) {
        return 'Invalid date';
    }

    return format(dateObj, formatStr, { locale: vi });
}

export function formatDateTime(date: string | Date): string {
    return formatDate(date, 'dd/MM/yyyy HH:mm');
}

export function formatRelativeTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (!isValid(dateObj)) {
        return 'Invalid date';
    }

    return formatDistance(dateObj, new Date(), { addSuffix: true, locale: vi });
}

export function formatRelativeDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (!isValid(dateObj)) {
        return 'Invalid date';
    }

    return formatRelative(dateObj, new Date(), { locale: vi });
}

export function getGreeting() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
        return { icon: Sun, text: "Good morning" };
    } else if (hour >= 12 && hour < 17) {
        return { icon: Coffee, text: "Good afternoon" };
    } else if (hour >= 17 && hour < 22) {
        return { icon: Coffee, text: "Good evening" };
    } else {
        return { icon: Moon, text: "Good night" };
    }
}