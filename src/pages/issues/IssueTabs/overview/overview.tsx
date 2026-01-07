import { CommonLoader, PriorityCommon, SeverityCommon, StatusCommon } from '@/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetIssueQuery } from '@/services/issueApi';
import { Layers2 } from 'lucide-react';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const STATUS_CONFIG = {
    "Open": { color: "#3b82f6", percentage: 25, label: "Open" },
    "In Progress": { color: "#eab308", percentage: 50, label: "In Progress" },
    "Resolved": { color: "#22c55e", percentage: 100, label: "Resolved" },
    "Closed": { color: "#9ca3af", percentage: 100, label: "Closed" }
};

export const Overview = () => {
    const { issueId } = useParams();
    const { data: issue, isLoading, error } = useGetIssueQuery(issueId || '', {
        skip: !issueId,
    });

    const pieChartData = useMemo(() => {
        if (!issue) return [];

        const currentStatus = issue.status as keyof typeof STATUS_CONFIG;
        const config = STATUS_CONFIG[currentStatus];

        if (!config) return [];

        const completed = config.percentage;
        const remaining = 100 - completed;

        return [
            {
                name: config.label,
                value: completed,
                fill: config.color
            },
            {
                name: 'Remaining',
                value: remaining,
                fill: 'transparent'
            }
        ];
    }, [issue]);

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

    const currentConfig = STATUS_CONFIG[issue.status as keyof typeof STATUS_CONFIG];

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div

                    >
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
                                    {issue.foundDate && (
                                        <div>
                                            <label className="text-xs font-semibold text-muted-foreground tracking-wide mb-2.5 block">
                                                Found Date
                                            </label>
                                            <div className="flex items-center gap-2 border shadow-xs px-2 text-xs font-medium py-1 rounded-sm">
                                                <span>{new Date(issue.foundDate).toLocaleDateString()}</span>
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
                </div>

                <div className="">
                    <div

                    >
                        <Card className="shadow-none pb-4 pt-0 rounded-sm dark:bg-[#1a1a1a] border">
                            <CardHeader className="pb-0">
                                <CardTitle className="text-base font-semibold p-4">Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div
                                    className="flex flex-col items-center justify-center py-4"

                                >
                                    <ResponsiveContainer width="100%" height={150} >
                                        <PieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={60}
                                                startAngle={90}
                                                endAngle={-270}
                                                dataKey="value"
                                                animationBegin={0}
                                                animationDuration={1000}
                                            >
                                                {pieChartData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.fill}
                                                        stroke="#3b3b3b"
                                                        strokeWidth={1.5}
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div
                                        className="text-center -mt-2"

                                    >
                                        <div className="text-2xl font-bold" style={{ color: currentConfig?.color }}>
                                            {currentConfig?.percentage}%
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {currentConfig?.label}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardContent className="space-y-4 pt-0">
                                <Separator />
                                <div
                                    className="flex items-center gap-3"

                                >
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
                                        <div

                                        >
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
        </div>
    );
}