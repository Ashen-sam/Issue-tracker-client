import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ReactNode } from "react";

interface IssueDialogProps {
    open: boolean;
    title: string;
    note?: string;
    icon?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    onClose: () => void;
    className?: string;
}

export const IssueDialog = ({
    open,
    title,
    note,
    icon,
    children,
    footer,
    onClose,
    className = "",
}: IssueDialogProps) => {
    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                if (!val) onClose();
            }}
        >
            <DialogContent
                className={`
                    ${className}
                    p-0 gap-0 rounded-md
                    backdrop-blur-xl bg-white/70 dark:bg-zinc-900/50 
                    border border-zinc-300 dark:border-[#2a2a2a]
                    shadow-[0_0_40px_rgba(0,0,0,0.20)]
                    data-[state=open]:animate-in
                    data-[state=open]:fade-in-0
                    data-[state=open]:zoom-in-95
                    data-[state=closed]:animate-out
                    data-[state=closed]:fade-out-0
                    data-[state=closed]:zoom-out-95
                    duration-200
                    overflow-hidden
                `}
            >
                <div className="flex items-center justify-between px-4 py-2.5 bg-white/60 dark:bg-[#1a1a1a] backdrop-blur-xl">
                    <div className="flex gap-3  items-center pt-3">

                        {icon && (
                            <div className="border border-dashed relative dark:bg-indigo-500/40 text-white bg-indigo-700/70
  
         rounded-sm p-2">
                                {icon}

                            </div>
                        )}
                        <div className="flex flex-col gap-0.75">
                            <DialogTitle className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {title}
                            </DialogTitle>
                            {note && (
                                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    {note}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                <div className="px-4 py-4 bg-white/40 dark:bg-[#1a1a1a] backdrop-blur-xl max-h-[70vh] overflow-y-auto">
                    {children}
                </div>

                {footer && (
                    <div className="px-4 py-3 border-t bg- border-dashed border-zinc-300 dark:border-white/10 flex justify-end bg-white/50 dark:bg-[#1a1a1a] backdrop-blur-xl">
                        {footer}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};