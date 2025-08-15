import { IsArray, IsString, IsUUID } from 'class-validator';

export class AddAssigneeDto {
    @IsString()
    @IsUUID()
    userId: string;
}

export class ReplaceAssigneesDto {
    @IsArray()
    @IsUUID('4', { each: true })
    userIds: string[];
}
