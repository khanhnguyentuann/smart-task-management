"use client"

import { ProjectsList } from "@/features/projects"
import { useUser } from "@/features/layout"
import { useRouter } from "next/navigation"

export default function ProjectsPage() {
  const { user } = useUser()
  const router = useRouter()

  const handleProjectSelect = (id: string) => {
    router.push(`/projects/${id}`)
  }

  if (!user) {
    return null
  }

  return (
    <ProjectsList
      user={user}
      onProjectSelect={handleProjectSelect}
    />
  )
}
