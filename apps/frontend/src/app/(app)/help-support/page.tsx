"use client"

import { HelpSupport } from "@/features/help"
import { useUser } from "@/features/layout"
import { ProtectedRoute } from "@/shared/components/auth"

export default function HelpSupportPage() {
  const { user } = useUser()

  return (
    <ProtectedRoute>
      <HelpSupport user={user!} />
    </ProtectedRoute>
  )
}
