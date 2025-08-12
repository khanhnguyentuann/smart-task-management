'use client'

import { useEffect } from 'react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui'
import { AlertTriangle, RefreshCw, BarChart3 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Dashboard error:', error)
    }, [error])

    return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                        <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <CardTitle className="text-lg">Dashboard Error</CardTitle>
                    <CardDescription>
                        Unable to load dashboard data. Please try again.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm text-muted-foreground">
                            {error.message || 'Failed to load dashboard'}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button onClick={reset} className="w-full">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reload dashboard
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/projects')}
                            className="w-full"
                        >
                            Go to projects
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
