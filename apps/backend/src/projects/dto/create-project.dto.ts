import { IsString, IsOptional, MinLength, MaxLength, IsArray, IsUUID } from 'class-validator';

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
    @IsArray()
    @IsUUID('4', { each: true })
    memberIds?: string[];
}