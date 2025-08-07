import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll(search?: string) {
        return this.prisma.user.findMany({
            where: search
                ? {
                    email: {
                        contains: search,
                        mode: 'insensitive',
                    },
                }
                : undefined,
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
            orderBy: {
                email: 'asc',
            },
            take: 50, // Limit results
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });
    }
}