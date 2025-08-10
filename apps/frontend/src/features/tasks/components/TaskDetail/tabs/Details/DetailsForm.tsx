"use client"

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card/Card"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button/Button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Calendar } from "@/shared/components/ui/calendar"
import { Edit3, Users, CalendarIcon, Plus } from 'lucide-react'
import { format } from "date-fns"
import { motion } from "framer-motion"
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
    return (
        <div className="space-y-6">
            {/* Description */}
            <Card>
                <CardHeader>
                    <Label className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4" />
                        Description
                    </Label>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>

            {/* Assignees */}
            <Card>
                <CardHeader>
                    <Label className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Assignees
                    </Label>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 flex-wrap">
                        {currentTask?.assignees?.map((assignee: any) => (
                            <motion.div
                                key={assignee.id}
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1"
                            >
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={assignee.avatar ?? undefined} alt={assignee.name} />
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
                </CardContent>
            </Card>

            {/* Due Date */}
            <Card>
                <CardHeader>
                    <Label className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Due Date
                    </Label>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
        </div>
    )
}
