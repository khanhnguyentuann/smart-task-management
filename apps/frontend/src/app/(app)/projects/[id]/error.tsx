"use client"

import { useEffect } from "react"
import { RefreshCw, FolderOpen, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { ErrorPage } from "@/shared/components/error"

export default function ProjectDetailError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        console.error("Project detail error:", error)
    }, [error])

    return (
        <ErrorPage
            icon={<FolderOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
            iconBgClass="bg-purple-100 dark:bg-purple-900/20"
            title="Project Error"
            description="Unable to load project details. Please try again."
            errorMessage={error.message || "Failed to load project"}
            actions={[
                {
                    label: "Reload project",
                    onClick: reset,
                    icon: <RefreshCw className="mr-2 h-4 w-4" />,
                },
                {
                    label: "Back to projects",
                    onClick: () => router.push("/projects"),
                    icon: <ArrowLeft className="mr-2 h-4 w-4" />,
                    variant: "outline",
                },
            ]}
        />
    )
}
