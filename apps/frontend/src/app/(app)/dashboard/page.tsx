"use client"

import dynamic from "next/dynamic"
import { useUser } from "@/features/layout"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/shared/components/auth"

// Lazy load Dashboard component
const Dashboard = dynamic(() => import("@/features/dashboard").then(mod => ({ default: mod.Dashboard })), {
  ssr: false
})

export default function DashboardPage() {
  const { user } = useUser()
  const router = useRouter()

  const handleNavigate = (page: string) => {
    router.push(`/${page}`)
  }

  return (
    <ProtectedRoute>
      <Dashboard user={user!} onNavigate={handleNavigate} />
    </ProtectedRoute>
  )
}
