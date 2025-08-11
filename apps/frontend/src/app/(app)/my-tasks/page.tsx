"use client"

import { MyTasks } from "@/features/tasks"
import { useUser } from "@/features/layout"
import { useRouter } from "next/navigation"

export default function MyTasksPage() {
  const { user } = useUser()
  const router = useRouter()

  const handleTaskClick = (task: any) => {
    router.push(`/my-tasks/${task.id}`)
  }

  if (!user) {
    return null
  }

  return (
    <MyTasks
      onTaskClick={handleTaskClick}
    />
  )
}
