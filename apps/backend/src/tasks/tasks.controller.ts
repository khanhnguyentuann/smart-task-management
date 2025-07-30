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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectMemberGuard } from '../common/guards/project-member.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

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
        @CurrentUser() user: User,
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

    // Delete task (only ADMIN or task creator)
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
}