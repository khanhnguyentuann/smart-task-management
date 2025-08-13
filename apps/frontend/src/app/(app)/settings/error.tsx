"use client"

import { useEffect } from "react"
import { RefreshCw, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { ErrorPage } from "@/shared/components/error"

export default function SettingsError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        console.error("Settings error:", error)
    }, [error])

    return (
        <ErrorPage
            icon={<Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />}
            iconBgClass="bg-gray-100 dark:bg-gray-900/20"
            title="Settings Error"
            description="Unable to load settings. Please try again."
            errorMessage={error.message || "Failed to load settings"}
            actions={[
                {
                    label: "Reload settings",
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
