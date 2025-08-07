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
            },
        });
    }
}