"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { ArrowLeft, Plus, Users, Settings, CheckSquare, Clock, AlertTriangle, Sparkles } from "lucide-react"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { CreateTaskModal } from "@/shared/components/modals/CreateTaskModal"
import { AnimatedTaskCard } from "@/shared/components/ui/animated-task-card"

interface User {
  name: string
  email: string
  role: "Admin" | "Member"
  avatar: string
}

interface Task {
  id: string
  title: string
  aiSummary: string
  priority: "Low" | "Medium" | "High"
  assignee: {
    name: string
    avatar: string
  }
  deadline: string
  status: "todo" | "inProgress" | "done"
  project: string
}

interface ProjectDetailProps {
  projectId: string | null
  user: User
  onBack: () => void
}

export function ProjectDetail({ projectId, user, onBack }: ProjectDetailProps) {
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [project] = useState({
    id: projectId,
    name: "Website Redesign",
    description: "Complete overhaul of company website with modern design and improved user experience",
    members: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", role: "Admin" },
      { name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32", role: "Member" },
      { name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", role: "Member" },
    ],
  })

  const [tasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design new homepage layout",
      aiSummary:
        "Create modern, responsive homepage with hero section, feature highlights, and improved navigation structure",
      priority: "High",
      assignee: { name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32" },
      deadline: "2024-02-15",
      status: "inProgress",
      project: "Website Redesign",
    },
    {
      id: "2",
      title: "Implement user authentication",
      aiSummary: "Develop secure login/signup system with password reset functionality and social media integration",
      priority: "Medium",
      assignee: { name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32" },
      deadline: "2024-02-20",
      status: "todo",
      project: "Website Redesign",
    },
    {
      id: "3",
      title: "Optimize page loading speed",
      aiSummary: "Improve website performance through image optimization, code splitting, and caching strategies",
      priority: "Low",
      assignee: { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
      deadline: "2024-02-10",
      status: "done",
      project: "Website Redesign",
    },
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDeadlineStatus = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { color: "text-red-600", label: "Overdue" }
    if (diffDays === 0) return { color: "text-yellow-600", label: "Due today" }
    if (diffDays <= 3) return { color: "text-yellow-600", label: `Due in ${diffDays} days` }
    return { color: "text-muted-foreground", label: `Due in ${diffDays} days` }
  }

  const TaskCard = ({ task }: { task: Task }) => {
    const deadlineStatus = getDeadlineStatus(task.deadline)

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium">{task.title}</h4>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
              <Badge variant="outline" className="text-xs">
                {task.priority}
              </Badge>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md">
            <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-200">{task.aiSummary}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                <AvatarFallback className="text-xs">
                  {task.assignee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{task.assignee.name}</span>
            </div>
            <div className={`text-xs ${deadlineStatus.color}`}>{deadlineStatus.label}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const tasksByStatus = {
    todo: tasks.filter((task) => task.status === "todo"),
    inProgress: tasks.filter((task) => task.status === "inProgress"),
    done: tasks.filter((task) => task.status === "done"),
  }

  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          <SidebarTrigger />
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{project.name}</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Project Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{project.name}</CardTitle>
                  <p className="text-muted-foreground mt-2">{project.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 3).map((member, index) => (
                      <Avatar key={index} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.members.length > 3 && (
                      <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>
                  <Button onClick={() => setShowCreateTask(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="tasks" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Members
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-4">
              {/* Task Board */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* To Do Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      To Do ({tasksByStatus.todo.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {tasksByStatus.todo.map((task) => (
                      <AnimatedTaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>

                {/* In Progress Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-blue-500" />
                      In Progress ({tasksByStatus.inProgress.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {tasksByStatus.inProgress.map((task) => (
                      <AnimatedTaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>

                {/* Done Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-green-500" />
                      Done ({tasksByStatus.done.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {tasksByStatus.done.map((task) => (
                      <AnimatedTaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.members.map((member, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <Badge variant={member.role === "Admin" ? "default" : "secondary"}>{member.role}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Project settings will be available here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateTaskModal open={showCreateTask} onOpenChange={setShowCreateTask} projectId={projectId} user={user} />
    </div>
  )
} 