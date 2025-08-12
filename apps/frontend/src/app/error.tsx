'use client'

import { useEffect } from 'react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function RootError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Root error:', error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-xl">Something went wrong!</CardTitle>
                    <CardDescription>
                        We encountered an unexpected error. Please try again.
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
                            onClick={() => router.push('/')}
                            className="w-full"
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Go to home
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
