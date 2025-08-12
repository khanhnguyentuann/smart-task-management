"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui"
import { Button, Input, Label, Alert, AlertDescription } from "@/shared/components/ui"
import { AlertTriangle, Trash2 } from "lucide-react"
import { DeleteProjectDialogProps } from "../../lib"

export function DeleteProjectConfirm({
    isOpen,
    onClose,
    onConfirm,
    projectName,
    loading = false
}: DeleteProjectDialogProps) {
    const [confirmationText, setConfirmationText] = useState("")
    const [isConfirmed, setIsConfirmed] = useState(false)

    const handleConfirmationChange = (value: string) => {
        setConfirmationText(value)
        setIsConfirmed(value === projectName)
    }

    const handleConfirm = () => {
        if (isConfirmed) {
            onConfirm()
        }
    }

    const handleClose = () => {
        setConfirmationText("")
        setIsConfirmed(false)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-5 w-5" />
                        Delete Project
                    </DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the project and all associated data.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Warning:</strong> Deleting this project will permanently remove:
                            <ul className="mt-2 ml-4 list-disc space-y-1">
                                <li>All project tasks and their data</li>
                                <li>All team member associations</li>
                                <li>Project settings and configurations</li>
                                <li>All project history and activity</li>
                            </ul>
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                        <Label htmlFor="confirmation">
                            Type <strong>{projectName}</strong> to confirm deletion:
                        </Label>
                        <Input
                            id="confirmation"
                            value={confirmationText}
                            onChange={(e) => handleConfirmationChange(e.target.value)}
                            placeholder="Enter project name to confirm"
                            className={isConfirmed ? "border-green-500" : ""}
                        />
                        {confirmationText && !isConfirmed && (
                            <p className="text-sm text-red-600">
                                Project name does not match. Please type exactly: <strong>{projectName}</strong>
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={!isConfirmed || loading}
                        className="gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                Delete Project
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
