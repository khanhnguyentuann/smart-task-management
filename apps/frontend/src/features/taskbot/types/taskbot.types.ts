export interface TaskBotMood {
    type: "happy" | "working" | "thinking" | "sleeping"
    message?: string
}

export interface TaskBotAction {
    id: string
    label: string
    icon: string
    action: () => void
    shortcut?: string
}

export interface TaskBotState {
    isVisible: boolean
    isExpanded: boolean
    currentMood: TaskBotMood
    availableActions: TaskBotAction[]
}
