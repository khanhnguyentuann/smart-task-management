import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    ValidationPipe,
    Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { AddAssigneeDto, ReplaceAssigneesDto } from './dto/assignee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectMemberGuard } from '../common/guards/project-member.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { AssigneesService } from './assignees/assignees.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(
        private readonly tasksService: TasksService,
        private readonly assigneesService: AssigneesService
    ) { }

    // Create task in project
    @Post('projects/:projectId/tasks')
    @UseGuards(ProjectMemberGuard)
    create(
        @Param('projectId') projectId: string,
        @Body(ValidationPipe) createTaskDto: CreateTaskDto,
        @CurrentUser() user: User,
    ) {
        return this.tasksService.create(projectId, createTaskDto, user.id);
    }

    // Get all tasks in project with filters
    @Get('projects/:projectId/tasks')
    @UseGuards(ProjectMemberGuard)
    findAllByProject(
        @Param('projectId') projectId: string,
        @Query(ValidationPipe) filterDto: TaskFilterDto,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        @CurrentUser() _user: User, // Required for guard validation
    ) {
        return this.tasksService.findAllByProject(projectId, filterDto);
    }

    // Get single task
    @Get('tasks/:id')
    findOne(@Param('id') id: string, @CurrentUser() user: User) {
        return this.tasksService.findOne(id, user.id);
    }

    // Update task
    @Patch('tasks/:id')
    update(
        @Param('id') id: string,
        @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
        @CurrentUser() user: User,
    ) {
        return this.tasksService.update(id, updateTaskDto, user.id);
    }


    // Archive task
    @Post('tasks/:id/archive')
    archive(@Param('id') id: string, @CurrentUser() user: User) {
        return this.tasksService.archive(id, user.id);
    }

    // Restore task from archive
    @Post('tasks/:id/restore')
    restore(@Param('id') id: string, @CurrentUser() user: User) {
        return this.tasksService.restore(id, user.id);
    }

    // Soft delete task (only project owner or task creator)
    @Delete('tasks/:id')
    remove(@Param('id') id: string, @CurrentUser() user: User) {
        return this.tasksService.remove(id, user.id);
    }

    // Get user's assigned tasks across all projects
    @Get('users/me/tasks')
    getMyTasks(
        @CurrentUser() user: User,
        @Query(ValidationPipe) filterDto: TaskFilterDto,
    ) {
        return this.tasksService.getUserTasks(user.id, filterDto);
    }

    // Get all tasks for dashboard (user's tasks across all projects)
    @Get('tasks')
    getAllTasks(@CurrentUser() user: User) {
        return this.tasksService.getUserTasks(user.id, {});
    }

    // ==========================================
    // ASSIGNEES ENDPOINTS
    // ==========================================

    // Get task assignees
    @Get('tasks/:taskId/assignees')
    getTaskAssignees(
        @Param('taskId') taskId: string,
        @CurrentUser() user: User,
    ) {
        return this.assigneesService.getTaskAssignees(taskId, user.id);
    }

    // Replace all task assignees
    @Put('tasks/:taskId/assignees')
    replaceTaskAssignees(
        @Param('taskId') taskId: string,
        @Body(ValidationPipe) dto: ReplaceAssigneesDto,
        @CurrentUser() user: User,
    ) {
        return this.assigneesService.replaceTaskAssignees(taskId, dto, user.id);
    }

    // Add single assignee
    @Post('tasks/:taskId/assignees')
    addTaskAssignee(
        @Param('taskId') taskId: string,
        @Body(ValidationPipe) dto: AddAssigneeDto,
        @CurrentUser() user: User,
    ) {
        return this.assigneesService.addTaskAssignee(taskId, dto, user.id);
    }

    // Remove single assignee
    @Delete('tasks/:taskId/assignees/:userId')
    removeTaskAssignee(
        @Param('taskId') taskId: string,
        @Param('userId') userId: string,
        @CurrentUser() user: User,
    ) {
        return this.assigneesService.removeTaskAssignee(taskId, userId, user.id);
    }

    // Get project members for assignee dropdown
    @Get('tasks/:taskId/project-members')
    getProjectMembers(
        @Param('taskId') taskId: string,
        @CurrentUser() user: User,
    ) {
        return this.assigneesService.getProjectMembers(taskId, user.id);
    }

    // ==========================================
    // LABELS & SUBTASKS ENDPOINTS
    // ==========================================

    // Get task labels
    @Get('tasks/:taskId/labels')
    getTaskLabels(
        @Param('taskId') taskId: string,
        @CurrentUser() user: User,
    ) {
        return this.tasksService.getTaskLabels(taskId, user.id);
    }

    // Get task subtasks
    @Get('tasks/:taskId/subtasks')
    getTaskSubtasks(
        @Param('taskId') taskId: string,
        @CurrentUser() user: User,
    ) {
        return this.tasksService.getTaskSubtasks(taskId, user.id);
    }
}
