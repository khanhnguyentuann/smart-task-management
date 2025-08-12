"use client"

import { useState } from "react"
import { CardContent, SidebarTrigger, Badge, Avatar, AvatarFallback, AvatarImage, Tabs, TabsContent, TabsList, TabsTrigger, GlassmorphismCard, EnhancedButton } from "@/shared/components/ui"
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
  UserPlus,
  Calendar,
  Star,
  Trash2,
  Settings,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  department?: string
}

interface NotificationsProps {
  user: User
}

export function Notifications({ user }: NotificationsProps) {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "task_assigned",
      title: "New task assigned to you",
      message: "Team Lead assigned you the task 'Update user authentication' in Website Redesign project",
      time: "2 minutes ago",
      read: false,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      icon: CheckCircle,
      color: "text-blue-600",
    },
    {
      id: "2",
      type: "project_update",
      title: "Project milestone reached",
      message: "Mobile App Redesign project has reached 75% completion",
      time: "1 hour ago",
      read: false,
      avatar: null,
      icon: Star,
      color: "text-yellow-600",
    },
    {
      id: "3",
      type: "team_invite",
      title: "New team member joined",
      message: "New team member has joined your team",
      time: "3 hours ago",
      read: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      icon: UserPlus,
      color: "text-green-600",
    },
    {
      id: "4",
      type: "deadline_reminder",
      title: "Task deadline approaching",
      message: "Database optimization task is due tomorrow",
      time: "5 hours ago",
      read: true,
      avatar: null,
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      id: "5",
      type: "comment",
      title: "New comment on your task",
      message: "Designer commented on 'Design new homepage layout'",
      time: "1 day ago",
      read: true,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      icon: MessageCircle,
      color: "text-purple-600",
    },
    {
      id: "6",
      type: "meeting_reminder",
      title: "Meeting reminder",
      message: "Team standup meeting starts in 30 minutes",
      time: "1 day ago",
      read: true,
      avatar: null,
      icon: Calendar,
      color: "text-blue-600",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length
  const todayNotifications = notifications.filter((n) => n.time.includes("minute") || n.time.includes("hour"))
  const earlierNotifications = notifications.filter((n) => n.time.includes("day") || n.time.includes("week"))

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "task_assigned":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
      case "project_update":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "team_invite":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
      case "deadline_reminder":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
      case "comment":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
      case "meeting_reminder":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const NotificationItem = ({ notification, index }: { notification: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative ${!notification.read ? "bg-blue-50/50 dark:bg-blue-950/10" : ""}`}
    >
      <GlassmorphismCard className="hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              {notification.avatar ? (
                <Avatar className="h-10 w-10">
                  <AvatarImage src={notification.avatar && notification.avatar.startsWith('data:image') ? notification.avatar : (notification.avatar || '/default-avatar.svg')} alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              ) : (
                <div
                  className={`p-2 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700`}
                >
                  <notification.icon className={`h-6 w-6 ${notification.color}`} />
                </div>
              )}
              {!notification.read && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className={`font-medium ${!notification.read ? "text-blue-600 dark:text-blue-400" : ""}`}>
                    {notification.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{notification.message}</p>
                </div>
                <Badge className={getTypeColor(notification.type)} variant="outline">
                  {notification.type.replace("_", " ")}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{notification.time}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.read && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => markAsRead(notification.id)}
                      className="p-1 rounded-full hover:bg-muted/50 transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1 rounded-full hover:bg-muted/50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </GlassmorphismCard>
    </motion.div>
  )

  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Bell className="h-5 w-5 text-blue-600" />
            </motion.div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Notifications
            </h1>
            {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">All Notifications</h2>
              {unreadCount > 0 && <Badge variant="secondary">{unreadCount} unread</Badge>}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <EnhancedButton variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark all as read
                </EnhancedButton>
              )}
              <EnhancedButton variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </EnhancedButton>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {todayNotifications.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-muted-foreground">Today</h3>
                  <AnimatePresence>
                    {todayNotifications.map((notification, index) => (
                      <NotificationItem key={notification.id} notification={notification} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {earlierNotifications.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-muted-foreground">Earlier</h3>
                  <AnimatePresence>
                    {earlierNotifications.map((notification, index) => (
                      <NotificationItem key={notification.id} notification={notification} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>

            <TabsContent value="unread" className="space-y-4">
              <AnimatePresence>
                {notifications
                  .filter((n) => !n.read)
                  .map((notification, index) => (
                    <NotificationItem key={notification.id} notification={notification} index={index} />
                  ))}
              </AnimatePresence>
              {unreadCount === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">All caught up! No unread notifications.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <AnimatePresence>
                {notifications
                  .filter((n) => n.type.includes("task"))
                  .map((notification, index) => (
                    <NotificationItem key={notification.id} notification={notification} index={index} />
                  ))}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <AnimatePresence>
                {notifications
                  .filter((n) => n.type.includes("project"))
                  .map((notification, index) => (
                    <NotificationItem key={notification.id} notification={notification} index={index} />
                  ))}
              </AnimatePresence>
            </TabsContent>
          </Tabs>

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
