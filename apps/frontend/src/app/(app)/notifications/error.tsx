"use client"

import { useEffect } from "react"
import { RefreshCw, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { ErrorPage } from "@/shared/components/error"

export default function NotificationsError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        console.error("Notifications error:", error)
    }, [error])

    return (
        <ErrorPage
            icon={<Bell className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />}
            iconBgClass="bg-yellow-100 dark:bg-yellow-900/20"
            title="Notifications Error"
            description="Unable to load notifications. Please try again."
            errorMessage={error.message || "Failed to load notifications"}
            actions={[
                {
                    label: "Reload notifications",
                    onClick: reset,
                    icon: <RefreshCw className="mr-2 h-4 w-4" />,
                },
                {
                    label: "Back to dashboard",
                    onClick: () => router.push("/dashboard"),
                    variant: "outline",
                },
            ]}
        />
    )
}
