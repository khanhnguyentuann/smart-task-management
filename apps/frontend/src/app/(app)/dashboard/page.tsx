"use client"

import dynamic from "next/dynamic"
import { useUser } from "@/features/layout"
import { useRouter } from "next/navigation"

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

  if (!user) {
    return null
  }

  return <Dashboard user={user} onNavigate={handleNavigate} />
}
