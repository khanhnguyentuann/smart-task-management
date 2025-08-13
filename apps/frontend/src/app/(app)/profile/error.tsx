"use client"

import { useEffect } from "react"
import { RefreshCw, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { ErrorPage } from "@/shared/components/error"

export default function ProfileError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        console.error("Profile error:", error)
    }, [error])

    return (
        <ErrorPage
            icon={<User className="h-6 w-6 text-teal-600 dark:text-teal-400" />}
            iconBgClass="bg-teal-100 dark:bg-teal-900/20"
            title="Profile Error"
            description="Unable to load profile. Please try again."
            errorMessage={error.message || "Failed to load profile"}
            actions={[
                {
                    label: "Reload profile",
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
