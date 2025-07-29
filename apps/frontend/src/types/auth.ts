export interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'MEMBER';
    firstName?: string;
    lastName?: string;
    avatar?: string;
    createdAt: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    role?: 'ADMIN' | 'MEMBER';
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}