import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type DialogMode = "create" | "edit" | "delete" | "view"

interface IssueDialogProps {
    open: boolean
    mode: DialogMode
    title: string
    children: ReactNode
    confirmText?: string
    cancelText?: string
    onClose: () => void
    onConfirm?: () => void
}

export const IssueDialog = ({
    open,
    mode,
    title,
    children,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onClose,
    onConfirm,
}: IssueDialogProps) => {
    const danger = mode === "delete"

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className={cn(
                    "max-w-lg border border-zinc-800  text-zinc-100",
                    "dark:bg-[#1a1a1a] dark:border-zinc-800"
                )}
            >
                <DialogHeader>
                    <DialogTitle className="text-sm font-semibold tracking-wide text-zinc-100">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">{children}</div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 dark:text-zinc-300"
                    >
                        {cancelText}
                    </Button>

                    {onConfirm && (
                        <Button
                            onClick={onConfirm}
                            className={cn(
                                "px-4",
                                danger
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                            )}
                        >
                            {confirmText}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
