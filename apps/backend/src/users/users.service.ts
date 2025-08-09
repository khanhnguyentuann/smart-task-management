import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll(search?: string) {
        const users = await this.prisma.user.findMany({
            where: search
                ? {
                    OR: [
                        {
                            email: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            firstName: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            lastName: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    ],
                }
                : undefined,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
            },
            orderBy: {
                firstName: 'asc',
            },
            take: 50, // Limit results
        });

        return users;
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
                avatar: true,
                department: true,
                dateOfBirth: true,
            },
        });
    }

    async updateProfile(
        id: string,
        payload: { firstName?: string; lastName?: string; department?: string; dateOfBirth?: string; avatar?: string },
    ) {
        let avatarUrl: string | undefined = undefined
        if (payload.avatar && payload.avatar.startsWith('data:image/')) {
            // TODO: integrate real storage; for now, store as data URL or ignore
            avatarUrl = payload.avatar
        } else if (payload.avatar) {
            avatarUrl = payload.avatar
        }

        const updated = await this.prisma.user.update({
            where: { id },
            data: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                department: payload.department,
                dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : undefined,
                avatar: avatarUrl,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
                avatar: true,
                department: true,
                dateOfBirth: true,
            },
        })

        return updated
    }

    async updateAvatar(
        id: string,
        file?: any,
        avatarBase64?: string,
    ) {
        let avatarUrl: string | undefined
        if (file) {
            // TODO: integrate real storage (S3, etc.)
            avatarUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
        } else if (avatarBase64 && avatarBase64.startsWith('data:image/')) {
            avatarUrl = avatarBase64
        }

        const updated = await this.prisma.user.update({
            where: { id },
            data: { avatar: avatarUrl },
            select: {
                id: true,
                avatar: true,
            },
        })

        return updated
    }

    async getAvatar(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { avatar: true },
        })
        return user?.avatar || null
    }
}