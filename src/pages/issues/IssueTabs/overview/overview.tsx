import { PriorityCommon, StatusCommon } from '@/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Layers2 } from 'lucide-react';
import React, { useMemo } from 'react';

const mockIssues = [
    {
        id: '1',
        name: 'Login Authentication Bug',
        description: 'Users are unable to login with valid credentials. The authentication service is returning 401 errors intermittently.',
        status: 'OPEN',
        priority: 'HIGH',
        type: 'Bug',
        created_at: '2024-12-15T10:00:00Z',
        due_date: '2025-01-10T23:59:59Z',
        reporter_id: 'user_123',
        tags: ['authentication', 'critical']
    },
];

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
                        stroke="currentColor"
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
    const [selectedIssueIndex, setSelectedIssueIndex] = React.useState(0);
    const issue = mockIssues[selectedIssueIndex];

    const issueProgress = useMemo(() => {
        const statusProgress = {
            'On track': 40,
            'In Progress': 60,
            'At risk': 50,
            'Off track': 20,
            'Completed': 100
        };
        return statusProgress[issue.status] || 0;
    }, [issue]);

    const daysRemaining = useMemo(() => {
        if (!issue.due_date) return 0;
        const today = new Date();
        const endDate = new Date(issue.due_date);
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }, [issue]);

    return (
        <div className=" space-y-6 ">


            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-none rounded-sm dark:bg-[#1a1a1a] border">
                        <CardContent className="space-y-5 ">
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground  tracking-wide mb-2 block">
                                    Issue Title
                                </label>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-gray-700 dark:text-foreground">
                                        {issue.name}
                                    </h3>
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                        <Layers2 className="h-5 w-5 text-primary" />
                                    </div>
                                </div>
                            </div>

                            <Separator />
                            <div className="flex items-center gap-6 flex-wrap">
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground  tracking-wide mb-2.5 block">
                                        Status
                                    </label>
                                    <StatusCommon status={issue.status} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground  tracking-wide mb-2.5 block">
                                        Priority
                                    </label>
                                    <PriorityCommon priority={issue.priority} />
                                </div>
                                {issue.due_date && (
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground  tracking-wide mb-2.5 block">
                                            Created Date
                                        </label>
                                        <div className="flex items-center gap-2 border shadow-xs px-2 text-xs font-medium py-1 rounded-sm">
                                            <span>{new Date(issue.due_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <div>
                                <label className="text-xs font-semibold text-muted-foreground  tracking-wide mb-2 block">
                                    Description
                                </label>
                                <div className="text-sm text-foreground/80 leading-relaxed">
                                    {issue.description || 'No description available'}
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                                    Tags
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {issue.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-sm border"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
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
                                <CircularProgress value={issueProgress} />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm mb-2">
                                    {issueProgress === 100 ? 'Completed!' :
                                        issueProgress >= 60 ? 'In progress!' :
                                            issueProgress >= 40 ? 'Making progress' : 'Just started'}
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    This issue is being tracked and worked on by the team.
                                    {' '}
                                    {daysRemaining > 0 ? `${daysRemaining} days remaining until deadline.` :
                                        daysRemaining === 0 ? 'Due today!' :
                                            'Issue deadline has passed.'}
                                </p>
                            </div>

                            <Separator />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-primary">
                                        {issue.reporter_id.split('_')[1]?.substring(0, 2).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Reporter</p>
                                    <p className="text-xs text-muted-foreground">ID: {issue.reporter_id}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
