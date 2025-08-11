"use client"

import { Notifications } from "@/features/notifications"
import { useUser } from "@/features/layout"

export default function NotificationsPage() {
  const { user } = useUser()

  if (!user) {
    return null
  }

  return <Notifications user={user} />
}
