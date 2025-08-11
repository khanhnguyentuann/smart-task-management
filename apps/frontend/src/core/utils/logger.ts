// Frontend logging utility
type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
    level: LogLevel
    message: string
    timestamp: string
    context?: string
    data?: any
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development'

    private log(level: LogLevel, message: string, context?: string, data?: any) {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            context,
            data
        }

        // In development, log to console
        if (this.isDevelopment) {
            const prefix = context ? `[${context}]` : ''
            const logMessage = `${prefix} ${message}`

            switch (level) {
                case 'info':
                    console.log(logMessage, data || '')
                    break
                case 'warn':
                    console.warn(logMessage, data || '')
                    break
                case 'error':
                    console.error(logMessage, data || '')
                    break
                case 'debug':
                    console.debug(logMessage, data || '')
                    break
            }
        }

        // In production, you could send to external logging service
        // Example: sendToLoggingService(entry)
    }

    info(message: string, context?: string, data?: any) {
        this.log('info', message, context, data)
    }

    warn(message: string, context?: string, data?: any) {
        this.log('warn', message, context, data)
    }

    error(message: string, context?: string, data?: any) {
        this.log('error', message, context, data)
    }

    debug(message: string, context?: string, data?: any) {
        this.log('debug', message, context, data)
    }
}

export const logger = new Logger()
