"use client"

import { useRouter } from "next/navigation"
import { EmptyState } from "@/components/common/EmptyState"
import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { Calendar } from "lucide-react"
import { ROUTES } from "@/constants/routes"

export default function CalendarPage() {
    const router = useRouter()

    const handleGoToProjects = () => {
        router.push(ROUTES.PROJECTS)
    }

    return (
        <ProtectedLayout>
            <EmptyState
                icon={Calendar}
                title="Calendar Coming Soon"
                description="Calendar and scheduling features are currently under development. You can manage your projects for now."
                action={{
                    label: "Go to Projects",
                    onClick: handleGoToProjects
                }}
            />
        </ProtectedLayout>
    )
}