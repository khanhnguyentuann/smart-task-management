import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AddAssigneeDto, ReplaceAssigneesDto } from '../dto/assignee.dto';

@Injectable()
export class AssigneesService {
    constructor(private prisma: PrismaService) {}

    async getTaskAssignees(taskId: string, userId: string) {
        
        // Check if user has access to this task
        const task = await this.prisma.task.findFirst({
            where: {
                id: taskId,
                project: {
                    OR: [
                        { ownerId: userId },
                        { members: { some: { userId } } }
                    ]
                }
            },
            include: {
                project: {
                    select: {
                        ownerId: true,
                        members: {
                            select: { userId: true, role: true }
                        }
                    }
                }
            }
        });

        if (!task) {
            throw new NotFoundException('Task not found or access denied');
        }

        // Get assignees with user details
        const assignees = await this.prisma.taskAssignee.findMany({
            where: { taskId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true
                    }
                },
                assignedByUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { assignedAt: 'asc' }
        });

        console.log('🔍 Backend: Task assignees for taskId:', taskId, 'Assignees:', assignees);
        return assignees;
    }

    async replaceTaskAssignees(taskId: string, dto: ReplaceAssigneesDto, userId: string) {
        // Check permissions
        await this.checkTaskPermissions(taskId, userId);

        // Validate that all userIds are project members
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: {
                project: {
                    include: {
                        members: { select: { userId: true } }
                    }
                }
            }
        });

        const projectMemberIds = task.project.members.map(m => m.userId);
        projectMemberIds.push(task.project.ownerId); // Include project owner

        const invalidUserIds = dto.userIds.filter(id => !projectMemberIds.includes(id));
        if (invalidUserIds.length > 0) {
            throw new BadRequestException(`Users ${invalidUserIds.join(', ')} are not project members`);
        }

        // Replace assignees in transaction
        return await this.prisma.$transaction(async (tx) => {
            // Remove all existing assignees
            await tx.taskAssignee.deleteMany({
                where: { taskId }
            });

            // Add new assignees
            const assignees = await Promise.all(
                dto.userIds.map(assigneeUserId =>
                    tx.taskAssignee.create({
                        data: {
                            taskId,
                            userId: assigneeUserId,
                            assignedBy: userId
                        },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    avatar: true
                                }
                            }
                        }
                    })
                )
            );

            return assignees;
        });
    }

    async addTaskAssignee(taskId: string, dto: AddAssigneeDto, userId: string) {
        // Check permissions
        await this.checkTaskPermissions(taskId, userId);

        // Check if user is already assigned
        const existingAssignee = await this.prisma.taskAssignee.findUnique({
            where: {
                taskId_userId: {
                    taskId,
                    userId: dto.userId
                }
            }
        });

        if (existingAssignee) {
            throw new BadRequestException('User is already assigned to this task');
        }

        // Validate that user is a project member
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: {
                project: {
                    include: {
                        members: { select: { userId: true } }
                    }
                }
            }
        });

        const projectMemberIds = task.project.members.map(m => m.userId);
        projectMemberIds.push(task.project.ownerId); // Include project owner

        if (!projectMemberIds.includes(dto.userId)) {
            throw new BadRequestException('User is not a project member');
        }

        // Add assignee
        const assignee = await this.prisma.taskAssignee.create({
            data: {
                taskId,
                userId: dto.userId,
                assignedBy: userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true
                    }
                }
            }
        });

        return assignee;
    }

    async removeTaskAssignee(taskId: string, assigneeUserId: string, userId: string) {
        // Check permissions
        await this.checkTaskPermissions(taskId, userId);

        const assignee = await this.prisma.taskAssignee.findUnique({
            where: {
                taskId_userId: {
                    taskId,
                    userId: assigneeUserId
                }
            }
        });

        if (!assignee) {
            throw new NotFoundException('Assignee not found');
        }

        await this.prisma.taskAssignee.delete({
            where: {
                taskId_userId: {
                    taskId,
                    userId: assigneeUserId
                }
            }
        });

        return { message: 'Assignee removed successfully' };
    }

    async getProjectMembers(taskId: string, userId: string) {
        // Check if user has access to this task
        const task = await this.prisma.task.findFirst({
            where: {
                id: taskId,
                project: {
                    OR: [
                        { ownerId: userId },
                        { members: { some: { userId } } }
                    ]
                }
            },
            include: {
                project: {
                    include: {
                        owner: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                avatar: true
                            }
                        },
                        members: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                        avatar: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!task) {
            throw new NotFoundException('Task not found or access denied');
        }

        // Combine owner and members
        const members = [
            task.project.owner,
            ...task.project.members.map(m => m.user)
        ].filter(Boolean); // Remove null/undefined

        // Remove duplicates (in case owner is also a member)
        const uniqueMembers = members.filter((member, index, self) => 
            index === self.findIndex(m => m.id === member.id)
        );

        return uniqueMembers;
    }

    private async checkTaskPermissions(taskId: string, userId: string) {
        const task = await this.prisma.task.findFirst({
            where: {
                id: taskId,
                OR: [
                    { createdById: userId }, // Task creator
                    { project: { ownerId: userId } }, // Project owner
                    { 
                        project: { 
                            members: { 
                                some: { 
                                    userId,
                                    role: { in: ['OWNER', 'ADMIN'] }
                                } 
                            } 
                        } 
                    } // Project admin
                ]
            }
        });

        if (!task) {
            throw new ForbiddenException('You do not have permission to manage assignees for this task');
        }

        return task;
    }
}
