import { Button } from "@/components/ui/button";
import { CommonLoader } from "../commonLoader";

type FormMode = "add" | "edit" | "delete" | "view";

interface IssueDialogFooterProps {
    onCancel: () => void;
    onConfirm?: () => void;
    onConfirmAndCreateAnother?: () => void;
    cancelText?: string;
    confirmText?: string;
    isLoading?: boolean;
    showCancel?: boolean;
    showConfirm?: boolean;
    enableCreateAnother?: boolean;
    confirmDisabled?: boolean;
    formMode?: FormMode;
}

export const IssueDialogFooter = ({
    onCancel,
    onConfirm,
    cancelText = "Cancel",
    confirmText = "Confirm",
    isLoading = false,
    showCancel = true,
    showConfirm = true,
    confirmDisabled = false,
    formMode = "add",
}: IssueDialogFooterProps) => {
    return (
        <div className="flex justify-end gap-3 py-1">
            {showCancel && (
                <Button
                    size={'sm'}
                    className="text-xs"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    {cancelText}
                </Button>
            )}

            {showConfirm && (
                <div className="flex">
                    <Button
                        size={'sm'}
                        className={`text-xs bg-indigo-700/80 text-white
  dark:bg-indigo-500/60
  hover:bg-indigo-600/80 dark:hover:bg-indigo-400/60
  hover:text-white dark:hover:text-white ${formMode === "add" ? "border" : ""}`}
                        variant="outline"
                        onClick={onConfirm}
                        disabled={isLoading || confirmDisabled}
                    >
                        {isLoading ? <CommonLoader /> : confirmText}
                    </Button>


                </div>
            )}
        </div>
    );
}