import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressVariants = cva(
    "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
    {
        variants: {
            variant: {
                default: "bg-secondary",
                success: "bg-green-100 dark:bg-green-900/20",
                warning: "bg-yellow-100 dark:bg-yellow-900/20",
                destructive: "bg-red-100 dark:bg-red-900/20",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

const progressIndicatorVariants = cva(
    "h-full w-full flex-1 transition-all duration-300 ease-in-out",
    {
        variants: {
            variant: {
                default: "bg-primary",
                success: "bg-green-600",
                warning: "bg-yellow-600",
                destructive: "bg-red-600",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface ProgressProps
    extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
    showValue?: boolean
    label?: string
}

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    ProgressProps
>(({ className, value, variant, showValue = false, label, ...props }, ref) => (
    <div className="w-full">
        {(label || showValue) && (
            <div className="flex items-center justify-between mb-2">
                {label && (
                    <span className="text-sm font-medium text-foreground">
                        {label}
                    </span>
                )}
                {showValue && (
                    <span className="text-sm text-muted-foreground">
                        {Math.round(value || 0)}%
                    </span>
                )}
            </div>
        )}
        <ProgressPrimitive.Root
            ref={ref}
            className={cn(progressVariants({ variant }), className)}
            {...props}
        >
            <ProgressPrimitive.Indicator
                className={cn(progressIndicatorVariants({ variant }))}
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress } 