"use client"

import { EnhancedDashboardContent } from "@/features/dashboard"
import { useUser } from "@/features/layout"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user } = useUser()
  const router = useRouter()

  const handleNavigate = (page: string) => {
    router.push(`/${page}`)
  }

  if (!user) {
    return null
  }

  return <EnhancedDashboardContent user={user} onNavigate={handleNavigate} />
}
