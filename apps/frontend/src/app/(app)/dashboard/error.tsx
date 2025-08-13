"use client"

import { useEffect } from "react"
import { RefreshCw, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ErrorPage } from "@/shared/components/error"

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
        console.error("Dashboard error:", error)
    }, [error])

    return (
        <ErrorPage
            icon={<BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
            iconBgClass="bg-orange-100 dark:bg-orange-900/20"
            title="Dashboard Error"
            description="Unable to load dashboard data. Please try again."
            errorMessage={error.message || "Failed to load dashboard"}
            actions={[
                {
                    label: "Reload dashboard",
                    onClick: reset,
                    icon: <RefreshCw className="mr-2 h-4 w-4" />,
                },
                {
                    label: "Go to projects",
                    onClick: () => router.push("/projects"),
                    variant: "outline",
                },
            ]}
        />
    )
}
