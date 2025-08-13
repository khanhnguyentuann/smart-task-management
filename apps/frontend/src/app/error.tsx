"use client"

import { useEffect } from "react"
import { RefreshCw, AlertTriangle, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { ErrorPage } from "@/shared/components/error"

export default function RootError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        console.error("Root error:", error)
    }, [error])

    return (
        <ErrorPage
            icon={<AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />}
            iconBgClass="bg-red-100 dark:bg-red-900/20"
            title="Something went wrong!"
            description="We encountered an unexpected error. Please try again."
            errorMessage={"Error: " + (error.message || "Unknown error occurred")}
            errorDigest={error.digest}
            className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800"
            actions={[
                {
                    label: "Try again",
                    onClick: reset,
                    icon: <RefreshCw className="mr-2 h-4 w-4" />,
                },
                {
                    label: "Go to home",
                    onClick: () => router.push("/"),
                    icon: <Home className="mr-2 h-4 w-4" />,
                    variant: "outline",
                },
            ]}
        />
    )
}
