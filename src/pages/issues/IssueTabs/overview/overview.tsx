import { CommonLoader, PriorityCommon, SeverityCommon, StatusCommon } from '@/common';
import { InteractivePieChart } from '@/common/InteractivePieChart';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetIssueQuery } from '@/services/issueApi';
import { Layers2 } from 'lucide-react';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

const COLORS = {
    status: {
        OPEN: "#3b82f6",
        IN_PROGRESS: "#f59e0b",
        RESOLVED: "#10b981",
        CLOSED: "#6b7280",
        ON_HOLD: "#8b5cf6"
    }
};

export const Overview = () => {
    const { issueId } = useParams();
    const { data: issue, isLoading, error } = useGetIssueQuery(issueId || '', {
        skip: !issueId,
    });

    const issueProgress = useMemo(() => {
        if (!issue) return 0;

        const statusProgress: Record<string, number> = {
            'OPEN': 20,
            'IN_PROGRESS': 60,
            'RESOLVED': 100,
            'CLOSED': 100,
            'ON_HOLD': 40,
        };
        return statusProgress[issue.status] || 0;
    }, [issue]);

    const pieChartData = useMemo(() => {
        if (!issue) return [];

        const progress = issueProgress;
        const remaining = 100 - progress;

        return [
            {
                label: 'Completed',
                value: progress,
                color: COLORS.status[issue.status as keyof typeof COLORS.status] || "#3b82f6"
            },
            {
                label: 'Remaining',
                value: remaining,
                color: "#e5e7eb"
            }
        ];
    }, [issue, issueProgress]);
    if (isLoading) {
        return (
            <div className="w-full  flex justify-center items-center min-h-100">
                <div className="flex items-center gap-2 text-sm px-3 py-[7.5px] border border-dashed rounded-md w-fit">
                    <CommonLoader />
                </div>
            </div>
        );
    }

    if (error || !issue) {
        return (
            <div className="w-full flex items-center justify-center py-8">
                <div className="text-red-500">Failed to load issue details</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-none rounded-sm dark:bg-[#1a1a1a] border">
                        <CardContent className="space-y-5">
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground tracking-wide mb-2 block">
                                    Issue Title
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="text-lg font-bold text-gray-700 dark:text-foreground">
                                        {issue.title}
                                    </div>
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                        <Layers2 className="h-5 w-5 text-primary" />
                                    </div>
                                </div>
                            </div>

                            <Separator />
                            <div className="flex items-center gap-6 flex-wrap">
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground tracking-wide mb-2.5 block">
                                        Status
                                    </label>
                                    <StatusCommon status={issue.status} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground tracking-wide mb-2.5 block">
                                        Priority
                                    </label>
                                    <PriorityCommon priority={issue.priority} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground tracking-wide mb-2.5 block">
                                        Severity
                                    </label>
                                    <div className="flex items-center gap-2  shadow-xs px-2 text-xs font-medium py-1 rounded-sm">
                                        <SeverityCommon severity={issue.severity} />
                                    </div>
                                </div>
                                {issue.createdAt && (
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground tracking-wide mb-2.5 block">
                                            Created Date
                                        </label>
                                        <div className="flex items-center gap-2 border shadow-xs px-2 text-xs font-medium py-1 rounded-sm">
                                            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <div>
                                <label className="text-xs font-semibold text-muted-foreground tracking-wide mb-2 block">
                                    Description
                                </label>
                                <div className="text-sm text-foreground/80 leading-relaxed wrap-break-word">
                                    {issue.description || 'No description available'}
                                </div>
                            </div>

                            {issue.assignedTo && (
                                <>
                                    <Separator />
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground tracking-wide mb-2 block">
                                            Assigned To
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-semibold text-primary">
                                                    {issue.assignedTo.name.substring(0, 2).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">{issue.assignedTo.name}</div>
                                                <div className="text-xs text-muted-foreground">{issue.assignedTo.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {issue.resolvedAt && (
                                <>
                                    <Separator />
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground tracking-wide mb-2 block">
                                            Resolved Date
                                        </label>
                                        <div className="flex items-center gap-2 border shadow-xs px-2 text-xs font-medium py-1 rounded-sm">
                                            <span>{new Date(issue.resolvedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="">
                    <Card className="shadow-none pb-4 pt-0 rounded-sm dark:bg-[#1a1a1a] border">
                        <InteractivePieChart
                            data={pieChartData}
                            title="Summary"
                            centerLabel="Progress"
                            size="sm"
                            valueFormatter={(value) => `${value}%`}
                            className="border-none shadow-none"
                        />
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-primary">
                                        {issue.createdBy?.name?.substring(0, 2).toUpperCase() || 'NA'}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        {issue.createdBy?.name || 'Unknown'}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {issue.createdBy?.email || ''}
                                    </div>
                                </div>
                            </div>

                            {issue.updatedAt && issue.updatedAt !== issue.createdAt && (
                                <>
                                    <Separator />
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground tracking-wide mb-2 block">
                                            Last Updated
                                        </label>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(issue.updatedAt).toLocaleString()}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}