"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Calendar } from "@/shared/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Loader2, Plus, Sparkles, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/shared/lib/utils"
import { PROJECTS_CONSTANTS } from "@/features/projects/constants"

interface User {
  name: string
  email: string
  role: typeof PROJECTS_CONSTANTS.ROLES[keyof typeof PROJECTS_CONSTANTS.ROLES]
  avatar: string
}

interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string | null
  user: User
}

export function CreateTaskModal({ open, onOpenChange, projectId, user }: CreateTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<typeof PROJECTS_CONSTANTS.PRIORITY[keyof typeof PROJECTS_CONSTANTS.PRIORITY]>(PROJECTS_CONSTANTS.PRIORITY.MEDIUM)
  const [assignee, setAssignee] = useState("")
  const [deadline, setDeadline] = useState<Date>()
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [aiSummary, setAiSummary] = useState("")

  const teamMembers = [
    { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "2", name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "3", name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32" },
  ]

  const generateAISummary = async () => {
    if (!title || !description) return

    setIsGeneratingSummary(true)
    // Simulate AI summary generation
    setTimeout(() => {
      const summary = `AI-generated summary for "${title}": ${description.substring(0, 100)}... This task involves ${priority.toLowerCase()} priority work with clear objectives and measurable outcomes.`
      setAiSummary(summary)
      setIsGeneratingSummary(false)
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle task creation logic here
    console.log("Creating task:", { title, description, priority, assignee, deadline, aiSummary })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Task
          </DialogTitle>
          <DialogDescription className="sr-only">Create a new task with title, description, priority, assignee, and deadline</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the task..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value: typeof PROJECTS_CONSTANTS.PRIORITY[keyof typeof PROJECTS_CONSTANTS.PRIORITY]) => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PROJECTS_CONSTANTS.PRIORITY.LOW}>Low</SelectItem>
                    <SelectItem value={PROJECTS_CONSTANTS.PRIORITY.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={PROJECTS_CONSTANTS.PRIORITY.HIGH}>High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assignee">Assignee</Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="text-xs">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {member.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Summary
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateAISummary}
                  disabled={!title || !description || isGeneratingSummary}
                >
                  {isGeneratingSummary ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Summary"
                  )}
                </Button>
              </Label>
              <Textarea
                value={aiSummary}
                onChange={(e) => setAiSummary(e.target.value)}
                placeholder="AI will generate a summary based on your task description..."
                rows={2}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 