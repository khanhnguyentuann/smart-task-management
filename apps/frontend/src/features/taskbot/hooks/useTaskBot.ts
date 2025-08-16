import { useState, useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import type { TaskBotMood, TaskBotAction, TaskBotState } from '../types/taskbot.types'

export function useTaskBot() {
    const pathname = usePathname()
    const [state, setState] = useState<TaskBotState>({
        isVisible: true,
        isExpanded: false,
        currentMood: { type: 'working' },
        availableActions: []
    })

    // Determine mood based on current page
    const getMoodForPage = useCallback((page: string): TaskBotMood => {
        switch (page) {
            case '/dashboard':
                return { type: 'happy', message: 'Welcome back!' }
            case '/projects':
                return { type: 'working', message: 'Managing projects' }
            case '/my-tasks':
                return { type: 'working', message: 'Focusing on tasks' }
            default:
                return { type: 'thinking', message: 'Exploring...' }
        }
    }, [])

    // Update mood when page changes
    useEffect(() => {
        const newMood = getMoodForPage(pathname)
        setState(prev => ({
            ...prev,
            currentMood: newMood
        }))
    }, [pathname, getMoodForPage])

    // Toggle visibility
    const toggleVisibility = useCallback(() => {
        setState(prev => ({
            ...prev,
            isVisible: !prev.isVisible
        }))
    }, [])

    // Toggle expanded state
    const toggleExpanded = useCallback(() => {
        setState(prev => ({
            ...prev,
            isExpanded: !prev.isExpanded
        }))
    }, [])

    // Set available actions
    const setActions = useCallback((actions: TaskBotAction[]) => {
        setState(prev => ({
            ...prev,
            availableActions: actions
        }))
    }, [])

    return {
        state,
        toggleVisibility,
        toggleExpanded,
        setActions,
        currentPage: pathname
    }
}
