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
        const projectUser = await this.prisma.projectMember.findFirst({
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
            const assigneeInProject = await this.prisma.projectMember.findFirst({
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
                        avatar: true,
                        firstName: true,
                        lastName: true,
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
            deletedAt: null, // Only show non-deleted tasks
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
        // NOTE: schema hiện không có deadline, dùng dueDate thay thế
        if (filterDto.deadlineFrom || filterDto.deadlineTo) {
            where.dueDate = {} as any;
            if (filterDto.deadlineFrom) {
                (where.dueDate as any).gte = new Date(filterDto.deadlineFrom);
            }
            if (filterDto.deadlineTo) {
                (where.dueDate as any).lte = new Date(filterDto.deadlineTo);
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
                            avatar: true,
                            firstName: true,
                            lastName: true,
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
                deletedAt: null, // Only show non-deleted tasks
                project: {
                    OR: [
                        { ownerId: userId },
                        {
                            members: {
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
                        avatar: true,
                        firstName: true,
                        lastName: true,
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
        const projectOwner = await this.prisma.project.findFirst({
            where: { id: task.projectId, ownerId: userId },
            select: { id: true },
        });
        const isProjectOwner = !!projectOwner;
        const isAssignee = task.assigneeId === userId;
        const isCreator = task.createdById === userId;

        // Project Owner: can edit ALL tasks
        // Members: can only edit tasks they created OR are assigned to
        if (!isProjectOwner && !isAssignee && !isCreator) {
            throw new ForbiddenException('You can only update tasks assigned to you or created by you');
        }

        // Prepare update data
        const updateData: any = { ...updateTaskDto };

        // Handle null dueDate to clear it
        if (updateTaskDto.dueDate === null) {
            updateData.dueDate = null;
        } else if (updateTaskDto.dueDate) {
            updateData.dueDate = new Date(updateTaskDto.dueDate);
        }

        return this.prisma.task.update({
            where: { id },
            data: updateData,
            include: {
                assignee: {
                    select: {
                        id: true,
                        email: true,
                        avatar: true,
                        firstName: true,
                        lastName: true,
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
                        description: true,
                        ownerId: true,
                    },
                },
            },
        });
    }

    async archive(id: string, userId: string) {
        const task = await this.findOne(id, userId);

        // Check permissions (same as update)
        const projectOwner = await this.prisma.project.findFirst({
            where: { id: task.projectId, ownerId: userId },
            select: { id: true },
        });
        const isProjectOwner = !!projectOwner;
        const isAssignee = task.assigneeId === userId;
        const isCreator = task.createdById === userId;

        if (!isProjectOwner && !isAssignee && !isCreator) {
            throw new ForbiddenException('You can only archive tasks assigned to you or created by you');
        }

        await this.prisma.task.update({
            where: { id },
            data: { isArchived: true },
        });

        return { message: 'Task archived successfully' };
    }

    async restore(id: string, userId: string) {
        // Find archived task (including archived ones)
        const task = await this.prisma.task.findFirst({
            where: {
                id,
                isArchived: true,
                deletedAt: null, // Only restore non-deleted tasks
                project: {
                    OR: [
                        { ownerId: userId },
                        {
                            members: {
                                some: {
                                    userId,
                                },
                            },
                        },
                    ],
                },
            },
        });

        if (!task) {
            throw new NotFoundException('Archived task not found or access denied');
        }

        // Check permissions (same as update)
        const projectOwner = await this.prisma.project.findFirst({
            where: { id: task.projectId, ownerId: userId },
            select: { id: true },
        });
        const isProjectOwner = !!projectOwner;
        const isAssignee = task.assigneeId === userId;
        const isCreator = task.createdById === userId;

        if (!isProjectOwner && !isAssignee && !isCreator) {
            throw new ForbiddenException('You can only restore tasks assigned to you or created by you');
        }

        await this.prisma.task.update({
            where: { id },
            data: { isArchived: false },
        });

        return { message: 'Task restored successfully' };
    }

    async remove(id: string, userId: string) {
        const task = await this.findOne(id, userId);

        // Check delete permissions
        const projectOwner = await this.prisma.project.findFirst({
            where: { id: task.projectId, ownerId: userId },
            select: { id: true },
        });
        const isProjectOwner = !!projectOwner;
        const isCreator = task.createdById === userId;

        // Project Owner: can delete ALL tasks
        // Members: can ONLY delete tasks they created (NOT assigned tasks)
        if (!isProjectOwner && !isCreator) {
            throw new ForbiddenException('Only project owner or task creator can delete tasks');
        }

        // Soft delete
        await this.prisma.task.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return { message: 'Task deleted successfully' };
    }

    async getUserTasks(userId: string, filterDto: TaskFilterDto) {
        const where: Prisma.TaskWhereInput = {
            assigneeId: userId, // Only tasks assigned to current user
            deletedAt: null, // Only show non-deleted tasks
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
                assignee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                    },
                },
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
            orderBy: { dueDate: 'asc' },
        });

        return tasks;
    }
}