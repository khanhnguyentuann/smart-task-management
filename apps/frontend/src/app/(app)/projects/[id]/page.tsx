"use client"

import { ProjectDetail } from "@/features/projects"
import { useUser } from "@/features/layout"
import { useRouter } from "next/navigation"
import { use } from "react"

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { user } = useUser()
  const router = useRouter()

  const handleBack = () => {
    router.push("/projects")
  }

  if (!user) {
    return null
  }

  return (
    <ProjectDetail 
      projectId={resolvedParams.id} 
      onBack={handleBack} 
    />
  )
}
