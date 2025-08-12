"use client"

import { ProjectDetail } from "@/features/projects"
import { useRouter } from "next/navigation"
import { use } from "react"
import { ProtectedRoute } from "@/shared/components/auth"

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()

  const handleBack = () => {
    router.push("/projects")
  }

  return (
    <ProtectedRoute>
      <ProjectDetail 
        projectId={resolvedParams.id} 
        onBack={handleBack} 
      />
    </ProtectedRoute>
  )
}
