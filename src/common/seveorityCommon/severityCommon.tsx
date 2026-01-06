import { cn } from "@/lib/utils";
import {
    AlertTriangle,
    Flame,
    MinusCircle,
} from "lucide-react";

export type IssueSeverity = "Minor" | "Major" | "Critical";

interface SeverityBadgeProps {
    severity: IssueSeverity | "";
    className?: string;
}

const severityStyles: Record<IssueSeverity, string> = {
    "Minor": "text-blue-400",
    "Major": "text-orange-500",
    "Critical": "text-red-500",
};

const severityLabel: Record<IssueSeverity, string> = {
    "Minor": "Minor",
    "Major": "Major",
    "Critical": "Critical",
};

const severityIcon: Record<IssueSeverity, React.ElementType> = {
    "Minor": MinusCircle,
    "Major": AlertTriangle,
    "Critical": Flame,
};

export const SeverityCommon = ({ severity, className }: SeverityBadgeProps) => {
    if (!severity || !(severity in severityIcon)) {
        return (
            <div
                className={cn(
                    "flex items-center gap-2 text-xs font-medium px-2 py-0.5 rounded-md text-gray-400",
                    className
                )}
            >
                <MinusCircle className="h-4 w-4" />
            </div>
        );
    }

    const Icon = severityIcon[severity];

    return (
        <div
            className={cn(
                "flex items-center gap-2 text-xs font-medium px-2 py-0.5 rounded-md",
                className
            )}
        >
            <Icon className={cn("h-4 w-4", severityStyles[severity])} />
            {severityLabel[severity]}
        </div>
    );
};