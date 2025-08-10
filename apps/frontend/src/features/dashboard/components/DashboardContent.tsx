"use client"

import { useState } from "react"
import { CardHeader, CardTitle, CardContent, Card } from "@/shared/components/ui/card/Card"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { FolderKanban, CheckSquare, Clock, AlertTriangle, Plus, Activity } from "lucide-react"
import { Button } from "@/shared/components/ui/button/Button"
import { motion } from "framer-motion"
import { DashboardContentProps, DashboardStats, RecentActivity } from "../types/dashboard.types"

export function DashboardContent({ user, onNavigate }: DashboardContentProps) {
  const [stats] = useState<DashboardStats>({
    totalProjects: 12,
    activeTasks: 28,
    completedTasks: 156,
    overdueTasks: 3,
  })

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: 1,
      type: "task_completed",
      user: "Sarah Wilson",
      action: "completed task",
      target: "Update user authentication",
      time: "2 minutes ago",
      avatar: "/default-avatar.svg",
    },
    {
      id: 2,
      type: "project_created",
      user: "Mike Johnson",
      action: "created project",
      target: "Mobile App Redesign",
      time: "1 hour ago",
      avatar: "/default-avatar.svg",
    },
    {
      id: 3,
      type: "task_assigned",
      user: "Emily Chen",
      action: "assigned task",
      target: "Database optimization",
      time: "3 hours ago",
      avatar: "/default-avatar.svg",
    },
  ])

  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: FolderKanban,
      color: "text-blue-600",
      change: "+2 from last month",
    },
    {
      title: "Active Tasks",
      value: stats.activeTasks,
      icon: CheckSquare,
      color: "text-green-600",
      change: "+5 from yesterday",
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
      icon: Clock,
      color: "text-purple-600",
      change: "+12 this week",
    },
    {
      title: "Overdue Tasks",
      value: stats.overdueTasks,
      icon: AlertTriangle,
      color: "text-red-600",
      change: "-1 from yesterday",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar && user.avatar.startsWith('data:image') ? user.avatar : (user?.avatar || '/default-avatar.svg')} alt={user?.name || 'User'} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{user?.name || "User"}</p>
              <p className="text-muted-foreground">{user?.role || "Member"}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onNavigate("projects")}
                >
                  <FolderKanban className="mr-2 h-4 w-4" />
                  Create New Project
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onNavigate("tasks")}
                >
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Create New Task
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.avatar} alt={activity.user} />
                        <AvatarFallback>{activity.user?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{" "}
                          {activity.action} <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 