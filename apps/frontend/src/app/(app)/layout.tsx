"use client"

import { SidebarProvider, SidebarInset } from "@/shared/components/ui/sidebar"
import { AppSidebar, UserProvider, useUser } from "@/features/layout"
import { AnimatedBackground } from "@/shared/components/ui/animated-background"
import { TaskBot } from "@/shared/components/ui/task-bot"
import { useLogout } from "@/features/auth"
import { useToast } from "@/shared/hooks/useToast"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, setUser, isLoading } = useUser()
  const { toast } = useToast()
  const { logout } = useLogout()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  const handleLogout = async () => {
    const userName = user?.firstName || "User"
    try {
      await logout()
    } finally {
      setUser(null)
      localStorage.removeItem("smart-task-user")
      router.push("/")
      toast({
        title: "👋 See you soon!",
        description: `Successfully logged out. Come back anytime, ${userName}!`,
        variant: "default",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-6xl animate-spin">✨</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <AnimatedBackground />
      <SidebarProvider>
        <AppSidebar
          user={user}
          onLogout={handleLogout}
        />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
      <TaskBot
        mood={pathname === "/dashboard" ? "happy" : "working"}
        currentPage={pathname}
        user={user}
        onCreateTask={() => {
          if (pathname !== "/projects") {
            router.push("/projects")
          }
        }}
        onNavigate={(page) => router.push(`/${page}`)}
      />
    </>
  )
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <AppLayoutContent>
        {children}
      </AppLayoutContent>
    </UserProvider>
  )
}
