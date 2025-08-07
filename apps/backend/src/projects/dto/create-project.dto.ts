import { IsString, IsOptional, MinLength, MaxLength, IsArray, IsUUID, ValidateNested, IsDateString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
    @IsString()
    @MinLength(3, { message: 'Task title must be at least 3 characters long' })
    @MaxLength(100, { message: 'Task title must not exceed 100 characters' })
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Task description must not exceed 500 characters' })
    description?: string;

    @IsOptional()
    @IsString()
    priority?: 'Low' | 'Medium' | 'High';
}

export class CreateProjectDto {
    @IsString()
    @MinLength(3, { message: 'Project name must be at least 3 characters long' })
    @MaxLength(100, { message: 'Project name must not exceed 100 characters' })
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Description must not exceed 500 characters' })
    description?: string;

    @IsOptional()
    @IsEnum(['Low', 'Medium', 'High'])
    priority?: 'Low' | 'Medium' | 'High';

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    memberIds?: string[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTaskDto)
    templateTasks?: CreateTaskDto[];
}