import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { HealthModule } from '../health/health.module';
import { ProjectsModule } from '../projects/projects.module';
import configuration from '../config/configuration';
import { validationSchema } from '../config/validation.schema';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema,
            validationOptions: {
                allowUnknown: true,
                abortEarly: true,
            },
        }),
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => [
                {
                    ttl: configService.get('rateLimit.ttl') * 1000,
                    limit: configService.get('rateLimit.limit'),
                },
            ],
            inject: [ConfigService],
        }),
        DatabaseModule,
        AuthModule,
        HealthModule,
        ProjectsModule, // Thêm ProjectsModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }