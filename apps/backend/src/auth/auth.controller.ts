import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    ValidationPipe,
    Get,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthResponseDto } from './dto/auth-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SkipResponseWrapper } from '../common/decorators/skip-response-wrapper.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @SkipResponseWrapper()
    async register(
        @Body(ValidationPipe) registerDto: RegisterDto,
    ): Promise<AuthResponseDto> {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @SkipResponseWrapper()
    async login(
        @Body(ValidationPipe) loginDto: LoginDto,
    ): Promise<AuthResponseDto> {
        return this.authService.login(loginDto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @SkipResponseWrapper()
    async refresh(
        @Body(ValidationPipe) refreshTokenDto: RefreshTokenDto,
    ): Promise<Pick<AuthResponseDto, 'accessToken'>> {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @SkipResponseWrapper()
    async getProfile(@CurrentUser() user: User) {
        return { user };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @SkipResponseWrapper()
    async logout(@CurrentUser() user: User) {
        await this.authService.logout(user.id);
        return { message: 'Logout successful' };
    }
}