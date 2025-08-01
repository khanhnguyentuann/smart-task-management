export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
}

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function getUserInitials(firstName?: string, lastName?: string, email?: string): string {
    if (firstName && lastName) {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }

    if (firstName) {
        return firstName.slice(0, 2).toUpperCase();
    }

    if (email) {
        return email.slice(0, 2).toUpperCase();
    }

    return 'U';
}

export function getFullName(firstName?: string, lastName?: string, email?: string): string {
    if (firstName || lastName) {
        return `${firstName || ''} ${lastName || ''}`.trim();
    }

    return email || 'User';
}