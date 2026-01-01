import { cn } from "@/lib/utils";
import {
    BadgeCheck,
    CircleDashed,
    Hexagon,
    XCircle
} from "lucide-react";

export type IssueStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

interface StatusBadgeProps {
    status: IssueStatus;
    className?: string;
}

const iconStyles: Record<IssueStatus, string> = {
    OPEN: "text-blue-500",
    IN_PROGRESS: "text-yellow-500",
    RESOLVED: "text-green-500",
    CLOSED: "text-gray-400",
};

const statusLabel: Record<IssueStatus, string> = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
};

const statusIcon: Record<IssueStatus, React.ElementType> = {
    OPEN: Hexagon,
    IN_PROGRESS: CircleDashed,
    RESOLVED: BadgeCheck,
    CLOSED: XCircle,
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
