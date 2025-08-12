"use client"

import dynamic from "next/dynamic"
import { useUser } from "@/features/layout"
import { useRouter } from "next/navigation"

// Lazy load ProjectsList component
const ProjectsList = dynamic(() => import("@/features/projects").then(mod => ({ default: mod.ProjectsList })), {
  ssr: false
})

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
