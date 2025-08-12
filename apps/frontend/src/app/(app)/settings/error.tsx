'use client'

import { useEffect } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { RefreshCw, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Settings error:', error)
    }, [error])

    return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900/20">
                        <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <CardTitle className="text-lg">Settings Error</CardTitle>
                    <CardDescription>
                        Unable to load settings. Please try again.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm text-muted-foreground">
                            {error.message || 'Failed to load settings'}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button onClick={reset} className="w-full">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reload settings
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/dashboard')}
                            className="w-full"
                        >
                            Back to dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
