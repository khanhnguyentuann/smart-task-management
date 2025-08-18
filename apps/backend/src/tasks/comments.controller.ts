import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger'
import { Express } from 'express'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CommentsService } from './comments.service'
import { CreateCommentDto, UpdateCommentDto, AddReactionDto, CommentResponseDto } from './dto/comment.dto'

@ApiTags('Comments')
@Controller('tasks/:taskId/comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all comments for a task' })
    @ApiResponse({ status: 200, description: 'Comments retrieved successfully', type: [CommentResponseDto] })
    async getTaskComments(@Param('taskId') taskId: string): Promise<CommentResponseDto[]> {
        return this.commentsService.getTaskComments(taskId)
    }

    @Post()
    @ApiOperation({ summary: 'Create a new comment' })
    @ApiResponse({ status: 201, description: 'Comment created successfully', type: CommentResponseDto })
    async createComment(
        @Param('taskId') taskId: string,
        @Body() dto: CreateCommentDto,
        @Request() req: any
    ): Promise<CommentResponseDto> {
        return this.commentsService.createComment(taskId, req.user.id, dto)
    }

    @Put(':commentId')
    @ApiOperation({ summary: 'Update a comment' })
    @ApiResponse({ status: 200, description: 'Comment updated successfully', type: CommentResponseDto })
    async updateComment(
        @Param('taskId') taskId: string,
        @Param('commentId') commentId: string,
        @Body() dto: UpdateCommentDto,
        @Request() req: any
    ): Promise<CommentResponseDto> {
        return this.commentsService.updateComment(taskId, commentId, req.user.id, dto)
    }

    @Delete(':commentId')
    @ApiOperation({ summary: 'Delete a comment' })
    @ApiResponse({ status: 204, description: 'Comment deleted successfully' })
    async deleteComment(
        @Param('taskId') taskId: string,
        @Param('commentId') commentId: string,
        @Request() req: any
    ): Promise<void> {
        return this.commentsService.deleteComment(taskId, commentId, req.user.id)
    }

    @Post(':commentId/reactions')
    @ApiOperation({ summary: 'Add a reaction to a comment' })
    @ApiResponse({ status: 200, description: 'Reaction added successfully', type: CommentResponseDto })
    async addReaction(
        @Param('taskId') taskId: string,
        @Param('commentId') commentId: string,
        @Body() dto: AddReactionDto,
        @Request() req: any
    ): Promise<CommentResponseDto> {
        return this.commentsService.addReaction(taskId, commentId, req.user.id, dto)
    }

    @Delete(':commentId/reactions/:emoji')
    @ApiOperation({ summary: 'Remove a reaction from a comment' })
    @ApiResponse({ status: 200, description: 'Reaction removed successfully', type: CommentResponseDto })
    async removeReaction(
        @Param('taskId') taskId: string,
        @Param('commentId') commentId: string,
        @Param('emoji') emoji: string,
        @Request() req: any
    ): Promise<CommentResponseDto> {
        return this.commentsService.removeReaction(taskId, commentId, req.user.id, emoji)
    }

    @Post(':commentId/attachments')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload attachment to a comment' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: 'Attachment uploaded successfully' })
    async uploadAttachment(
        @Param('taskId') taskId: string,
        @Param('commentId') commentId: string,
        @UploadedFile() file: Express.Multer.File,
        @Request() req: any
    ): Promise<void> {
        // TODO: Implement file upload logic
        // For now, just validate the comment exists
        // TODO: Add public method to get comment by ID
        console.log('Uploading attachment to comment:', commentId)
        
        // TODO: Upload file to storage (S3, local, etc.)
        // TODO: Create attachment record
        console.log('File upload:', file.originalname, file.size)
    }
}
