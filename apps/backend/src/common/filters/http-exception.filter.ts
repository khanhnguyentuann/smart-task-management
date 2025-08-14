import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        // Extract message from exception response
        let message: string;
        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        } else if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
            message = Array.isArray(exceptionResponse.message) 
                ? exceptionResponse.message[0] 
                : exceptionResponse.message;
        } else {
            message = 'An error occurred';
        }

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: message,
        };

        this.logger.error(
            `HTTP ${status} Error Path: ${request.method} ${request.url}`,
            JSON.stringify(errorResponse),
        );

        response.status(status).json(errorResponse);
    }
}