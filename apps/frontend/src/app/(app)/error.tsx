'use client'

import { useEffect } from 'react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui'
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AppError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        // Log the error to an error reporting service
        console.error('App error:', error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                        <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl">App Error</CardTitle>
                    <CardDescription>
                        Something went wrong in the application. Please try again.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm text-muted-foreground">
                            Error: {error.message || 'Unknown error occurred'}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button onClick={reset} className="w-full">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try again
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/dashboard')}
                            className="w-full"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
