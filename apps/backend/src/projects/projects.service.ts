import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRole, UserRole } from '@prisma/client';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async create(createProjectDto: CreateProjectDto, userId: string) {
        const { name, description, memberIds = [] } = createProjectDto;

        // Check if project name already exists for this user
        const existingProject = await this.prisma.project.findFirst({
            where: {
                name,
                ownerId: userId,
            },
        });

        if (existingProject) {
            throw new ConflictException('Project with this name already exists');
        }

        return this.prisma.project.create({
            data: {
                name,
                description,
                ownerId: userId,
                projectUsers: {
                    create: [
                        // Auto-add owner as ADMIN
                        {
                            userId,
                            role: ProjectRole.ADMIN,
                        },
                        // Add other members
                        ...memberIds.map((memberId) => ({
                            userId: memberId,
                            role: ProjectRole.MEMBER,
                        })),
                    ],
                },
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                projectUsers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        projectUsers: true,
                    },
                },
            },
        });
    }

    async findAll(userId: string, userRole: UserRole) {
        // Get all projects where user is a member or owner
        return this.prisma.project.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    {
                        projectUsers: {
                            some: {
                                userId,
                            },
                        },
                    },
                ],
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                _count: {
                    select: {
                        projectUsers: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string, userId: string) {
        const project = await this.prisma.project.findFirst({
            where: {
                id,
                OR: [
                    { ownerId: userId },
                    {
                        projectUsers: {
                            some: {
                                userId,
                            },
                        },
                    },
                ],
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                projectUsers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                role: true,
                            },
                        },
                    },
                    orderBy: {
                        joinedAt: 'asc',
                    },
                },
                _count: {
                    select: {
                        projectUsers: true,
                    },
                },
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found or access denied');
        }

        return project;
    }

    async update(id: string, updateProjectDto: UpdateProjectDto, userId: string) {
        // Check if user is project owner
        const project = await this.prisma.project.findFirst({
            where: {
                id,
                ownerId: userId,
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found or you are not the owner');
        }

        return this.prisma.project.update({
            where: { id },
            data: {
                name: updateProjectDto.name,
                description: updateProjectDto.description,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                projectUsers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        projectUsers: true,
                    },
                },
            },
        });
    }

    async remove(id: string, userId: string) {
        // Check if user is project owner
        const project = await this.prisma.project.findFirst({
            where: {
                id,
                ownerId: userId,
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found or you are not the owner');
        }

        await this.prisma.project.delete({
            where: { id },
        });

        return { message: 'Project deleted successfully' };
    }

    async isProjectMember(projectId: string, userId: string): Promise<boolean> {
        const projectUser = await this.prisma.projectUser.findFirst({
            where: {
                projectId,
                userId,
            },
        });

        return !!projectUser;
    }

    async getProjectRole(projectId: string, userId: string): Promise<ProjectRole | null> {
        const projectUser = await this.prisma.projectUser.findFirst({
            where: {
                projectId,
                userId,
            },
        });

        return projectUser?.role || null;
    }

    async searchProjects(userId: string, query: string) {
        return this.prisma.project.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { ownerId: userId },
                            {
                                projectUsers: {
                                    some: {
                                        userId,
                                    },
                                },
                            },
                        ],
                    },
                    {
                        OR: [
                            {
                                name: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                description: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                _count: {
                    select: {
                        projectUsers: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}