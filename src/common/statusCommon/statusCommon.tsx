import { cn } from "@/lib/utils";
import {
    BadgeCheck,
    CircleDashed,
    Hexagon,
    XCircle
} from "lucide-react";

export type IssueStatus = "Open" | "In Progress" | "Resolved" | "Closed";

interface StatusBadgeProps {
    status: IssueStatus;
    className?: string;
}

const iconStyles: Record<IssueStatus, string> = {
    "Open": "text-blue-500",
    "In Progress": "text-yellow-500",
    "Resolved": "text-green-500",
    "Closed": "text-gray-400",
};

const statusLabel: Record<IssueStatus, string> = {
    "Open": "Open",
    "In Progress": "In Progress",
    "Resolved": "Resolved",
    "Closed": "Closed",
};

const statusIcon: Record<IssueStatus, React.ElementType> = {
    "Open": Hexagon,
    "In Progress": CircleDashed,
    "Resolved": BadgeCheck,
    "Closed": XCircle,
};

export const StatusCommon = ({ status, className }: StatusBadgeProps) => {
    const Icon = statusIcon[status];

    return (
        <div
            className={cn(
                "flex items-center gap-2 text-xs font-medium px-2 py-0.5 rounded-md",
                className
            )}
        >
            <Icon className={cn("h-4 w-5", iconStyles[status])} />
            {statusLabel[status]}
        </div>
    );
};
