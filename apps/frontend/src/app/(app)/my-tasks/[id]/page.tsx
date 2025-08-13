"use client"

import { TaskDetail } from "@/features/tasks"
import { useUser } from "@/features/layout"
import { useRouter, useSearchParams } from "next/navigation"
import { use, Suspense } from "react"
import { ProtectedRoute } from "@/shared/components/auth"

function TaskDetailPageContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleBack = () => {
    // Check if user came from a specific project
    const from = searchParams.get('from')
    const projectId = searchParams.get('projectId')
    
    if (from === 'project' && projectId) {
      router.push(`/projects/${projectId}`)
    } else {
      router.push("/my-tasks")
    }
  }

  const handleDelete = () => {
    // Same logic for delete
    const from = searchParams.get('from')
    const projectId = searchParams.get('projectId')
    
    if (from === 'project' && projectId) {
      router.push(`/projects/${projectId}`)
    } else {
      router.push("/my-tasks")
    }
  }

  return (
    <TaskDetail
      taskId={resolvedParams.id}
      onBack={handleBack}
      onDelete={handleDelete}
    />
  )
}

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <TaskDetailPageContent params={params} />
      </Suspense>
    </ProtectedRoute>
  )
}
