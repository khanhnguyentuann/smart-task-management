"use client"

import { useState, useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/shared/components/ui/sidebar"
import { AppSidebar } from "@/features/layout"
import { EnhancedDashboardContent } from "@/features/dashboard"
import { ProjectsList, ProjectDetail } from "@/features/projects"
import { MyTasks } from "@/features/tasks"
import { Profile } from "@/features/user"
import { userService } from "@/features/user"
import { Settings } from "@/features/settings"
import { Notifications } from "@/features/notifications"
import { HelpSupport } from "@/features/help"
import { useToast } from "@/shared/hooks/useToast"
import { AnimatedBackground } from "@/shared/components/ui/animated-background"
import { TaskBot } from "@/shared/components/ui/task-bot"
import { WelcomeScreen } from "@/features/welcome"
import { AuthModal, useLogout } from "@/features/auth"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lastProfileFetchedAt, setLastProfileFetchedAt] = useState<number | null>(null)
  const { toast } = useToast()
  const { logout } = useLogout()

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("smart-task-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setShowWelcome(false)
      // Background hydrate profile
      userService.getProfile().then((profile) => {
        setUser(profile)
        localStorage.setItem("smart-task-user", JSON.stringify(profile))
        setLastProfileFetchedAt(Date.now())
      }).catch(() => { })
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData)
    localStorage.setItem("smart-task-user", JSON.stringify(userData))
    setShowWelcome(false)
    setShowAuthModal(false)
    // Hydrate with full profile in background
    userService.getProfile().then((profile) => {
      setUser(profile)
      localStorage.setItem("smart-task-user", JSON.stringify(profile))
      setLastProfileFetchedAt(Date.now())
    }).catch(() => { })
  }

  const handleLogout = async () => {
    const userName = user?.firstName || "User"
    try {
      await logout()
    } finally {
      setUser(null)
      localStorage.removeItem("smart-task-user")
      setShowWelcome(true)
      setCurrentPage("dashboard")
      setSelectedProject(null)
      toast({
        title: "👋 See you soon!",
        description: `Successfully logged out. Come back anytime, ${userName}!`,
        variant: "default",
      })
    }
  }

  const handleGetStarted = () => {
    setShowAuthModal(true)
  }

  const renderContent = () => {
    console.log("Current page:", currentPage)
    console.log("User data:", user)

    switch (currentPage) {
      case "dashboard":
        return <EnhancedDashboardContent user={user} onNavigate={setCurrentPage} />
      case "projects":
        return (
          <ProjectsList
            user={user}
            onProjectSelect={(id) => {
              setSelectedProject(id)
              setCurrentPage("project-detail")
            }}
          />
        )
      case "project-detail":
        return <ProjectDetail projectId={selectedProject} user={user} onBack={() => setCurrentPage("projects")} />
      case "my-tasks":
        return <MyTasks user={user} />
      case "profile":
        return <Profile />
      case "settings":
        return <Settings user={user} />
      case "notifications":
        return <Notifications user={user} />
      case "help-support":
        return <HelpSupport user={user} />
      default:
        return <EnhancedDashboardContent user={user} onNavigate={setCurrentPage} />
    }
  }

  // Refetch profile when app gains focus if older than 5 minutes
  useEffect(() => {
    const onFocus = () => {
      const fiveMinutes = 5 * 60 * 1000
      if (!lastProfileFetchedAt || Date.now() - lastProfileFetchedAt > fiveMinutes) {
        userService.getProfile().then((profile) => {
          setUser(profile)
          localStorage.setItem("smart-task-user", JSON.stringify(profile))
          setLastProfileFetchedAt(Date.now())
        }).catch(() => { })
      }
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [lastProfileFetchedAt])

  const getMascotMessage = () => {
    if (currentPage === "dashboard") {
      const hour = new Date().getHours()
      if (hour < 12) return `Good morning, ${user?.firstName}! Ready to conquer today? 🌅`
      if (hour < 17) return `Good afternoon, ${user?.firstName}! Keep up the great work! ☀️`
      return `Good evening, ${user?.firstName}! Time to wrap up? 🌙`
    }
    return undefined
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 1, repeat: Number.POSITIVE_INFINITY },
          }}
          className="text-6xl"
        >
          ✨
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <WelcomeScreen onGetStarted={handleGetStarted} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatedBackground />
            <SidebarProvider>
              <AppSidebar user={user} currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />
              <SidebarInset>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </SidebarInset>
            </SidebarProvider>
            <TaskBot
              mood={currentPage === "dashboard" ? "happy" : "working"}
              currentPage={currentPage}
              user={user}
              onCreateTask={() => {
                if (currentPage !== "projects") {
                  setCurrentPage("projects")
                }
              }}
              onNavigate={setCurrentPage}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} onLogin={handleLogin} />
    </>
  )
}
