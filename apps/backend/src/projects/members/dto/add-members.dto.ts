import { IsArray, IsUUID, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class AddMembersDto {
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one user ID must be provided' })
    @ArrayMaxSize(50, { message: 'Cannot add more than 50 members at once' })
    @IsUUID('4', { each: true, message: 'Each user ID must be a valid UUID' })
    userIds: string[];
}