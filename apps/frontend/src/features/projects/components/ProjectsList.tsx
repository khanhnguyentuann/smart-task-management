"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Search, Plus, Users, CheckSquare, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { CreateProjectModal } from "@/features/projects/components/CreateProjectModal"

interface User {
  name: string
  email: string
  role: "Admin" | "Member"
  avatar: string
}

interface Project {
  id: string
  name: string
  description: string
  members: number
  tasks: {
    todo: number
    inProgress: number
    done: number
  }
  userRole: "Admin" | "Member"
  color: string
}

interface ProjectsListProps {
  user: User
  onProjectSelect: (id: string) => void
}

export function ProjectsList({ user, onProjectSelect }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Website Redesign",
      description: "Complete overhaul of company website with modern design",
      members: 5,
      tasks: { todo: 8, inProgress: 3, done: 12 },
      userRole: "Admin",
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "Mobile App Development",
      description: "Native iOS and Android app for customer engagement",
      members: 8,
      tasks: { todo: 15, inProgress: 7, done: 23 },
      userRole: "Member",
      color: "bg-green-500",
    },
    {
      id: "3",
      name: "Database Migration",
      description: "Migrate legacy database to cloud infrastructure",
      members: 3,
      tasks: { todo: 4, inProgress: 2, done: 8 },
      userRole: "Admin",
      color: "bg-purple-500",
    },
  ])

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Projects</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {user.role === "Admin" && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
            )}
          </div>

          {/* Projects Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${project.color}`} />
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge variant={project.userRole === "Admin" ? "default" : "secondary"} className="mt-1">
                          {project.userRole}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onProjectSelect(project.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        {project.userRole === "Admin" && (
                          <>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {project.members} members
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <CheckSquare className="h-4 w-4" />
                      {project.tasks.todo + project.tasks.inProgress + project.tasks.done} tasks
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>
                        {project.tasks.done}/{project.tasks.todo + project.tasks.inProgress + project.tasks.done}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${(project.tasks.done / (project.tasks.todo + project.tasks.inProgress + project.tasks.done)) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">To Do: {project.tasks.todo}</span>
                      <span className="text-blue-600">In Progress: {project.tasks.inProgress}</span>
                      <span className="text-green-600">Done: {project.tasks.done}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => onProjectSelect(project.id)}
                  >
                    View Project
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {searchQuery ? "No projects found matching your search." : "No projects yet."}
              </div>
              {user.role === "Admin" && !searchQuery && (
                <Button className="mt-4" onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <CreateProjectModal open={showCreateModal} onOpenChange={setShowCreateModal} user={user} />
    </div>
  )
} 