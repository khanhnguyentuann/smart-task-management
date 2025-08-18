import { IsString, IsOptional, IsArray, IsUUID, IsIn } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { REACTION_EMOJIS } from '../constants/reactions'

export class CreateCommentDto {
    @ApiProperty({ description: 'Comment content' })
    @IsString()
    content: string

    @ApiPropertyOptional({ description: 'Parent comment ID for replies' })
    @IsOptional()
    @IsUUID()
    parentId?: string

    @ApiPropertyOptional({ description: 'Quoted comment ID' })
    @IsOptional()
    @IsUUID()
    quotedCommentId?: string

    @ApiPropertyOptional({ description: 'Mentioned user IDs' })
    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    mentions?: string[]
}

export class UpdateCommentDto {
    @ApiProperty({ description: 'Comment content' })
    @IsString()
    content: string

    @ApiPropertyOptional({ description: 'Mentioned user IDs' })
    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    mentions?: string[]
}

export class AddReactionDto {
    @ApiProperty({ description: 'Emoji reaction', enum: REACTION_EMOJIS })
    @IsString()
    @IsIn(REACTION_EMOJIS, { message: 'Invalid emoji reaction' })
    emoji: string
}

export class CommentReactionResponseDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    commentId: string

    @ApiProperty()
    userId: string

    @ApiProperty()
    emoji: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    user: {
        id: string
        firstName: string
        lastName: string
        avatar?: string
    }
}

export class CommentAttachmentResponseDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    commentId: string

    @ApiProperty()
    fileName: string

    @ApiProperty()
    fileUrl: string

    @ApiProperty()
    fileSize: number

    @ApiProperty()
    mimeType: string

    @ApiProperty()
    uploadedBy: string

    @ApiProperty()
    createdAt: Date
}

export class CommentResponseDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    content: string

    @ApiPropertyOptional()
    formattedContent?: any

    @ApiProperty()
    taskId: string

    @ApiProperty()
    userId: string

    @ApiPropertyOptional()
    parentId?: string

    @ApiPropertyOptional()
    threadId?: string

    @ApiPropertyOptional()
    quotedCommentId?: string

    @ApiProperty()
    mentions: string[]

    @ApiProperty()
    isEdited: boolean

    @ApiPropertyOptional()
    editedAt?: Date

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date

    @ApiPropertyOptional()
    deletedAt?: Date

    // Relations
    @ApiProperty()
    user: {
        id: string
        firstName: string
        lastName: string
        avatar?: string
    }

    @ApiPropertyOptional()
    parent?: CommentResponseDto

    @ApiPropertyOptional({ type: [CommentResponseDto] })
    replies?: CommentResponseDto[]

    @ApiPropertyOptional()
    quotedComment?: CommentResponseDto

    @ApiPropertyOptional({ type: [CommentReactionResponseDto] })
    reactions?: CommentReactionResponseDto[]

    @ApiPropertyOptional({ type: [CommentAttachmentResponseDto] })
    attachments?: CommentAttachmentResponseDto[]
}
