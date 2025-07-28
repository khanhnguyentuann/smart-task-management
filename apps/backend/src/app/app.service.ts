import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getWelcome() {
        return {
            message: 'Welcome to Smart Task Management API! 🚀',
            version: '1.0.0',
            documentation: '/api',
            health: '/health',
        };
    }
}