"use client"

import { useRouter } from "next/navigation"
import { EmptyState } from "@/components/common/EmptyState"
import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { FileQuestion } from "lucide-react"
import { ROUTES } from "@/constants/routes"

export default function NotFoundPage() {
    const router = useRouter()

    const handleGoHome = () => {
        router.push(ROUTES.DASHBOARD)
    }

    return (
        <ProtectedLayout>
            <EmptyState
                icon={FileQuestion}
                title="Page Not Found"
                description="The page you're looking for doesn't exist or hasn't been implemented yet."
                action={{
                    label: "Go to Dashboard",
                    onClick: handleGoHome
                }}
            />
        </ProtectedLayout>
    )
} 