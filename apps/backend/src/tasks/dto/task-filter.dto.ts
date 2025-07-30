import { IsOptional, IsEnum, IsUUID, IsString, IsInt, Min, Max, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus, Priority } from '@prisma/client';

export class TaskFilterDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;

    @IsOptional()
    @IsUUID('4')
    assigneeId?: string;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsDateString()
    deadlineFrom?: string;

    @IsOptional()
    @IsDateString()
    deadlineTo?: string;

    @IsOptional()
    @IsString()
    sortBy?: string; // format: "field:order" e.g., "createdAt:desc"

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;
}