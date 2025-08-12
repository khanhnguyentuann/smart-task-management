"use client"

import React from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { AlertTriangle, RefreshCw, Home, Wifi, Shield, Database } from 'lucide-react'

export interface ErrorFallbackProps {
    error?: Error
    errorInfo?: React.ErrorInfo
    resetErrorBoundary?: () => void
    type?: 'network' | 'auth' | 'server' | 'unknown'
    title?: string
    message?: string
    showRetry?: boolean
    showHome?: boolean
    className?: string
}

const ERROR_CONFIGS = {
    network: {
        icon: Wifi,
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
    },
    auth: {
        icon: Shield,
        title: 'Authentication Error',
        message: 'Your session has expired. Please log in again to continue.',
        color: 'text-red-600',
        bgColor: 'bg-red-100'
    },
    server: {
        icon: Database,
        title: 'Server Error',
        message: 'Something went wrong on our end. Please try again later.',
        color: 'text-red-600',
        bgColor: 'bg-red-100'
    },
    unknown: {
        icon: AlertTriangle,
        title: 'Something went wrong',
        message: 'We encountered an unexpected error. Please try again or contact support.',
        color: 'text-red-600',
        bgColor: 'bg-red-100'
    }
}

export function ErrorFallback({
    error,
    errorInfo,
    resetErrorBoundary,
    type = 'unknown',
    title,
    message,
    showRetry = true,
    showHome = true,
    className = ''
}: ErrorFallbackProps) {
    const config = ERROR_CONFIGS[type]
    const IconComponent = config.icon

    const handleRetry = () => {
        if (resetErrorBoundary) {
            resetErrorBoundary()
        } else {
            window.location.reload()
        }
    }

    const handleGoHome = () => {
        window.location.href = '/'
    }

    const handleLogin = () => {
        window.location.href = '/login'
    }

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 bg-background ${className}`}>
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className={`mx-auto mb-4 h-12 w-12 rounded-full ${config.bgColor} flex items-center justify-center`}>
                        <IconComponent className={`h-6 w-6 ${config.color}`} />
                    </div>
                    <CardTitle className="text-xl">{title || config.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                        {message || config.message}
                    </p>

                    {process.env.NODE_ENV === 'development' && error && (
                        <details className="text-xs bg-muted p-3 rounded">
                            <summary className="cursor-pointer font-medium mb-2">Error Details (Development)</summary>
                            <pre className="whitespace-pre-wrap text-red-600">
                                {error.message}
                                {error.stack}
                            </pre>
                            {errorInfo && (
                                <pre className="whitespace-pre-wrap text-blue-600 mt-2">
                                    {errorInfo.componentStack}
                                </pre>
                            )}
                        </details>
                    )}

                    <div className="flex gap-2">
                        {showRetry && (
                            <Button onClick={handleRetry} className="flex-1">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                        )}
                        {type === 'auth' ? (
                            <Button variant="outline" onClick={handleLogin}>
                                <Shield className="h-4 w-4 mr-2" />
                                Login
                            </Button>
                        ) : showHome ? (
                            <Button variant="outline" onClick={handleGoHome}>
                                <Home className="h-4 w-4 mr-2" />
                                Go Home
                            </Button>
                        ) : null}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
