"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Textarea,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Button,
    Calendar,
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/shared/components/ui"
import { CalendarIcon, Save, X } from 'lucide-react'

interface TaskFormProps {
    task?: any
    onSubmit: (data: any) => void
    onCancel: () => void
    isLoading?: boolean
}

export function TaskForm({ task, onSubmit, onCancel, isLoading }: TaskFormProps) {
    // This is a placeholder for future implementation
    // Currently, task editing is handled inline in TaskDetail

    return (
        <Card>
            <CardHeader>
                <CardTitle>{task ? 'Edit Task' : 'Create Task'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Task title..." />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Task description..." rows={4} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TODO">To Do</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="DONE">Done</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-start">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Pick a date
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                    <Button onClick={() => onSubmit({})} disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        {task ? 'Update' : 'Create'} Task
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
