import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                gradient: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-sm hover:shadow-md",
                success: "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md",
                warning: "bg-yellow-600 text-white hover:bg-yellow-700 shadow-sm hover:shadow-md",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3 text-xs",
                lg: "h-11 rounded-md px-8 text-base",
                xl: "h-12 rounded-lg px-10 text-lg",
                icon: "h-10 w-10",
                "icon-sm": "h-8 w-8",
                "icon-lg": "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    loading?: boolean
    loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, loading = false, loadingText, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading && loadingText ? loadingText : children}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }