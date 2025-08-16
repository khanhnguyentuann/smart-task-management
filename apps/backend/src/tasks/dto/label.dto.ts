import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateLabelDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    color: string;
}

export class UpdateLabelDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    color?: string;
}
