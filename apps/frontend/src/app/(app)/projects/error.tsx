"use client"

import { useEffect } from "react"
import { RefreshCw, FolderOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { ErrorPage } from "@/shared/components/error"

export default function ProjectsError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        console.error("Projects error:", error)
    }, [error])

    return (
        <ErrorPage
            icon={<FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            iconBgClass="bg-blue-100 dark:bg-blue-900/20"
            title="Projects Error"
            description="Unable to load projects. Please try again."
            errorMessage={error.message || "Failed to load projects"}
            actions={[
                {
                    label: "Reload projects",
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
