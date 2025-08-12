"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Calendar } from "@/shared/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Save } from 'lucide-react'
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"
import { useToast, useErrorHandler } from "@/shared/hooks"
import { PROJECTS_CONSTANTS, validateUpdateProject } from "../../lib"

interface EditProjectModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentUser: any
    project: any
    onUpdated: (projectData: any) => void
}

const availableColors = PROJECTS_CONSTANTS.COLORS

export function EditProjectModal({ open, onOpenChange, currentUser, project, onUpdated }: EditProjectModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: "bg-blue-500",
        startDate: new Date(),
        endDate: null as Date | null,
        priority: PROJECTS_CONSTANTS.PRIORITY.MEDIUM as typeof PROJECTS_CONSTANTS.PRIORITY[keyof typeof PROJECTS_CONSTANTS.PRIORITY],
        isPublic: false
    })
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const { handleValidationError } = useErrorHandler({
        context: { component: 'EditProjectModal' }
    })

    // Update form data when project changes
    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name,
                description: project.description || "",
                color: project.color || "bg-blue-500",
                startDate: new Date(project.startDate),
                endDate: project.endDate ? new Date(project.endDate) : null,
                priority: project.priority || PROJECTS_CONSTANTS.PRIORITY.MEDIUM,
                isPublic: false
            })
        }
    }, [project])

    const handleSave = async () => {
        setLoading(true)

        const projectData = {
            name: formData.name,
            description: formData.description,
            priority: formData.priority,
            color: formData.color,
            startDate: formData.startDate.toISOString(),
            endDate: formData.endDate?.toISOString()
        }

        // Validate project data
        const validation = validateUpdateProject(projectData)
        if (!validation.success) {
            handleValidationError(new Error(validation.error.errors?.[0]?.message || PROJECTS_CONSTANTS.MESSAGES.VALIDATION_GENERIC), 'form')
            setLoading(false)
            return
        }

        onUpdated(projectData)
        setLoading(false)
    }

    const canProceed = () => {
        return formData.name.trim() !== ""
    }

    const handleClose = () => {
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Content */}
                    <div className="min-h-[400px]">
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Project Details
                                </h2>
                                <p className="text-muted-foreground">
                                    Update your project settings and preferences
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="project-name">Project Name *</Label>
                                        <Input
                                            id="project-name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Enter project name..."
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="project-description">Description</Label>
                                        <Textarea
                                            id="project-description"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Describe your project..."
                                            rows={3}
                                            className="resize-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Priority Level</Label>
                                        <Select
                                            value={formData.priority}
                                            onValueChange={(value: typeof PROJECTS_CONSTANTS.PRIORITY[keyof typeof PROJECTS_CONSTANTS.PRIORITY]) =>
                                                setFormData(prev => ({ ...prev, priority: value }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={PROJECTS_CONSTANTS.PRIORITY.LOW}>Low Priority</SelectItem>
                                                <SelectItem value={PROJECTS_CONSTANTS.PRIORITY.MEDIUM}>Medium Priority</SelectItem>
                                                <SelectItem value={PROJECTS_CONSTANTS.PRIORITY.HIGH}>High Priority</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Project Color</Label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {availableColors.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    className={`w-8 h-8 rounded-lg ${color} transition-all hover:scale-110 ${formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                                                        }`}
                                                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {format(formData.startDate, "PPP")}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.startDate}
                                                    onSelect={(date) => date && setFormData(prev => ({ ...prev, startDate: date }))}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>End Date (Optional)</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {formData.endDate ? format(formData.endDate, "PPP") : "Select end date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.endDate || undefined}
                                                    onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date || null }))}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-6 border-t">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <EnhancedButton
                                onClick={handleSave}
                                disabled={!canProceed() || loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </EnhancedButton>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
