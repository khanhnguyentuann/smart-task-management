"use client"

import { Notifications } from "@/features/notifications"
import { useUser } from "@/features/layout"
import { ProtectedRoute } from "@/shared/components/auth"

export default function NotificationsPage() {
  const { user } = useUser()

  return (
    <ProtectedRoute>
      <Notifications user={user!} />
    </ProtectedRoute>
  )
}
