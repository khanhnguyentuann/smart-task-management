import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const reflector = app.get(Reflector);
    const logger = new Logger('Bootstrap');

    // Global pipes
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Global filters
    app.useGlobalFilters(new HttpExceptionFilter());

    // Global interceptors
    app.useGlobalInterceptors(new ResponseInterceptor(reflector));

    // CORS configuration
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global prefix
    app.setGlobalPrefix('api', {
        exclude: ['health'],
    });

    // Security headers
    app.use((req, res, next) => {
        res.header('X-Content-Type-Options', 'nosniff');
        res.header('X-Frame-Options', 'DENY');
        res.header('X-XSS-Protection', '1; mode=block');
        next();
    });

    const port = configService.get('port') || 3001;
    await app.listen(port);

    logger.log(`🚀 Backend server is running on http://localhost:${port}`);
    logger.log(`📚 API available at http://localhost:${port}/api`);
    logger.log(`🏥 Health check at http://localhost:${port}/health`);
}

bootstrap().catch((error) => {
    console.error('❌ Application failed to start', error);
    process.exit(1);
});