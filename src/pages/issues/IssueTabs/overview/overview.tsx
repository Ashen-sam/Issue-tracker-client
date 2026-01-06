import { PriorityCommon, SeverityCommon, StatusCommon } from '@/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetIssueQuery } from '@/services/issueApi';
import { Layers2 } from 'lucide-react';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

const CircularProgress = ({ value }: { value: number }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
                <svg className="transform -rotate-90 w-40 h-40">
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-gray-200"
                    />
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="#6F61D9"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="text-primary transition-all duration-500"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{value}%</span>
                </div>
            </div>
        </div>
    );
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

    const daysRemaining = useMemo(() => {
        if (!issue?.createdAt) return 0;
        const today = new Date();
        const createdDate = new Date(issue.createdAt);
        const diffTime = today.getTime() - createdDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }, [issue]);

    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center py-8">
                <div className="text-gray-500">Loading issue details...</div>
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
                                <div className="text-sm text-foreground/80 leading-relaxed">
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

                <div className="space-y-6">
                    <Card className="shadow-none rounded-sm dark:bg-[#1a1a1a] border">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold">Summary</CardTitle>
                            </div>
                            <div className="pt-2">
                                <CircularProgress value={60} />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="font-semibold text-sm mb-2">
                                    {issueProgress === 100 ? 'Completed!' :
                                        issueProgress >= 60 ? 'In progress!' :
                                            issueProgress >= 40 ? 'Making progress' : 'Just started'}
                                </div>
                                <div className="text-xs text-muted-foreground leading-relaxed">
                                    This issue is being tracked and worked on by the team.
                                    {' '}
                                    Created {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} ago.
                                </div>
                            </div>

                            <Separator />
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