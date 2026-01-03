import { Button } from "@/components/ui/button";

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
                        className={`text-xs ${formMode === "add" ? "border" : ""}`}
                        variant="outline"
                        onClick={onConfirm}
                        disabled={isLoading || confirmDisabled}
                    >
                        {isLoading ? "Loading..." : confirmText}
                    </Button>


                </div>
            )}
        </div>
    );
}