import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { CreateCommentDto, UpdateCommentDto, AddReactionDto, CommentResponseDto } from './dto/comment.dto'
import { REACTION_EMOJIS } from './constants/reactions'

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }

    async getTaskComments(taskId: string): Promise<CommentResponseDto[]> {
        const comments = await this.prisma.comment.findMany({
            where: {
                taskId,
                deletedAt: null,
                parentId: null // Only root comments
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                },
                replies: {
                    where: { deletedAt: null },
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true
                            }
                        },
                        reactions: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        avatar: true
                                    }
                                }
                            }
                        },
                        attachments: true,
                        replies: {
                            where: { deletedAt: null },
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        avatar: true
                                    }
                                },
                                reactions: {
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                firstName: true,
                                                lastName: true,
                                                avatar: true
                                            }
                                        }
                                    }
                                },
                                attachments: true,
                                replies: {
                                    where: { deletedAt: null },
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                firstName: true,
                                                lastName: true,
                                                avatar: true
                                            }
                                        },
                                        reactions: {
                                            include: {
                                                user: {
                                                    select: {
                                                        id: true,
                                                        firstName: true,
                                                        lastName: true,
                                                        avatar: true
                                                    }
                                                }
                                            }
                                        },
                                        attachments: true
                                    },
                                    orderBy: { createdAt: 'asc' }
                                }
                            },
                            orderBy: { createdAt: 'asc' }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                },
                quotedComment: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true
                            }
                        }
                    }
                },
                reactions: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true
                            }
                        }
                    }
                },
                attachments: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return comments.map(comment => this.transformComment(comment))
    }

    async createComment(taskId: string, userId: string, dto: CreateCommentDto): Promise<CommentResponseDto> {
        // Verify task exists
        const task = await this.prisma.task.findUnique({
            where: { id: taskId }
        })
        if (!task) {
            throw new NotFoundException('Task not found')
        }

        // Generate threadId for replies
        let threadId: string | null = null
        if (dto.parentId) {
            const parentComment = await this.prisma.comment.findUnique({
                where: { id: dto.parentId }
            })
            if (!parentComment) {
                throw new NotFoundException('Parent comment not found')
            }
            threadId = parentComment.threadId || parentComment.id
        }

        // Simple markdown formatting
        const formattedContent = this.formatMarkdown(dto.content)

        const comment = await this.prisma.comment.create({
            data: {
                content: dto.content,
                formattedContent,
                taskId,
                userId,
                parentId: dto.parentId,
                threadId,
                quotedCommentId: dto.quotedCommentId,
                mentions: dto.mentions || []
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                },
                quotedComment: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true
                            }
                        }
                    }
                },
                reactions: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true
                            }
                        }
                    }
                },
                attachments: true
            }
        })

        return this.transformComment(comment)
    }

    async updateComment(taskId: string, commentId: string, userId: string, dto: UpdateCommentDto): Promise<CommentResponseDto> {
        const comment = await this.prisma.comment.findFirst({
            where: {
                id: commentId,
                taskId,
                deletedAt: null
            }
        })

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        if (comment.userId !== userId) {
            throw new ForbiddenException('You can only edit your own comments')
        }

        // Format the updated content
        const formattedContent = this.formatMarkdown(dto.content)

        const updatedComment = await this.prisma.comment.update({
            where: { id: commentId },
            data: {
                content: dto.content,
                formattedContent,
                mentions: dto.mentions || [],
                isEdited: true,
                editedAt: new Date()
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                },
                quotedComment: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true
                            }
                        }
                    }
                },
                reactions: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true
                            }
                        }
                    }
                },
                attachments: true
            }
        })

        return this.transformComment(updatedComment)
    }

    async deleteComment(taskId: string, commentId: string, userId: string): Promise<void> {
        const comment = await this.prisma.comment.findFirst({
            where: {
                id: commentId,
                taskId,
                deletedAt: null
            }
        })

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        if (comment.userId !== userId) {
            throw new ForbiddenException('You can only delete your own comments')
        }

        // Soft delete
        await this.prisma.comment.update({
            where: { id: commentId },
            data: {
                deletedAt: new Date(),
                deletedBy: userId
            }
        })
    }

    async addReaction(taskId: string, commentId: string, userId: string, dto: AddReactionDto): Promise<CommentResponseDto> {
        const comment = await this.prisma.comment.findFirst({
            where: {
                id: commentId,
                taskId,
                deletedAt: null
            }
        })

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        // First, delete any existing reaction from this user on this comment
        await this.prisma.commentReaction.deleteMany({
            where: {
                commentId,
                userId
            }
        })

        // Then add the new reaction
        await this.prisma.commentReaction.create({
            data: {
                commentId,
                userId,
                emoji: dto.emoji
            }
        })

        // Return updated comment
        return this.getCommentById(commentId)
    }

    async removeReaction(taskId: string, commentId: string, userId: string, emoji: string): Promise<CommentResponseDto> {
        // Validate emoji
        if (!REACTION_EMOJIS.includes(emoji as any)) {
            throw new BadRequestException('Invalid emoji reaction')
        }

        const comment = await this.prisma.comment.findFirst({
            where: {
                id: commentId,
                taskId,
                deletedAt: null
            }
        })

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        await this.prisma.commentReaction.deleteMany({
            where: {
                commentId,
                userId,
                emoji
            }
        })

        // Return updated comment
        return this.getCommentById(commentId)
    }

    async addAttachment(commentId: string, userId: string, fileData: {
        fileName: string
        fileUrl: string
        fileSize: number
        mimeType: string
    }): Promise<void> {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId }
        })

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        await this.prisma.commentAttachment.create({
            data: {
                commentId,
                uploadedBy: userId,
                ...fileData
            }
        })
    }

    private async getCommentById(commentId: string): Promise<CommentResponseDto> {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                },
                replies: {
                    where: { deletedAt: null },
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true
                            }
                        },
                        reactions: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        avatar: true
                                    }
                                }
                            }
                        },
                        attachments: true,
                        replies: {
                            where: { deletedAt: null },
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        avatar: true
                                    }
                                },
                                reactions: {
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                firstName: true,
                                                lastName: true,
                                                avatar: true
                                            }
                                        }
                                    }
                                },
                                attachments: true,
                                replies: {
                                    where: { deletedAt: null },
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                firstName: true,
                                                lastName: true,
                                                avatar: true
                                            }
                                        },
                                        reactions: {
                                            include: {
                                                user: {
                                                    select: {
                                                        id: true,
                                                        firstName: true,
                                                        lastName: true,
                                                        avatar: true
                                                    }
                                                }
                                            }
                                        },
                                        attachments: true
                                    },
                                    orderBy: { createdAt: 'asc' }
                                }
                            },
                            orderBy: { createdAt: 'asc' }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                },
                quotedComment: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true
                            }
                        }
                    }
                },
                reactions: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                avatar: true
                            }
                        }
                    }
                },
                attachments: true
            }
        })

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        return this.transformComment(comment)
    }

    private transformComment(comment: any): CommentResponseDto {
        return {
            id: comment.id,
            content: comment.content,
            formattedContent: comment.formattedContent,
            taskId: comment.taskId,
            userId: comment.userId,
            parentId: comment.parentId,
            threadId: comment.threadId,
            quotedCommentId: comment.quotedCommentId,
            mentions: comment.mentions,
            isEdited: comment.isEdited,
            editedAt: comment.editedAt,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            deletedAt: comment.deletedAt,
            user: comment.user,
            parent: comment.parent ? this.transformComment(comment.parent) : undefined,
            replies: comment.replies ? comment.replies.map((reply: any) => this.transformComment(reply)) : undefined,
            quotedComment: comment.quotedComment ? this.transformComment(comment.quotedComment) : undefined,
            reactions: comment.reactions,
            attachments: comment.attachments
        }
    }

    private formatMarkdown(content: string): any {
        // Simple markdown formatting
        let formatted = content

        // Bold: **text** -> <strong>text</strong>
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

        // Italic: *text* -> <em>text</em>
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>')

        // Code: `code` -> <code>code</code>
        formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>')

        // Line breaks: \n -> <br>
        formatted = formatted.replace(/\n/g, '<br>')

        // Mentions: @userId -> <span class="mention">@userId</span>
        formatted = formatted.replace(/@(\w+)/g, '<span class="mention">@$1</span>')

        return formatted
    }
}
