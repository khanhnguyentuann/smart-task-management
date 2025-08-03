"use client"

import { useRouter } from "next/navigation"
import { EmptyState } from "@/components/common/EmptyState"
import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { CheckSquare } from "lucide-react"
import { ROUTES } from "@/constants/routes"

export default function TasksPage() {
    const router = useRouter()

    const handleGoToProjects = () => {
        router.push(ROUTES.PROJECTS)
    }

    return (
        <ProtectedLayout>
            <EmptyState
                icon={CheckSquare}
                title="Tasks Coming Soon"
                description="The tasks management feature is currently under development. You can manage your projects for now."
                action={{
                    label: "Go to Projects",
                    onClick: handleGoToProjects
                }}
            />
        </ProtectedLayout>
    )
} 