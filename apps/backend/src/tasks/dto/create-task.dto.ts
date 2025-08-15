import {
    IsString,
    IsOptional,
    IsEnum,
    IsDateString,
    MinLength,
    MaxLength,
} from 'class-validator';
import { TaskStatus, Priority } from '@prisma/client';

export class CreateTaskDto {
    @IsString()
    @MinLength(3, { message: 'Task title must be at least 3 characters long' })
    @MaxLength(200, { message: 'Task title must not exceed 200 characters' })
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000, { message: 'Description must not exceed 2000 characters' })
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus = TaskStatus.TODO;

    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority = Priority.MEDIUM;

    @IsOptional()
    @IsDateString()
    dueDate?: string;
}
