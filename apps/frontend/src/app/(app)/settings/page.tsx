"use client"

import { Settings } from "@/features/settings"
import { useUser } from "@/features/layout"
import { ProtectedRoute } from "@/shared/components/auth"

export default function SettingsPage() {
  const { user } = useUser()

  return (
    <ProtectedRoute>
      <Settings user={user!} />
    </ProtectedRoute>
  )
}
