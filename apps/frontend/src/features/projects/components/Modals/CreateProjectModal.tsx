"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Calendar } from "@/shared/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { X, Users, CalendarIcon, Save, FolderPlus, Search } from 'lucide-react'
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"
import { GlassmorphismCard } from "@/shared/components/ui/glassmorphism-card"
import { useUsers, useToast, useErrorHandler } from "@/shared/hooks"
import { PROJECTS_CONSTANTS, validateCreateProject, getTemplateById } from "../../lib"
import type { CreateProjectData, ProjectTemplate, TeamMember } from "../../lib"

interface CreateProjectModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentUser: any
    onCreated: (projectData: CreateProjectData) => void
}

// Get all available templates using the utils function
const getProjectTemplates = (): ProjectTemplate[] => {
    return Object.values(PROJECTS_CONSTANTS.TEMPLATES).map(templateId =>
        getTemplateById(templateId) || {
            id: PROJECTS_CONSTANTS.TEMPLATES.EMPTY,
            name: "Empty Project",
            description: "Start with a blank canvas and create your own tasks",
            color: "bg-gray-500",
            icon: FolderPlus,
            tasks: []
        }
    )
}

const availableColors = PROJECTS_CONSTANTS.COLORS

export function CreateProjectModal({ open, onOpenChange, currentUser, onCreated }: CreateProjectModalProps) {
    const [step, setStep] = useState<"template" | "details" | "team">("template")
    const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        color: "bg-blue-500",
        startDate: new Date(),
        endDate: null as Date | null,
        priority: PROJECTS_CONSTANTS.PRIORITY.MEDIUM as typeof PROJECTS_CONSTANTS.PRIORITY[keyof typeof PROJECTS_CONSTANTS.PRIORITY],
        isPublic: false
    })
    const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(false)
    const [memberSearch, setMemberSearch] = useState("")
    const { users, loading: usersLoading } = useUsers()
    const { toast } = useToast()
    const { handleValidationError } = useErrorHandler({
        context: { component: 'CreateProjectModal' }
    })

    const handleTemplateSelect = (template: ProjectTemplate) => {
        setSelectedTemplate(template)
        setFormData(prev => ({
            ...prev,
            name: template.name,
            description: template.description,
            color: template.color
        }))
        setStep("details")
    }

    const handleMemberToggle = (user: any) => {
        const member: TeamMember = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: PROJECTS_CONSTANTS.ROLES.MEMBER
        }

        setSelectedMembers(prev => {
            const exists = prev.find(m => m.id === member.id)
            if (exists) {
                return prev.filter(m => m.id !== member.id)
            } else {
                return [...prev, member]
            }
        })
    }

    const handleSave = async () => {
        setLoading(true)

        const projectData: CreateProjectData = {
            name: formData.name,
            description: formData.description,
            priority: formData.priority,
            color: formData.color,
            startDate: formData.startDate.toISOString(),
            endDate: formData.endDate?.toISOString(),
            memberIds: selectedMembers.map(member => member.id),
            templateTasks: selectedTemplate?.tasks || []
        }

        // Validate project data
        const validation = validateCreateProject(projectData)
        if (!validation.success) {
            handleValidationError(new Error(validation.error.errors?.[0]?.message || PROJECTS_CONSTANTS.MESSAGES.VALIDATION_GENERIC), 'form')
            setLoading(false)
            return
        }

        onCreated(projectData)
        setLoading(false)
    }

    const canProceed = () => {
        switch (step) {
            case "template":
                return selectedTemplate !== null
            case "details":
                return formData.name.trim() !== ""
            case "team":
                return true
            default:
                return false
        }
    }

    const filteredUsers = (users || []).filter(user =>
        user.id !== currentUser.id &&
        !selectedMembers.find(member => member.id === user.id) &&
        (memberSearch === "" ||
            user.firstName.toLowerCase().includes(memberSearch.toLowerCase()) ||
            user.lastName.toLowerCase().includes(memberSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(memberSearch.toLowerCase()))
    )

    const handleClose = () => {
        onOpenChange(false)
        setStep("template")
        setSelectedTemplate(null)
        setFormData({
            name: "",
            description: "",
            color: "bg-blue-500",
            startDate: new Date(),
            endDate: null,
            priority: PROJECTS_CONSTANTS.PRIORITY.MEDIUM,
            isPublic: false
        })
        setSelectedMembers([])
        setMemberSearch("")
    }

    const renderTemplateStep = () => (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Choose a Template
                </h2>
                <p className="text-muted-foreground">
                    Start with a pre-built template or create a custom project
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {getProjectTemplates().map((template: ProjectTemplate, index: number) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <GlassmorphismCard
                            className={`cursor-pointer transition-all hover:shadow-lg ${selectedTemplate?.id === template.id
                                ? 'ring-2 ring-blue-500 shadow-lg'
                                : 'hover:shadow-md'
                                }`}
                            onClick={() => handleTemplateSelect(template)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${template.color} text-white`}>
                                        <template.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{template.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {template.description}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="min-h-[120px]">
                                {template.tasks.length > 0 ? (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Includes {template.tasks.length} tasks:</p>
                                        <div className="space-y-1">
                                            {template.tasks.slice(0, 3).map((task: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                                    {task.title}
                                                </div>
                                            ))}
                                            {template.tasks.length > 3 && (
                                                <div className="text-xs text-muted-foreground">
                                                    +{template.tasks.length - 3} more tasks
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-blue-600">Custom Project</p>
                                        <p className="text-xs text-muted-foreground">
                                            Start with a blank canvas and create your own tasks from scratch
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </GlassmorphismCard>
                    </motion.div>
                ))}
            </div>
        </div>
    )

    const renderDetailsStep = () => (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Project Details
                </h2>
                <p className="text-muted-foreground">
                    Configure your project settings and preferences
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

            {selectedTemplate && selectedTemplate.tasks.length > 0 && (
                <div className="space-y-3">
                    <Label>Template Tasks Preview</Label>
                    <GlassmorphismCard>
                        <CardContent className="p-4">
                            <div className="space-y-2">
                                {selectedTemplate.tasks.map((task: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                                        <div>
                                            <p className="font-medium text-sm">{task.title}</p>
                                            <p className="text-xs text-muted-foreground">{task.description}</p>
                                        </div>
                                        <Badge
                                            className={
                                                task.priority === PROJECTS_CONSTANTS.PRIORITY.HIGH ? "bg-red-500 text-white" :
                                                    task.priority === PROJECTS_CONSTANTS.PRIORITY.MEDIUM ? "bg-yellow-500 text-white" :
                                                        "bg-green-500 text-white"
                                            }
                                        >
                                            {task.priority}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </GlassmorphismCard>
                </div>
            )}
        </div>
    )

    const renderTeamStep = () => (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Add Team Members
                </h2>
                <p className="text-muted-foreground">
                    Invite team members to collaborate on this project
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <Label>Available Team Members</Label>
                    <ScrollArea className="h-64 border rounded-lg p-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search members..."
                                    value={memberSearch}
                                    onChange={(e) => setMemberSearch(e.target.value)}
                                    className="flex-1"
                                />
                            </div>
                            {usersLoading ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
                                    Loading members...
                                </div>
                            ) : !Array.isArray(users) ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Unable to load members</p>
                                    <p className="text-xs">Please try refreshing the page</p>
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No members found matching your search.</p>
                                    <p className="text-xs">Try a different search term or invite someone directly.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedMembers.find(m => m.id === user.id)
                                                ? 'bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                                                : 'hover:bg-muted/50'
                                                }`}
                                            onClick={() => handleMemberToggle(user)}
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src="/default-avatar.svg" alt={`${user.firstName} ${user.lastName}`} />
                                                <AvatarFallback>
                                                    {(user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{`${user.firstName} ${user.lastName}`}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                            <Badge variant="outline">Member</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <div className="space-y-4">
                    <Label>Selected Members ({selectedMembers.length + 1})</Label>
                    <div className="border rounded-lg p-4 min-h-64">
                        <div className="space-y-2">
                            {/* Current user (always included) */}
                            <div className="flex items-center gap-3 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/default-avatar.svg" alt={`${currentUser.firstName} ${currentUser.lastName}`} />
                                    <AvatarFallback>
                                        {(currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0)).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{`${currentUser.firstName} ${currentUser.lastName}`} (You)</p>
                                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                                </div>
                                <Badge>Admin</Badge>
                            </div>

                            {selectedMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-3 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/default-avatar.svg" alt={`${member.firstName} ${member.lastName}`} />
                                        <AvatarFallback>
                                            {(member.firstName.charAt(0) + member.lastName.charAt(0)).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{`${member.firstName} ${member.lastName}`}</p>
                                        <p className="text-xs text-muted-foreground">{member.email}</p>
                                    </div>
                                    <Badge variant="outline">{member.role}</Badge>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleMemberToggle(member)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            {selectedMembers.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No additional members selected</p>
                                    <p className="text-xs">You can add members later</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2">
                        {["template", "details", "team"].map((stepName, index) => (
                            <div key={stepName} className="flex items-center gap-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step === stepName
                                        ? "bg-blue-600 text-white"
                                        : index < ["template", "details", "team"].indexOf(step)
                                            ? "bg-green-600 text-white"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {index + 1}
                                </div>
                                {index < 2 && (
                                    <div
                                        className={`w-12 h-1 rounded transition-colors ${index < ["template", "details", "team"].indexOf(step)
                                            ? "bg-green-600"
                                            : "bg-muted"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="min-h-[500px]">
                        {step === "template" && renderTemplateStep()}
                        {step === "details" && renderDetailsStep()}
                        {step === "team" && renderTeamStep()}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-6 border-t">
                        <div className="flex items-center gap-2">
                            {step !== "template" && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        if (step === "details") setStep("template")
                                        if (step === "team") setStep("details")
                                    }}
                                >
                                    Previous
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {step !== "team" ? (
                                <EnhancedButton
                                    onClick={() => {
                                        if (step === "template") setStep("details")
                                        if (step === "details") setStep("team")
                                    }}
                                    disabled={!canProceed()}
                                >
                                    Next
                                </EnhancedButton>
                            ) : (
                                <EnhancedButton
                                    onClick={handleSave}
                                    disabled={!canProceed() || loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Create Project
                                        </>
                                    )}
                                </EnhancedButton>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
