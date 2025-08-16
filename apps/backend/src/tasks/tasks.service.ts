import {
    Injectable,
    NotFoundException,
    ForbiddenException,
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

        return this.prisma.task.create({
            data: {
                ...createTaskDto,
                projectId,
                createdById: userId,
                // AI summary will be added in M4
            },
            include: {
                assignees: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                avatar: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        assignedByUser: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: { assignedAt: 'asc' },
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
            where.assignees = {
                some: {
                    userId: filterDto.assigneeId,
                },
            };
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
                    assignees: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    avatar: true,
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                        orderBy: { assignedAt: 'asc' },
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
                assignees: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                avatar: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        assignedByUser: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: { assignedAt: 'asc' },
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
        const isAssignee = task.assignees.some(assignee => assignee.userId === userId);
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
                assignees: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                avatar: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        assignedByUser: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: { assignedAt: 'asc' },
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
        const isAssignee = task.assignees.some(assignee => assignee.userId === userId);
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
            include: {
                assignees: {
                    select: {
                        userId: true,
                    },
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
        const isAssignee = task.assignees.some(assignee => assignee.userId === userId);
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
            assignees: {
                some: {
                    userId: userId,
                },
            },
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
                assignees: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: { assignedAt: 'asc' },
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

    // ==========================================
    // LABELS & SUBTASKS METHODS
    // ==========================================

    async getTaskLabels(taskId: string, userId: string) {
        // Verify user has access to task
        await this.findOne(taskId, userId);

        const labels = await this.prisma.taskLabel.findMany({
            where: { taskId },
            orderBy: { createdAt: 'asc' },
        });

        return labels;
    }

    async createTaskLabel(taskId: string, createLabelDto: any, userId: string) {
        // Verify user has access to task
        const task = await this.findOne(taskId, userId);

        // Check if user has permission to modify task
        const isProjectOwner = task.project.ownerId === userId;
        const isTaskCreator = task.createdBy.id === userId;
        const isAssignee = task.assignees.some(assignee => assignee.userId === userId);

        if (!isProjectOwner && !isTaskCreator && !isAssignee) {
            throw new ForbiddenException('You do not have permission to add labels to this task');
        }

        const label = await this.prisma.taskLabel.create({
            data: {
                name: createLabelDto.name,
                color: createLabelDto.color,
                taskId: taskId,
            },
        });

        return label;
    }

    async updateTaskLabel(taskId: string, labelId: string, updateLabelDto: any, userId: string) {
        // Verify user has access to task
        const task = await this.findOne(taskId, userId);

        // Check if user has permission to modify task
        const isProjectOwner = task.project.ownerId === userId;
        const isTaskCreator = task.createdBy.id === userId;
        const isAssignee = task.assignees.some(assignee => assignee.userId === userId);

        if (!isProjectOwner && !isTaskCreator && !isAssignee) {
            throw new ForbiddenException('You do not have permission to update labels for this task');
        }

        // Check if label exists and belongs to this task
        const existingLabel = await this.prisma.taskLabel.findFirst({
            where: {
                id: labelId,
                taskId: taskId,
            },
        });

        if (!existingLabel) {
            throw new NotFoundException('Label not found');
        }

        const updatedLabel = await this.prisma.taskLabel.update({
            where: { id: labelId },
            data: {
                ...(updateLabelDto.name && { name: updateLabelDto.name }),
                ...(updateLabelDto.color && { color: updateLabelDto.color }),
            },
        });

        return updatedLabel;
    }

    async deleteTaskLabel(taskId: string, labelId: string, userId: string) {
        // Verify user has access to task
        const task = await this.findOne(taskId, userId);

        // Check if user has permission to modify task
        const isProjectOwner = task.project.ownerId === userId;
        const isTaskCreator = task.createdBy.id === userId;
        const isAssignee = task.assignees.some(assignee => assignee.userId === userId);

        if (!isProjectOwner && !isTaskCreator && !isAssignee) {
            throw new ForbiddenException('You do not have permission to delete labels for this task');
        }

        // Check if label exists and belongs to this task
        const existingLabel = await this.prisma.taskLabel.findFirst({
            where: {
                id: labelId,
                taskId: taskId,
            },
        });

        if (!existingLabel) {
            throw new NotFoundException('Label not found');
        }

        await this.prisma.taskLabel.delete({
            where: { id: labelId },
        });

        return { message: 'Label deleted successfully' };
    }

    async getTaskSubtasks(taskId: string, userId: string) {
        // Verify user has access to task
        await this.findOne(taskId, userId);

        const subtasks = await this.prisma.task.findMany({
            where: {
                parentTaskId: taskId,
                deletedAt: null
            },
            orderBy: { createdAt: 'asc' },
        });

        return subtasks;
    }
}
