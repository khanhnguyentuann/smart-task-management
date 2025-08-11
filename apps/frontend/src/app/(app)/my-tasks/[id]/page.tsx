"use client"

import { TaskDetail } from "@/features/tasks"
import { useUser } from "@/features/layout"
import { useRouter } from "next/navigation"
import { use } from "react"

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { user } = useUser()
  const router = useRouter()

  const handleBack = () => {
    router.push("/my-tasks")
  }

  const handleDelete = () => {
    router.push("/my-tasks")
  }

  if (!user) {
    return null
  }

  return (
    <TaskDetail
      taskId={resolvedParams.id}
      onBack={handleBack}
      onDelete={handleDelete}
    />
  )
}
