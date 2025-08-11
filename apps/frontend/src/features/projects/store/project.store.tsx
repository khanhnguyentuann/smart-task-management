import { createContext, useContext, useState, ReactNode } from 'react'
import type { Project } from '../lib'

interface ProjectStoreContextType {
    currentProject: Project | null
    setCurrentProject: (project: Project | null) => void
    clearCurrentProject: () => void
}

const ProjectStoreContext = createContext<ProjectStoreContextType | undefined>(undefined)

interface ProjectStoreProviderProps {
    children: ReactNode
}

export const ProjectStoreProvider = ({ children }: ProjectStoreProviderProps) => {
    const [currentProject, setCurrentProject] = useState<Project | null>(null)

    const clearCurrentProject = () => setCurrentProject(null)

    const value = {
        currentProject,
        setCurrentProject,
        clearCurrentProject
    }

    return (
        <ProjectStoreContext.Provider value={value}>
            {children}
        </ProjectStoreContext.Provider>
    )
}

export const useProjectStore = () => {
    const context = useContext(ProjectStoreContext)
    if (context === undefined) {
        throw new Error('useProjectStore must be used within a ProjectStoreProvider')
    }
    return context
}
