import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PrismaService } from '../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        const { firstName, lastName, email, password } = registerDto;

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('Email đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập.');
        }

        const hashedPassword = await argon2.hash(password);

        const user = await this.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                passwordHash: hashedPassword,
            },
        });

        const tokens = await this.generateTokens(user.id, user.email);

        return {
            ...tokens,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                createdAt: user.createdAt,
            },
        };
    }

    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        const { email, password } = loginDto;

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
        }

        const passwordMatches = await argon2.verify(user.passwordHash, password);

        if (!passwordMatches) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
        }

        const tokens = await this.generateTokens(user.id, user.email);

        return {
            ...tokens,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                createdAt: user.createdAt,
            },
        };
    }

    async refreshToken(refreshToken: string): Promise<Pick<AuthResponseDto, 'accessToken'>> {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('jwt.refreshSecret'),
            });

            const user = await this.validateUser(payload.sub);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const accessToken = await this.jwtService.signAsync(
                { sub: user.id, email: user.email },
                {
                    expiresIn: this.configService.get('jwt.expiresIn'),
                    secret: this.configService.get('jwt.secret'),
                }
            );

            return { accessToken };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async logout(_userId: string): Promise<void> {
        // Future: Implement token blacklisting with Redis
        // TODO: Implement token blacklisting logic
        return;
    }

    private async generateTokens(userId: string, email: string) {
        const payload = { sub: userId, email };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: this.configService.get('jwt.expiresIn'),
                secret: this.configService.get('jwt.secret'),
            }),
            this.jwtService.signAsync(payload, {
                expiresIn: this.configService.get('jwt.refreshExpiresIn'),
                secret: this.configService.get('jwt.refreshSecret'),
            }),
        ]);

        return { accessToken, refreshToken };
    }

    async validateUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user;
    }
}