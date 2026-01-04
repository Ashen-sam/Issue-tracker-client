import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

export type IssuePriority = "Low" | "Medium" | "High" | "Critical";

interface PriorityBadgeProps {
    priority: IssuePriority;
    className?: string;
}

const iconStyles: Record<IssuePriority, string> = {
    "Low": "text-green-400",
    "Medium": "text-yellow-400",
    "High": "text-red-400",
    "Critical": "text-purple-600",
};

const priorityLabel: Record<IssuePriority, string> = {
    "Low": "Low",
    "Medium": "Medium",
    "High": "High",
    "Critical": "Critical",
};

const priorityIcon: Record<IssuePriority, React.ElementType> = {
    "Low": ArrowDown,
    "Medium": Minus,
    "High": ArrowUp,
    "Critical": ArrowUp, // can use same icon or choose another
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
