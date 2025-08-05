"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
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

interface User {
  name: string
  email: string
  role: "Admin" | "Member"
  avatar: string
}

interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string | null
  user: User
}

export function CreateTaskModal({ open, onOpenChange, projectId, user }: CreateTaskModalProps) {
  const [loading, setLoading] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)
  const [aiSummary, setAiSummary] = useState("")
  const [deadline, setDeadline] = useState<Date>()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignee: user.name,
  })

  const teamMembers = [
    { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32" },
  ]

  const generateAISummary = async () => {
    if (!formData.title || !formData.description) return

    setGeneratingAI(true)

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const summaries = [
      `Implement ${formData.title.toLowerCase()} with focus on user experience and performance optimization`,
      `Develop ${formData.title.toLowerCase()} using modern best practices and responsive design principles`,
      `Create ${formData.title.toLowerCase()} with comprehensive testing and documentation`,
      `Build ${formData.title.toLowerCase()} ensuring scalability and maintainability`,
    ]

    setAiSummary(summaries[Math.floor(Math.random() * summaries.length)])
    setGeneratingAI(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setLoading(false)
    onOpenChange(false)
    setFormData({ title: "", description: "", priority: "Medium", assignee: user.name })
    setAiSummary("")
    setDeadline(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task Title</Label>
            <Input
              id="task-title"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              placeholder="Describe the task..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={formData.assignee} onValueChange={(value) => setFormData({ ...formData, assignee: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.name} value={member.name}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {member.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
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

          {formData.title && formData.description && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>AI Summary</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateAISummary}
                  disabled={generatingAI}
                >
                  {generatingAI ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
              {aiSummary && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md">
                  <p className="text-sm text-muted-foreground">{aiSummary}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.title.trim()}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 