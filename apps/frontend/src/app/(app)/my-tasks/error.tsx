"use client"

import { useEffect } from "react"
import { RefreshCw, CheckSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { ErrorPage } from "@/shared/components/error"

export default function MyTasksError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        console.error("My tasks error:", error)
    }, [error])

    return (
        <ErrorPage
            icon={<CheckSquare className="h-6 w-6 text-green-600 dark:text-green-400" />}
            iconBgClass="bg-green-100 dark:bg-green-900/20"
            title="My Tasks Error"
            description="Unable to load your tasks. Please try again."
            errorMessage={error.message || "Failed to load tasks"}
            actions={[
                {
                    label: "Reload tasks",
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
