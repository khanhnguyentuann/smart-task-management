"use client"

import { useEffect } from "react"
import { RefreshCw, AlertTriangle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { ErrorPage } from "@/shared/components/error"

export default function AppError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        console.error("App error:", error)
    }, [error])

    return (
        <ErrorPage
            icon={<AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            iconBgClass="bg-blue-100 dark:bg-blue-900/20"
            title="App Error"
            description="Something went wrong in the application. Please try again."
            errorMessage={"Error: " + (error.message || "Unknown error occurred")}
            errorDigest={error.digest}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800"
            actions={[
                {
                    label: "Try again",
                    onClick: reset,
                    icon: <RefreshCw className="mr-2 h-4 w-4" />,
                },
                {
                    label: "Back to dashboard",
                    onClick: () => router.push("/dashboard"),
                    icon: <ArrowLeft className="mr-2 h-4 w-4" />,
                    variant: "outline",
                },
            ]}
        />
    )
}
