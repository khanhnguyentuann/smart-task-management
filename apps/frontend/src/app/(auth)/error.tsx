"use client"

import { useEffect } from "react"
import { RefreshCw, AlertTriangle, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { ErrorPage } from "@/shared/components/error"

export default function AuthError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        console.error("Auth error:", error)
    }, [error])

    return (
        <ErrorPage
            icon={<AlertTriangle className="h-6 w-6 text-green-600 dark:text-green-400" />}
            iconBgClass="bg-green-100 dark:bg-green-900/20"
            title="Authentication Error"
            description="Something went wrong during authentication. Please try again."
            errorMessage={"Error: " + (error.message || "Unknown error occurred")}
            errorDigest={error.digest}
            className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
            actions={[
                {
                    label: "Try again",
                    onClick: reset,
                    icon: <RefreshCw className="mr-2 h-4 w-4" />,
                },
                {
                    label: "Back to home",
                    onClick: () => router.push("/"),
                    icon: <Home className="mr-2 h-4 w-4" />,
                    variant: "outline",
                },
            ]}
        />
    )
}
