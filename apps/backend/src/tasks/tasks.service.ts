import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) { }

    async create(projectId: string, createTaskDto: CreateTaskDto, userId: string) {
        // Verify user is member of project
        const projectUser = await this.prisma.projectUser.findFirst({
            where: {
                projectId,
                userId,
            },
        });

        if (!projectUser) {
            throw new ForbiddenException('You are not a member of this project');
        }

        // If assignee is specified, verify they are also project member
        if (createTaskDto.assigneeId) {
            const assigneeInProject = await this.prisma.projectUser.findFirst({
                where: {
                    projectId,
                    userId: createTaskDto.assigneeId,
                },
            });

            if (!assigneeInProject) {
                throw new BadRequestException('Assignee must be a member of the project');
            }
        }

        return this.prisma.task.create({
            data: {
                ...createTaskDto,
                projectId,
                createdById: userId,
                // AI summary will be added in M4
            },
            include: {
                assignee: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async findAllByProject(projectId: string, filterDto: TaskFilterDto) {
        const where: Prisma.TaskWhereInput = {
            projectId,
        };

        // Apply filters
        if (filterDto.status) {
            where.status = filterDto.status;
        }

        if (filterDto.priority) {
            where.priority = filterDto.priority;
        }

        if (filterDto.assigneeId) {
            where.assigneeId = filterDto.assigneeId;
        }

        if (filterDto.search) {
            where.OR = [
                { title: { contains: filterDto.search, mode: 'insensitive' } },
                { description: { contains: filterDto.search, mode: 'insensitive' } },
            ];
        }

        // Date range filter
        if (filterDto.deadlineFrom || filterDto.deadlineTo) {
            where.deadline = {};
            if (filterDto.deadlineFrom) {
                where.deadline.gte = new Date(filterDto.deadlineFrom);
            }
            if (filterDto.deadlineTo) {
                where.deadline.lte = new Date(filterDto.deadlineTo);
            }
        }

        // Pagination
        const page = filterDto.page || 1;
        const limit = filterDto.limit || 20;
        const skip = (page - 1) * limit;

        // Sorting
        const orderBy: Prisma.TaskOrderByWithRelationInput = {};
        if (filterDto.sortBy) {
            const [field, order] = filterDto.sortBy.split(':');
            orderBy[field as keyof Prisma.TaskOrderByWithRelationInput] = order as Prisma.SortOrder;
        } else {
            orderBy.createdAt = 'desc';
        }

        const [tasks, total] = await Promise.all([
            this.prisma.task.findMany({
                where,
                include: {
                    assignee: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                    createdBy: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.task.count({ where }),
        ]);

        return {
            tasks,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string, userId: string) {
        const task = await this.prisma.task.findFirst({
            where: {
                id,
                project: {
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
            },
            include: {
                assignee: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        ownerId: true,
                    },
                },
            },
        });

        if (!task) {
            throw new NotFoundException('Task not found or access denied');
        }

        return task;
    }

    async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
        const task = await this.findOne(id, userId);

        // Check permissions
        const userRole = await this.getUserRoleInProject(task.projectId, userId);
        const isProjectAdmin = userRole === 'ADMIN' || task.project.ownerId === userId;
        const isAssignee = task.assigneeId === userId;
        const isCreator = task.createdById === userId;

        // Members can only update tasks assigned to them or created by them
        if (!isProjectAdmin && !isAssignee && !isCreator) {
            throw new ForbiddenException('You can only update tasks assigned to you or created by you');
        }

        // If changing assignee, verify new assignee is project member
        if (updateTaskDto.assigneeId !== undefined) {
            if (updateTaskDto.assigneeId) {
                const assigneeInProject = await this.prisma.projectUser.findFirst({
                    where: {
                        projectId: task.projectId,
                        userId: updateTaskDto.assigneeId,
                    },
                });

                if (!assigneeInProject) {
                    throw new BadRequestException('New assignee must be a member of the project');
                }
            }
        }

        return this.prisma.task.update({
            where: { id },
            data: updateTaskDto,
            include: {
                assignee: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async remove(id: string, userId: string) {
        const task = await this.findOne(id, userId);

        // Only project ADMIN or task creator can delete
        const userRole = await this.getUserRoleInProject(task.projectId, userId);
        const isProjectAdmin = userRole === 'ADMIN' || task.project.ownerId === userId;
        const isCreator = task.createdById === userId;

        if (!isProjectAdmin && !isCreator) {
            throw new ForbiddenException('Only project admin or task creator can delete tasks');
        }

        await this.prisma.task.delete({
            where: { id },
        });

        return { message: 'Task deleted successfully' };
    }

    async getUserTasks(userId: string, filterDto: TaskFilterDto) {
        const where: Prisma.TaskWhereInput = {
            assigneeId: userId,
        };

        // Apply same filters as findAllByProject
        if (filterDto.status) {
            where.status = filterDto.status;
        }

        if (filterDto.priority) {
            where.priority = filterDto.priority;
        }

        if (filterDto.search) {
            where.OR = [
                { title: { contains: filterDto.search, mode: 'insensitive' } },
                { description: { contains: filterDto.search, mode: 'insensitive' } },
            ];
        }

        const tasks = await this.prisma.task.findMany({
            where,
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                deadline: 'asc',
            },
        });

        return tasks;
    }

    private async getUserRoleInProject(projectId: string, userId: string) {
        const projectUser = await this.prisma.projectUser.findFirst({
            where: {
                projectId,
                userId,
            },
        });

        return projectUser?.role || null;
    }
}