import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinnerVariants = cva(
    "animate-spin rounded-full border-2 border-current border-t-transparent",
    {
        variants: {
            size: {
                sm: "h-4 w-4",
                default: "h-6 w-6",
                lg: "h-8 w-8",
                xl: "h-12 w-12",
            },
            variant: {
                default: "text-primary",
                secondary: "text-secondary-foreground",
                muted: "text-muted-foreground",
                white: "text-white",
            },
        },
        defaultVariants: {
            size: "default",
            variant: "default",
        },
    }
)

export interface SpinnerProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
    label?: string
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
    ({ className, size, variant, label = "Loading...", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("flex items-center gap-2", className)}
                {...props}
            >
                <div
                    className={cn(spinnerVariants({ size, variant }))}
                    role="status"
                    aria-label={label}
                />
                {label && (
                    <span className="text-sm text-muted-foreground">{label}</span>
                )}
            </div>
        )
    }
)
Spinner.displayName = "Spinner"

export { Spinner, spinnerVariants } 