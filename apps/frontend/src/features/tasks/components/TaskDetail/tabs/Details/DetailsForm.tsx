"use client"

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Calendar } from "@/shared/components/ui/calendar"
import { Edit3, CalendarIcon, FileText, Flag } from 'lucide-react'
import { format } from "date-fns"
import { TaskDetail } from "../../../../types/task.types"

interface DetailsFormProps {
    currentTask: TaskDetail | null
    isEditing: boolean
    editedTask: any
    onFieldChange: (field: string, value: any) => void
}

export function DetailsForm({
    currentTask,
    isEditing,
    editedTask,
    onFieldChange
}: DetailsFormProps) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "URGENT":
                return "bg-red-600 text-white"
            case "HIGH":
                return "bg-red-500 text-white"
            case "MEDIUM":
                return "bg-yellow-500 text-white"
            case "LOW":
                return "bg-green-500 text-white"
            default:
                return "bg-gray-500 text-white"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DONE":
                return "bg-green-500 text-white"
            case "IN_PROGRESS":
                return "bg-blue-500 text-white"
            case "IN_REVIEW":
                return "bg-purple-500 text-white"
            case "TODO":
                return "bg-gray-500 text-white"
            default:
                return "bg-gray-500 text-white"
        }
    }

    return (
        <div className="space-y-6">
            {/* Main Task Info Card */}
            <Card>
                <CardHeader>
                    <Label className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Task Information
                    </Label>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Title - Full Width */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Title</Label>
                        {isEditing ? (
                            <Input
                                value={editedTask?.title ?? ""}
                                onChange={(e) => onFieldChange('title', e.target.value)}
                                placeholder="Enter task title..."
                                className="font-medium"
                            />
                        ) : (
                            <div className="p-3 bg-muted/30 rounded-lg">
                                <h3 className="font-medium text-lg">{currentTask?.title || "Untitled Task"}</h3>
                            </div>
                        )}
                    </div>

                    {/* Status & Priority - 2 Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Flag className="h-4 w-4" />
                                Status
                            </Label>
                            {isEditing ? (
                                <Select
                                    value={editedTask?.status ?? "TODO"}
                                    onValueChange={(value) => onFieldChange('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TODO">To Do</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="DONE">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Badge className={getStatusColor(currentTask?.status || "TODO")}>
                                    {currentTask?.status?.replace('_', ' ') || "TODO"}
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Flag className="h-4 w-4" />
                                Priority
                            </Label>
                            {isEditing ? (
                                <Select
                                    value={editedTask?.priority ?? "MEDIUM"}
                                    onValueChange={(value) => onFieldChange('priority', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="HIGH">High</SelectItem>
                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                        <SelectItem value="LOW">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Badge className={getPriorityColor(currentTask?.priority || "MEDIUM")}>
                                    {currentTask?.priority || "MEDIUM"}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Description - Full Width */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <Edit3 className="h-4 w-4" />
                            Description
                        </Label>
                        {isEditing ? (
                            <Textarea
                                value={editedTask?.description ?? ""}
                                onChange={(e) => onFieldChange('description', e.target.value)}
                                placeholder="Add a description..."
                                rows={4}
                                className="resize-none"
                            />
                        ) : (
                            <div className="p-3 bg-muted/30 rounded-lg min-h-[100px]">
                                {currentTask?.description ? (
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{currentTask.description}</p>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No description provided</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Due Date & Start Date - 2 Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                Due Date
                            </Label>
                            {isEditing ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-start w-full">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {editedTask?.dueDate ? format(editedTask.dueDate, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={editedTask?.dueDate || undefined}
                                            onSelect={(date) => onFieldChange('dueDate', date || null)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <div className="flex items-center gap-2">
                                    {currentTask?.dueDate ? (
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

                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                Start Date
                            </Label>
                            <div className="flex items-center gap-2">
                                {currentTask?.startDate ? (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" />
                                        {format(new Date(currentTask.startDate), "PPP")}
                                    </Badge>
                                ) : currentTask?.createdAt ? (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" />
                                        {format(new Date(currentTask.createdAt), "PPP")}
                                    </Badge>
                                ) : (
                                    <span className="text-sm text-muted-foreground">No start date set</span>
                                )}
                                {isEditing && (
                                    <span className="text-xs text-muted-foreground italic">
                                        (Created date - cannot be changed)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
