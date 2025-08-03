"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { motion, AnimatePresence } from "framer-motion"

interface SidebarContextType {
    expanded: boolean
    setExpanded: (expanded: boolean) => void
    open: boolean
    setOpen: (open: boolean) => void
    openMobile: boolean
    setOpenMobile: (open: boolean) => void
    isMobile: boolean
    toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider")
    }
    return context
}

interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function SidebarProvider({
    defaultOpen = true,
    open: openProp,
    onOpenChange,
    className,
    children,
    ...props
}: SidebarProviderProps) {
    const [openState, setOpenState] = React.useState(defaultOpen)
    const [expanded, setExpanded] = React.useState(true)
    const [openMobile, setOpenMobile] = React.useState(false)

    const open = openProp !== undefined ? openProp : openState
    const setOpen = React.useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
            const openValue = typeof value === "function" ? value(open) : value
            if (onOpenChange) {
                onOpenChange(openValue)
            } else {
                setOpenState(openValue)
            }
        },
        [open, onOpenChange]
    )

    const isMobile = useMediaQuery("(max-width: 768px)")

    const toggleSidebar = React.useCallback(() => {
        if (isMobile) {
            setOpenMobile((prev) => !prev)
        } else {
            setOpen((prev) => !prev)
        }
    }, [isMobile, setOpen])

    // Close mobile sidebar when clicking outside
    React.useEffect(() => {
        if (!isMobile || !openMobile) return

        const handleClickOutside = (event: MouseEvent) => {
            const sidebar = document.getElementById("mobile-sidebar")
            if (sidebar && !sidebar.contains(event.target as Node)) {
                setOpenMobile(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isMobile, openMobile])

    const contextValue = React.useMemo<SidebarContextType>(
        () => ({
            expanded,
            setExpanded,
            open,
            setOpen,
            openMobile,
            setOpenMobile,
            isMobile,
            toggleSidebar,
        }),
        [expanded, open, setOpen, openMobile, isMobile, toggleSidebar]
    )

    return (
        <SidebarContext.Provider value={contextValue}>
            <div className={cn("relative min-h-screen", className)} {...props}>
                {children}
            </div>
        </SidebarContext.Provider>
    )
}

export function Sidebar({
    className,
    children,
}: React.HTMLAttributes<HTMLDivElement>) {
    const { open, openMobile, isMobile } = useSidebar()

    if (isMobile) {
        return (
            <>
                {/* Mobile overlay */}
                <AnimatePresence>
                    {openMobile && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        />
                    )}
                </AnimatePresence>

                {/* Mobile sidebar */}
                <AnimatePresence>
                    {openMobile && (
                        <motion.aside
                            id="mobile-sidebar"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className={cn(
                                "fixed left-0 top-0 h-full w-[280px] border-r bg-background",
                                className
                            )}
                        >
                            {children}
                        </motion.aside>
                    )}
                </AnimatePresence>
            </>
        )
    }

    // Desktop sidebar
    return (
        <motion.aside
            animate={{
                width: open ? 280 : 0,
                opacity: open ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
                "fixed left-0 top-0 h-screen border-r bg-background overflow-hidden z-30",
                className
            )}
            style={{ width: open ? 280 : 0 }}
        >
            <div className="w-[280px] h-full">
                {children}
            </div>
        </motion.aside>
    )
}

export function SidebarHeader({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex items-center border-b px-4 py-3", className)}
            {...props}
        />
    )
}

export function SidebarContent({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex-1 overflow-auto py-2", className)} {...props} />
}

export function SidebarFooter({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("mt-auto border-t px-4 py-3", className)}
            {...props}
        />
    )
}

export function SidebarMenu({
    className,
    ...props
}: React.HTMLAttributes<HTMLUListElement>) {
    return <ul className={cn("space-y-1 px-2", className)} {...props} />
}

export function SidebarMenuItem({
    className,
    ...props
}: React.HTMLAttributes<HTMLLIElement>) {
    return <li className={cn("", className)} {...props} />
}

export function SidebarMenuButton({
    className,
    isActive,
    ...props
}: React.ComponentProps<typeof Button> & { isActive?: boolean }) {
    return (
        <Button
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
                "w-full justify-start gap-2 px-2",
                isActive && "bg-primary/10 text-primary hover:bg-primary/20",
                className
            )}
            {...props}
        />
    )
}

export function SidebarTrigger({
    className,
    ...props
}: React.ComponentProps<typeof Button>) {
    const { toggleSidebar } = useSidebar()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn("", className)}
            {...props}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
        </Button>
    )
}