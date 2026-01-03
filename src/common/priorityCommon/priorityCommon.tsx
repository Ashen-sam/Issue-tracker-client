import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

export type IssuePriority = "LOW" | "MEDIUM" | "HIGH";

interface PriorityBadgeProps {
    priority: IssuePriority;
    className?: string;
}

const iconStyles: Record<IssuePriority, string> = {
    LOW: "text-green-400",
    MEDIUM: "text-yellow-400",
    HIGH: "text-red-400",
};

const priorityLabel: Record<IssuePriority, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
};

const priorityIcon: Record<IssuePriority, React.ElementType> = {
    LOW: ArrowDown,
    MEDIUM: Minus,
    HIGH: ArrowUp,
};

export const PriorityCommon = ({ priority, className }: PriorityBadgeProps) => {
    const Icon = priorityIcon[priority];

    return (
        <div
            className={cn(
                "flex items-center gap-2 text-xs font-medium px-2 py-0.5 rounded-md",
                className
            )}
        >
            <Icon className={cn("h-4 w-5", iconStyles[priority])} />
            {priorityLabel[priority]}
        </div>
    );
};
