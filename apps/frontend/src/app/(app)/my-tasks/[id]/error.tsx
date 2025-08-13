"use client"

import { useEffect } from "react"
import { RefreshCw, CheckSquare, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { ErrorPage } from "@/shared/components/error"

export default function TaskDetailError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        console.error("Task detail error:", error)
    }, [error])

    return (
        <ErrorPage
            icon={<CheckSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
            iconBgClass="bg-indigo-100 dark:bg-indigo-900/20"
            title="Task Error"
            description="Unable to load task details. Please try again."
            errorMessage={error.message || "Failed to load task"}
            actions={[
                {
                    label: "Reload task",
                    onClick: reset,
                    icon: <RefreshCw className="mr-2 h-4 w-4" />,
                },
                {
                    label: "Back to tasks",
                    onClick: () => router.push("/my-tasks"),
                    icon: <ArrowLeft className="mr-2 h-4 w-4" />,
                    variant: "outline",
                },
            ]}
        />
    )
}
