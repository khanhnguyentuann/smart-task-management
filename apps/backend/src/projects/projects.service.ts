import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    private normalizePriority(priority: string): 'LOW' | 'MEDIUM' | 'HIGH' {
        const normalized = priority.toLowerCase()
        if (normalized === 'low') return 'LOW'
        if (normalized === 'medium') return 'MEDIUM'
        if (normalized === 'high') return 'HIGH'
        return 'MEDIUM'
    }

    async create(createProjectDto: CreateProjectDto, userId: string) {
        const { name, description, priority, color, startDate, endDate, memberIds = [], templateTasks = [] } = createProjectDto;

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

        const result = await this.prisma.project.create({
            data: {
                name,
                description,
                priority: this.normalizePriority(priority),
                color: color || 'bg-blue-500',
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                ownerId: userId,
                projectUsers: {
                    create: [
                        // Auto-add owner as member
                        {
                            userId,
                        },
                        // Add other members
                        ...memberIds.map((memberId) => ({
                            userId: memberId,
                        })),
                    ],
                },
                // Create tasks from template if provided
                tasks: templateTasks.length > 0 ? {
                    create: templateTasks.map((task: any) => ({
                        title: task.title,
                        description: task.description,
                        status: 'TODO',
                        priority: task.priority === 'High' ? 'HIGH' : task.priority === 'Medium' ? 'MEDIUM' : 'LOW',
                        createdById: userId,
                    }))
                } : undefined,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                projectUsers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        status: true,
                        priority: true,
                        assigneeId: true,
                        assignee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                _count: {
                    select: {
                        projectUsers: true,
                        tasks: true,
                    },
                },
            },
        });

        // Add currentUserId to response for frontend processing
        return {
            ...result,
            currentUserId: userId
        };
    }

    async findAll(userId: string) {
        // Get all projects where user is a member or owner
        const projects = await this.prisma.project.findMany({
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
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                projectUsers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        status: true,
                        priority: true,
                        assigneeId: true,
                        assignee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                _count: {
                    select: {
                        projectUsers: true,
                        tasks: true,
                    },
                },
            },
        });

        // Add currentUserId to each project for frontend processing
        return projects.map(project => ({
            ...project,
            currentUserId: userId
        }));
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
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                projectUsers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
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

        // Add currentUserId to response for frontend processing
        return { ...project, currentUserId: userId };
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

        const result = await this.prisma.project.update({
            where: { id },
            data: {
                name: updateProjectDto.name,
                description: updateProjectDto.description,
                priority: this.normalizePriority(updateProjectDto.priority),
                color: updateProjectDto.color,
                startDate: updateProjectDto.startDate ? new Date(updateProjectDto.startDate) : null,
                endDate: updateProjectDto.endDate ? new Date(updateProjectDto.endDate) : null,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                projectUsers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        status: true,
                        priority: true,
                        assigneeId: true,
                        assignee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                _count: {
                    select: {
                        projectUsers: true,
                        tasks: true,
                    },
                },
            },
        });

        // Add currentUserId to response for frontend processing
        return { ...result, currentUserId: userId };
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

    async isProjectOwner(projectId: string, userId: string): Promise<boolean> {
        const project = await this.prisma.project.findFirst({
            where: {
                id: projectId,
                ownerId: userId,
            },
        });

        return !!project;
    }

    async searchProjects(userId: string, query: string) {
        const projects = await this.prisma.project.findMany({
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
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                projectUsers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        status: true,
                        priority: true,
                        assigneeId: true,
                        assignee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                _count: {
                    select: {
                        projectUsers: true,
                        tasks: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Add currentUserId to each project for frontend processing
        return projects.map(project => ({
            ...project,
            currentUserId: userId
        }));
    }
}