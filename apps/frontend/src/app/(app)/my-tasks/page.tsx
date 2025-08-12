"use client"

import dynamic from "next/dynamic"
import { useUser } from "@/features/layout"
import { useRouter } from "next/navigation"

// Lazy load MyTasks component
const MyTasks = dynamic(() => import("@/features/tasks/components/MyTasks").then(mod => ({ default: mod.MyTasks })), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-6xl animate-spin">✨</div>
    </div>
  ),
  ssr: false
})

export default function MyTasksPage() {
  const { user } = useUser()
  const router = useRouter()

  const handleTaskClick = (task: any) => {
    router.push(`/my-tasks/${task.id}`)
  }

  if (!user) {
    return null
  }

  return <MyTasks onTaskClick={handleTaskClick} />
}
