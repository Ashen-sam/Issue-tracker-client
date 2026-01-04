import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoaderProps {
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    text?: string;
}

const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
};

export const CommonLoader = ({ size = "md", className, text }: LoaderProps) => {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <Loader2
                className={cn(
                    "animate-spin text-primary",
                    sizeClasses[size],
                    className
                )}
            />
            {text && (
                <div className="text-sm text-muted-foreground">{text}</div>
            )}
        </div>
    );
};
