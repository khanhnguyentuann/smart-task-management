"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent } from "@/shared/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/components/ui/drawer"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Calendar } from "@/shared/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Separator } from "@/shared/components/ui/separator"
import { Progress } from "@/shared/components/ui/progress"
import { useMobile } from "@/shared/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { X, Edit3, Save, Trash2, Archive, Share2, CalendarIcon, Clock, User, Tag, Paperclip, MessageCircle, Activity, Plus, Check, AlertCircle, Star, Flag, Users, Upload, Download, Eye, Send, AtSign, MoreHorizontal, CheckSquare, Square } from 'lucide-react'
import { GlassmorphismCard } from "@/shared/components/ui/glassmorphism-card"
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"
import { TaskDetail } from "../types/task.types"

interface TaskDetailModalProps {
  task: any | null // Accept the existing task format
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (task: any) => void
  onDelete?: (taskId: string) => void
  teamMembers?: Array<{
    id: string
    name: string
    avatar: string
    email: string
  }>
  currentUser?: {
    id: string
    name: string
    avatar: string
  }
}

export function TaskDetailModal({
  task,
  open,
  onOpenChange,
  onSave,
  onDelete,
  teamMembers = [],
  currentUser = { id: "1", name: "Current User", avatar: "/placeholder.svg" },
}: TaskDetailModalProps) {
  const isMobile = useMobile()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<any>(null)
  const [newComment, setNewComment] = useState("")
  const [newSubtask, setNewSubtask] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [activeTab, setActiveTab] = useState("details")
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!task) return null

  // Convert simple task to detailed task format
  const convertToDetailedTask = (simpleTask: any): TaskDetail => {
    return {
      id: simpleTask.id,
      title: simpleTask.title,
      description: simpleTask.aiSummary || simpleTask.description || "",
      status: simpleTask.status,
      priority: simpleTask.priority,
      assignees: simpleTask.assignee ? [{
        id: "1",
        name: simpleTask.assignee.name,
        avatar: simpleTask.assignee.avatar,
        email: `${simpleTask.assignee.name.toLowerCase().replace(" ", ".")}@company.com`
      }] : [],
      dueDate: simpleTask.deadline ? new Date(simpleTask.deadline) : null,
      labels: [
        { id: "1", name: "Frontend", color: "bg-blue-500" },
        { id: "2", name: "High Priority", color: "bg-red-500" }
      ],
      subtasks: [
        { id: "1", title: "Research design patterns", completed: true },
        { id: "2", title: "Create wireframes", completed: false },
        { id: "3", title: "Implement responsive layout", completed: false }
      ],
      attachments: [
        {
          id: "1",
          name: "design-mockup.figma",
          size: "2.4 MB",
          type: "application/figma",
          url: "#",
          uploadedBy: "Sarah Wilson",
          uploadedAt: new Date(Date.now() - 86400000)
        }
      ],
      comments: [
        {
          id: "1",
          content: "Great progress on this task! The design looks amazing.",
          author: {
            id: "2",
            name: "Mike Johnson",
            avatar: "/placeholder.svg?height=32&width=32"
          },
          createdAt: new Date(Date.now() - 3600000),
          mentions: []
        }
      ],
      activities: [
        {
          id: "1",
          type: "status_change",
          description: "moved this task from To Do to In Progress",
          user: {
            id: "1",
            name: currentUser.name,
            avatar: currentUser.avatar
          },
          timestamp: new Date(Date.now() - 7200000)
        },
        {
          id: "2",
          type: "comment",
          description: "added a comment",
          user: {
            id: "2",
            name: "Mike Johnson",
            avatar: "/placeholder.svg?height=32&width=32"
          },
          timestamp: new Date(Date.now() - 3600000)
        }
      ],
      createdAt: new Date(Date.now() - 604800000),
      updatedAt: new Date(Date.now() - 3600000)
    }
  }

  const detailedTask = convertToDetailedTask(task)
  const currentTask = editedTask || detailedTask

  const handleEdit = () => {
    setEditedTask({ ...detailedTask })
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editedTask && onSave) {
      onSave(editedTask)
      setIsEditing(false)
      setEditedTask(null)
    }
  }

  const handleCancel = () => {
    setEditedTask(null)
    setIsEditing(false)
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment = {
      id: Date.now().toString(),
      content: newComment,
      author: currentUser,
      createdAt: new Date(),
      mentions: [],
    }

    // Update the task data without causing re-render issues
    if (isEditing && editedTask) {
      setEditedTask({
        ...editedTask,
        comments: [...(editedTask.comments || []), comment],
      })
    } else {
      // For non-editing mode, we'll simulate adding the comment
      detailedTask.comments = [...(detailedTask.comments || []), comment]
    }
    
    setNewComment("")
  }

  const handleAddSubtask = () => {
    if (!newSubtask.trim() || !editedTask) return

    const subtask = {
      id: Date.now().toString(),
      title: newSubtask,
      completed: false,
    }

    setEditedTask({
      ...editedTask,
      subtasks: [...editedTask.subtasks, subtask],
    })
    setNewSubtask("")
  }

  const handleToggleSubtask = (subtaskId: string) => {
    if (!editedTask) return

    setEditedTask({
      ...editedTask,
      subtasks: editedTask.subtasks.map((st: any) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      ),
    })
  }

  const handleAddLabel = () => {
    if (!newLabel.trim() || !editedTask) return

    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-yellow-500", "bg-pink-500"]
    const label = {
      id: Date.now().toString(),
      name: newLabel,
      color: colors[Math.floor(Math.random() * colors.length)],
    }

    setEditedTask({
      ...editedTask,
      labels: [...editedTask.labels, label],
    })
    setNewLabel("")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500 text-white"
      case "Medium":
        return "bg-yellow-500 text-white"
      case "Low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
      case "inProgress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
      case "done":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const completedSubtasks = currentTask.subtasks?.filter((st: any) => st.completed).length || 0
  const totalSubtasks = currentTask.subtasks?.length || 0
  const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

  const TaskContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {isEditing ? (
              <Input
                value={editedTask?.title || ""}
                onChange={(e) =>
                  setEditedTask(editedTask ? { ...editedTask, title: e.target.value } : null)
                }
                className="text-2xl font-bold border-0 bg-transparent p-0 focus-visible:ring-0"
                placeholder="Task title..."
              />
            ) : (
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {currentTask.title}
              </h1>
            )}
            
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getPriorityColor(currentTask.priority)}>
                <Flag className="h-3 w-3 mr-1" />
                {currentTask.priority}
              </Badge>
              
              {isEditing ? (
                <Select
                  value={editedTask?.status}
                  onValueChange={(value) =>
                    setEditedTask(editedTask ? { ...editedTask, status: value as any } : null)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={getStatusColor(currentTask.status)}>
                  {currentTask.status === "todo" && <Square className="h-3 w-3 mr-1" />}
                  {currentTask.status === "inProgress" && <Clock className="h-3 w-3 mr-1" />}
                  {currentTask.status === "done" && <CheckSquare className="h-3 w-3 mr-1" />}
                  {currentTask.status.replace(/([A-Z])/g, " $1").trim()}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <EnhancedButton onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </EnhancedButton>
                <EnhancedButton onClick={handleCancel} variant="outline" size="sm">
                  Cancel
                </EnhancedButton>
              </>
            ) : (
              <>
                <EnhancedButton onClick={handleEdit} variant="outline" size="sm">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </EnhancedButton>
                <EnhancedButton variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </EnhancedButton>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar for Subtasks */}
        {totalSubtasks > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completedSubtasks}/{totalSubtasks} completed</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="attachments">Files</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 mt-6">
          {/* Description */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Description
            </Label>
            {isEditing ? (
              <Textarea
                value={editedTask?.description || ""}
                onChange={(e) =>
                  setEditedTask(editedTask ? { ...editedTask, description: e.target.value } : null)
                }
                placeholder="Add a description..."
                rows={4}
                className="resize-none"
              />
            ) : (
              <div className="p-3 bg-muted/30 rounded-lg min-h-[100px]">
                {currentTask.description ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{currentTask.description}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No description provided</p>
                )}
              </div>
            )}
          </div>

          {/* Assignees */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Assignees
            </Label>
            <div className="flex items-center gap-2 flex-wrap">
              {currentTask.assignees?.map((assignee: any) => (
                <motion.div
                  key={assignee.id}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                    <AvatarFallback className="text-xs">
                      {assignee.name.split(" ").map((n: string) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{assignee.name}</span>
                </motion.div>
              ))}
              {isEditing && (
                <Button variant="outline" size="sm" className="rounded-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Due Date
            </Label>
            {isEditing ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedTask?.dueDate ? format(editedTask.dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editedTask?.dueDate || undefined}
                    onSelect={(date) =>
                      setEditedTask(editedTask ? { ...editedTask, dueDate: date || null } : null)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex items-center gap-2">
                {currentTask.dueDate ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {format(currentTask.dueDate, "PPP")}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">No due date set</span>
                )}
              </div>
            )}
          </div>

          {/* Labels */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Labels
            </Label>
            <div className="flex items-center gap-2 flex-wrap">
              {currentTask.labels?.map((label: any) => (
                <Badge key={label.id} className={`${label.color} text-white`}>
                  {label.name}
                </Badge>
              ))}
              {isEditing && (
                <div className="flex items-center gap-2">
                  <Input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Add label..."
                    className="w-24 h-6 text-xs"
                    onKeyPress={(e) => e.key === "Enter" && handleAddLabel()}
                  />
                  <Button onClick={handleAddLabel} size="sm" variant="outline" className="h-6 px-2">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Subtasks */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Subtasks ({completedSubtasks}/{totalSubtasks})
            </Label>
            <div className="space-y-2">
              {currentTask.subtasks?.map((subtask: any) => (
                <motion.div
                  key={subtask.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => handleToggleSubtask(subtask.id)}
                  >
                    {subtask.completed ? (
                      <CheckSquare className="h-4 w-4 text-green-600" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </Button>
                  <span className={`text-sm ${subtask.completed ? "line-through text-muted-foreground" : ""}`}>
                    {subtask.title}
                  </span>
                </motion.div>
              ))}
              {isEditing && (
                <div className="flex items-center gap-2">
                  <Input
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add subtask..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
                  />
                  <Button onClick={handleAddSubtask} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4 mt-6">
          {/* Add Comment */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                <AvatarFallback>
                  {currentUser.name?.split(" ").map((n) => n[0]).join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  key="comment-input" // Add stable key
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment... Use @ to mention someone"
                  rows={3}
                  className="resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault()
                      handleAddComment()
                    }
                  }}
                />
                <div className="flex justify-end">
                  <EnhancedButton onClick={handleAddComment} size="sm" disabled={!newComment.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Comment
                  </EnhancedButton>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Comments List */}
          <div className="space-y-4">
            {currentTask.comments?.map((comment: any) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                  <AvatarFallback>
                    {comment.author.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(comment.createdAt, "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attachments" className="space-y-4 mt-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
            />
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop files here, or click to browse
            </p>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
              Choose Files
            </Button>
          </div>

          {/* Attachments List */}
          <div className="space-y-2">
            {currentTask.attachments?.map((attachment: any) => (
              <motion.div
                key={attachment.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                  <Paperclip className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {attachment.size} • Uploaded by {attachment.uploadedBy} • {format(attachment.uploadedAt, "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4 mt-6">
          <div className="space-y-4">
            {currentTask.activities?.map((activity: any) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                  <AvatarFallback className="text-xs">
                    {activity.user.name.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span>{" "}
                    <span className="text-muted-foreground">{activity.description}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(activity.timestamp, "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <Separator />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete?.(currentTask.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          Created {format(currentTask.createdAt, "MMM d, yyyy")} • 
          Updated {format(currentTask.updatedAt, "MMM d, yyyy")}
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[95vh] flex flex-col">
          <DrawerHeader className="border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <DrawerTitle>Task Details</DrawerTitle>
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                <TaskContent />
              </div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold">Task Details</h2>
          {/* Only one close button here */}
        </div>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              <TaskContent />
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
} 