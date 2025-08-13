"use client"

import React from "react"
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui"
import { useRouter } from "next/navigation"

export interface ErrorPageAction {
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link"
}

export interface ErrorPageProps {
    icon: React.ReactNode
    iconBgClass?: string
    title: string
    description: string
    errorMessage?: string
    errorDigest?: string
    actions?: ErrorPageAction[]
    className?: string
    minHeightClass?: string
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
    icon,
    iconBgClass = "bg-red-100 dark:bg-red-900/20",
    title,
    description,
    errorMessage,
    errorDigest,
    actions = [],
    className = "",
    minHeightClass = "min-h-[400px]",
}) => {
    return (
        <div className={`flex items-center justify-center ${minHeightClass} p-4 ${className}`}>
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${iconBgClass}`}>
                        {icon}
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {errorMessage && (
                        <div className="rounded-lg bg-muted p-3">
                            <p className="text-sm text-muted-foreground">{errorMessage}</p>
                            {errorDigest && (
                                <p className="text-xs text-muted-foreground mt-1">Error ID: {errorDigest}</p>
                            )}
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        {actions.map((action, idx) => (
                            <Button
                                key={idx}
                                onClick={action.onClick}
                                variant={action.variant || "default"}
                                className="w-full"
                            >
                                {action.icon}
                                {action.label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ErrorPage;
