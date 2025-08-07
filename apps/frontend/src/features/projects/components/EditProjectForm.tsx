"use client"

import { useState, useEffect } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Calendar } from "@/shared/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Save, ArrowLeft, CalendarIcon } from 'lucide-react'
import { EnhancedButton } from "@/shared/components/ui/enhanced-button"
import type { Project, UpdateProjectData } from "@/features/projects/types"

interface EditProjectFormProps {
  project: Project
  onBack: () => void
  onSave: (projectData: UpdateProjectData) => void
  loading?: boolean
}

const availableColors = [
  "bg-blue-500",
  "bg-green-500", 
  "bg-purple-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-cyan-500"
]

export function EditProjectForm({ project, onBack, onSave, loading = false }: EditProjectFormProps) {
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || "",
    color: project.color,
    startDate: new Date(),
    endDate: null as Date | null,
    priority: "Medium" as "Low" | "Medium" | "High",
  })

  useEffect(() => {
    // Set initial form data from project
    setFormData({
      name: project.name,
      description: project.description || "",
      color: project.color,
      startDate: new Date(),
      endDate: null,
      priority: "Medium",
    })
  }, [project])

  const handleSave = async () => {
    const projectData: UpdateProjectData = {
      name: formData.name,
      description: formData.description,
    }
    
    onSave(projectData)
  }

  const canProceed = () => {
    return formData.name.trim() !== ""
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Project</h1>
            <p className="text-muted-foreground">
              Update project settings and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
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
                onValueChange={(value: "Low" | "Medium" | "High") => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low Priority</SelectItem>
                  <SelectItem value="Medium">Medium Priority</SelectItem>
                  <SelectItem value="High">High Priority</SelectItem>
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
                    className={`w-8 h-8 rounded-lg ${color} transition-all hover:scale-110 ${
                      formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
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
      </motion.div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
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
  )
}
