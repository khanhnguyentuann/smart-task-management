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
import { UsersModule } from '../users/users.module';
import { TasksModule } from '../tasks/tasks.module';
import { CommonModule } from '../common/common.module';
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
                    limit: process.env.NODE_ENV === 'development' ? 1000 : configService.get('rateLimit.limit'), // Increase limit for dev
                },
            ],
            inject: [ConfigService],
        }),
        DatabaseModule,
        CommonModule,
        AuthModule,
        HealthModule,
        ProjectsModule,
        UsersModule,
        TasksModule, // Thêm TasksModule
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