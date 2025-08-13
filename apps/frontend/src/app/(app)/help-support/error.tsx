"use client"

import { useEffect } from "react"
import { RefreshCw, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { ErrorPage } from "@/shared/components/error"

export default function HelpSupportError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        console.error("Help support error:", error)
    }, [error])

    return (
        <ErrorPage
            icon={<HelpCircle className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />}
            iconBgClass="bg-cyan-100 dark:bg-cyan-900/20"
            title="Help & Support Error"
            description="Unable to load help content. Please try again."
            errorMessage={error.message || "Failed to load help content"}
            actions={[
                {
                    label: "Reload help",
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
