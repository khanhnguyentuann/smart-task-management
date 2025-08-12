"use client"

import dynamic from "next/dynamic"
import { useUser } from "@/features/layout"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/shared/components/auth"

// Lazy load MyTasks component
const MyTasks = dynamic(() => import("@/features/tasks/components/MyTasks").then(mod => ({ default: mod.MyTasks })), {
  ssr: false
})

export default function MyTasksPage() {
  const { user } = useUser()
  const router = useRouter()

  const handleTaskClick = (task: any) => {
    router.push(`/my-tasks/${task.id}`)
  }

  return (
    <ProtectedRoute>
      <MyTasks onTaskClick={handleTaskClick} />
    </ProtectedRoute>
  )
}
