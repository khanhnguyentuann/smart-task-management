import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class HealthService {
    constructor(private prisma: PrismaService) { }

    async getHealthStatus() {
        return {
            status: 'ok',
            message: 'Smart Task Management API is running',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            uptime: process.uptime(),
        };
    }

    async getDatabaseHealth() {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            return {
                status: 'ok',
                database: 'connected',
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            return {
                status: 'error',
                database: 'disconnected',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
}