import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MembersService {
    constructor(private prisma: PrismaService) { }

    async getProjectMembers(projectId: string) {
        const members = await this.prisma.projectUser.findMany({
            where: { projectId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                joinedAt: 'asc',
            },
        });

        return members.map(member => ({
            user: member.user,
            joinedAt: member.joinedAt,
        }));
    }

    async addMembers(projectId: string, userIds: string[]) {
        // Check if project exists
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // Check which users already exist in project
        const existingMembers = await this.prisma.projectUser.findMany({
            where: {
                projectId,
                userId: { in: userIds },
            },
            select: { userId: true },
        });

        const existingUserIds = existingMembers.map(m => m.userId);
        const newUserIds = userIds.filter(id => !existingUserIds.includes(id));

        if (newUserIds.length === 0) {
            throw new ConflictException('All users are already members of this project');
        }

        // Verify that all new users exist
        const existingUsers = await this.prisma.user.findMany({
            where: { id: { in: newUserIds } },
            select: { id: true },
        });

        if (existingUsers.length !== newUserIds.length) {
            throw new BadRequestException('One or more users do not exist');
        }

        // Add new members
        const result = await this.prisma.projectUser.createMany({
            data: newUserIds.map(userId => ({
                projectId,
                userId,
            })),
        });

        // Return updated member list
        return {
            added: result.count,
            members: await this.getProjectMembers(projectId),
        };
    }

    async removeMember(projectId: string, userId: string) {
        const member = await this.prisma.projectUser.findUnique({
            where: {
                userId_projectId: {
                    userId,
                    projectId,
                },
            },
        });

        if (!member) {
            throw new NotFoundException('Member not found in this project');
        }

        await this.prisma.projectUser.delete({
            where: {
                userId_projectId: {
                    userId,
                    projectId,
                },
            },
        });

        return { message: 'Member removed successfully' };
    }

    async isProjectOwner(projectId: string, userId: string): Promise<boolean> {
        const project = await this.prisma.project.findFirst({
            where: {
                id: projectId,
                ownerId: userId,
            },
        });

        return !!project;
    }
}