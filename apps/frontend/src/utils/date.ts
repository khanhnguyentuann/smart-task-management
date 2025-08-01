import { format, formatDistance, formatRelative, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';

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