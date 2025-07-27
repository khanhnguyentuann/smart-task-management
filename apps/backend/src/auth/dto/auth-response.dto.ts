import { UserRole } from '@prisma/client';

export class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        role: UserRole;
        createdAt: Date;
    };
}