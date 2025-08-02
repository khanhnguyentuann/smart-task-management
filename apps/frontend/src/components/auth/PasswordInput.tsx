"use client"

import { useState, forwardRef } from "react"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string
    error?: string
    showLabel?: boolean
    showError?: boolean
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({
        label,
        error,
        showLabel = true,
        showError = false,
        className,
        onBlur,
        onChange,
        ...props
    }, ref) => {
        const [showPassword, setShowPassword] = useState(false)

        const handleTogglePassword = () => {
            setShowPassword(prev => !prev)
        }

        // Create toggle button component
        const ToggleButton = (
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-transparent"
                onClick={handleTogglePassword}
                tabIndex={-1}
            >
                {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                )}
            </Button>
        )

        return (
            <div className="space-y-2">
                {showLabel && label && (
                    <Label htmlFor={props.id}>
                        {label}
                    </Label>
                )}

                <Input
                    {...props}
                    ref={ref}
                    type={showPassword ? "text" : "password"}
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={
                        <div className="flex items-center gap-1">
                            {showError && error && (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            {ToggleButton}
                        </div>
                    }
                    error={!!error}
                    className={cn(className)}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            </div>
        )
    }
)

PasswordInput.displayName = "PasswordInput"