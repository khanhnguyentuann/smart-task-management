import { CalendarIcon, FolderPlus, Star, Target } from 'lucide-react'
import { PROJECTS_CONSTANTS, type Priority } from '../constants'
import type { Project, ProjectTask } from '../types'

// Color utilities
export const getProjectColor = (projectId: string): string => {
    if (!projectId || typeof projectId !== 'string') {
        return PROJECTS_CONSTANTS.COLORS[0]
    }
    const index = projectId.charCodeAt(0) % PROJECTS_CONSTANTS.COLORS.length
    return PROJECTS_CONSTANTS.COLORS[index]
}

// Priority utilities
export const getPriorityColor = (priority: Priority): string => {
    const colorMap = {
        [PROJECTS_CONSTANTS.PRIORITY.HIGH]: 'bg-red-500',
        [PROJECTS_CONSTANTS.PRIORITY.MEDIUM]: 'bg-yellow-500',
        [PROJECTS_CONSTANTS.PRIORITY.LOW]: 'bg-green-500'
    }
    return colorMap[priority] || 'bg-gray-500'
}

export const normalizePriority = (priority: string): Priority => {
    if (!priority) return PROJECTS_CONSTANTS.PRIORITY.MEDIUM

    const normalized = priority.toLowerCase()
    if (normalized === 'low') return PROJECTS_CONSTANTS.PRIORITY.LOW
    if (normalized === 'high') return PROJECTS_CONSTANTS.PRIORITY.HIGH
    return PROJECTS_CONSTANTS.PRIORITY.MEDIUM
}

// Task statistics
export const calculateTaskStats = (tasks: ProjectTask[] = []) => {
    return {
        todo: tasks.filter(task => task.status === PROJECTS_CONSTANTS.TASK_STATUS.TODO).length,
        inProgress: tasks.filter(task => task.status === PROJECTS_CONSTANTS.TASK_STATUS.IN_PROGRESS).length,
        done: tasks.filter(task => task.status === PROJECTS_CONSTANTS.TASK_STATUS.DONE).length
    }
}

export const calculateProgress = (project: Project): number => {
    const stats = project.taskStats
    const total = stats.todo + stats.inProgress + stats.done

    if (total === 0) return 0
    return Math.round((stats.done / total) * 100)
}

// Date utilities
export const getDeadlineStatus = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { color: 'text-red-600', label: 'Overdue' }
    if (diffDays === 0) return { color: 'text-yellow-600', label: 'Due today' }
    if (diffDays <= 3) return { color: 'text-yellow-600', label: `Due in ${diffDays} days` }
    return { color: 'text-muted-foreground', label: `Due in ${diffDays} days` }
}

// Format error messages
export const formatProjectError = (error: any): string => {
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    if (error?.response?.data?.message) return error.response.data.message
    return PROJECTS_CONSTANTS.MESSAGES.FETCH_FAILED
}

// Filter and search utilities
export const filterProjectsByQuery = (projects: Project[], query: string): Project[] => {
    if (!query || query.length < PROJECTS_CONSTANTS.LIMITS.SEARCH_MIN_LENGTH) {
        return projects
    }

    const lowerQuery = query.toLowerCase()
    return projects.filter(project =>
        project.name.toLowerCase().includes(lowerQuery) ||
        (project.description?.toLowerCase() || '').includes(lowerQuery)
    )
}

// Template utilities
export const getTemplateById = (templateId: string) => {
    // This would normally fetch from a templates constant or API
    const templates = [
        {
            id: PROJECTS_CONSTANTS.TEMPLATES.EMPTY,
            name: "Empty Project",
            description: "Start with a blank canvas and create your own tasks",
            color: "bg-gray-500",
            icon: FolderPlus,
            tasks: []
        },
        {
            id: PROJECTS_CONSTANTS.TEMPLATES.WEB_DEV,
            name: "Web Development",
            description: "Complete web application development project",
            color: "bg-blue-500",
            icon: FolderPlus,
            tasks: [
                { title: "Setup development environment", description: "Configure tools and dependencies", priority: PROJECTS_CONSTANTS.PRIORITY.HIGH },
                { title: "Design system creation", description: "Create UI components and style guide", priority: PROJECTS_CONSTANTS.PRIORITY.MEDIUM },
                { title: "Frontend development", description: "Build user interface", priority: PROJECTS_CONSTANTS.PRIORITY.HIGH },
                { title: "Backend API development", description: "Create server-side functionality", priority: PROJECTS_CONSTANTS.PRIORITY.HIGH },
                { title: "Testing and QA", description: "Test application functionality", priority: PROJECTS_CONSTANTS.PRIORITY.MEDIUM },
                { title: "Deployment setup", description: "Configure production environment", priority: PROJECTS_CONSTANTS.PRIORITY.HIGH },
            ]
        },
        {
            id: PROJECTS_CONSTANTS.TEMPLATES.MARKETING,
            name: "Marketing Campaign",
            description: "Launch and manage marketing campaigns",
            color: "bg-green-500",
            icon: Target,
            tasks: [
                { title: "Market research", description: "Analyze target audience and competitors", priority: PROJECTS_CONSTANTS.PRIORITY.HIGH },
                { title: "Content creation", description: "Create marketing materials", priority: PROJECTS_CONSTANTS.PRIORITY.MEDIUM },
                { title: "Campaign launch", description: "Execute marketing campaign", priority: PROJECTS_CONSTANTS.PRIORITY.HIGH },
                { title: "Performance tracking", description: "Monitor and analyze results", priority: PROJECTS_CONSTANTS.PRIORITY.MEDIUM },
                { title: "A/B testing", description: "Test different campaign variations", priority: PROJECTS_CONSTANTS.PRIORITY.LOW },
                { title: "Report generation", description: "Create campaign performance reports", priority: PROJECTS_CONSTANTS.PRIORITY.MEDIUM },
            ]
        },
        {
            id: PROJECTS_CONSTANTS.TEMPLATES.PRODUCT_LAUNCH,
            name: "Product Launch",
            description: "Plan and execute product launch strategy",
            color: "bg-purple-500",
            icon: Star,
            tasks: [
                { title: "Product roadmap", description: "Define product features and timeline", priority: PROJECTS_CONSTANTS.PRIORITY.HIGH },
                { title: "Beta testing", description: "Test product with select users", priority: PROJECTS_CONSTANTS.PRIORITY.MEDIUM },
                { title: "Launch preparation", description: "Prepare marketing and support materials", priority: PROJECTS_CONSTANTS.PRIORITY.HIGH },
                { title: "Go-to-market execution", description: "Execute launch strategy", priority: PROJECTS_CONSTANTS.PRIORITY.HIGH },
                { title: "Customer feedback collection", description: "Gather user feedback and reviews", priority: PROJECTS_CONSTANTS.PRIORITY.MEDIUM },
                { title: "Post-launch optimization", description: "Optimize based on user feedback", priority: PROJECTS_CONSTANTS.PRIORITY.MEDIUM },
            ]
        },
        {
            id: PROJECTS_CONSTANTS.TEMPLATES.EVENT_PLANNING,
            name: "Event Planning",
            description: "Organize and manage events or conferences",
            color: "bg-orange-500",
            icon: CalendarIcon,
            tasks: [
                { title: "Event concept and planning", description: "Define event goals and structure", priority: PROJECTS_CONSTANTS.PRIORITY.HIGH },
                { title: "Venue selection and booking", description: "Find and secure event location", priority: PROJECTS_CONSTANTS.PRIORITY.HIGH },
                { title: "Speaker and content coordination", description: "Manage speakers and presentations", priority: PROJECTS_CONSTANTS.PRIORITY.MEDIUM },
                { title: "Marketing and promotion", description: "Promote event to target audience", priority: PROJECTS_CONSTANTS.PRIORITY.MEDIUM },
                { title: "Logistics coordination", description: "Arrange catering, equipment, and services", priority: PROJECTS_CONSTANTS.PRIORITY.HIGH },
                { title: "Event execution and follow-up", description: "Run event and gather feedback", priority: PROJECTS_CONSTANTS.PRIORITY.HIGH },
            ]
        }
    ]
    return templates.find(t => t.id === templateId)
}