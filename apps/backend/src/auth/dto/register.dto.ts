import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(1, { message: 'First name is required' })
    firstName: string;

    @IsString()
    @MinLength(1, { message: 'Last name is required' })
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
            message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)'
        }
    )
    password: string;
}