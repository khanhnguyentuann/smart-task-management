"use client"

import { useRouter } from "next/navigation"
import { EmptyState } from "@/components/common/EmptyState"
import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { Users } from "lucide-react"
import { ROUTES } from "@/constants/routes"

export default function TeamPage() {
    const router = useRouter()

    const handleGoToProjects = () => {
        router.push(ROUTES.PROJECTS)
    }

    return (
        <ProtectedLayout>
            <EmptyState
                icon={Users}
                title="Team Management Coming Soon"
                description="Team collaboration features are currently under development. You can manage your projects for now."
                action={{
                    label: "Go to Projects",
                    onClick: handleGoToProjects
                }}
            />
        </ProtectedLayout>
    )
} 