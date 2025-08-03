"use client"

import { useRouter } from "next/navigation"
import { EmptyState } from "@/components/common/EmptyState"
import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { BarChart3 } from "lucide-react"
import { ROUTES } from "@/constants/routes"

export default function ReportsPage() {
    const router = useRouter()

    const handleGoToProjects = () => {
        router.push(ROUTES.PROJECTS)
    }

    return (
        <ProtectedLayout>
            <EmptyState
                icon={BarChart3}
                title="Reports Coming Soon"
                description="Analytics and reporting features are currently under development. You can manage your projects for now."
                action={{
                    label: "Go to Projects",
                    onClick: handleGoToProjects
                }}
            />
        </ProtectedLayout>
    )
} 