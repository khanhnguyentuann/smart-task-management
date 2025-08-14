import {
    IsString,
    IsOptional,
    IsEnum,
    IsDateString,
    MinLength,
    MaxLength,
} from 'class-validator';
import { TaskStatus, Priority } from '@prisma/client';

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    @MinLength(3, { message: 'Task title must be at least 3 characters long' })
    @MaxLength(200, { message: 'Task title must not exceed 200 characters' })
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000, { message: 'Description must not exceed 2000 characters' })
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;

    @IsOptional()
    @IsDateString()
    dueDate?: string | null; // Allow null to clear due date
}