import { PriorityCommon, StatusCommon } from "@/common";
import { Card, CardContent } from "@/components/ui/card";
import { useGetDashboardQuery } from "@/services/dashboardApi";
import { CheckCircle2, Clock, Home, TrendingUp, AlertCircle } from "lucide-react";

export const Dashboard = () => {
    const { data: dashboardData, isLoading, isError } = useGetDashboardQuery();

    if (isLoading) {
        return (
            <div className="">
                <div className="flex items-center gap-2 text-sm px-3 py-[7.5px] border border-dashed rounded-md w-fit">
                    <Home size={14} /> Home
                </div>

            </div>
        );
    }

    if (isError) {
        return (
            <div className="">
                <div className="flex items-center gap-2 text-sm px-3 py-[7.5px] border border-dashed rounded-md w-fit">
                    <Home size={14} /> Home
                </div>
                <div className="flex items-center justify-center mt-8">
                    <Card className="shadow-none rounded-sm dark:bg-[#1a1a1a] border p-0">
                        <CardContent className="flex items-center gap-3 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            <span>Failed to load dashboard data</span>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: "In Progress",
            value: dashboardData?.userStats.myInProgressIssues || 0,
            icon: Clock,
            trend: `${dashboardData?.timeBased.today || 0} updated today`,
        },
        {
            label: "Resolved",
            value: dashboardData?.userStats.myResolvedIssues || 0,
            icon: CheckCircle2,
            trend: `+${dashboardData?.timeBased.thisWeek || 0} this week`,
        },
        {
            label: "Total Issues",
            value: dashboardData?.userStats.myIssues || 0,
            icon: TrendingUp,
            trend: "All time",
        },
    ];

    const recentIssues = [
        ...(dashboardData?.recentIssues.myIssues || []),
        ...(dashboardData?.recentIssues.assignedToMe || []),
    ]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
        .slice(0, 4);

    return (
        <div className="">
            <div className="flex items-center gap-2 text-sm px-3 py-[7.5px] border border-dashed rounded-md w-fit">
                <Home size={14} /> Home
            </div>
            <div className="flex flex-col gap-3 mt-4.5">
                <div className="grid gap-6 lg:grid-cols-3">
                    {stats.map((stat, index) => (
                        <Card key={index} className="shadow-none p-0 rounded-sm dark:bg-[#1a1a1a] border">
                            <CardContent className="space-y-5">
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground tracking-wide mb-2 block">
                                        {stat.label}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <div className="text-lg font-bold text-gray-700 dark:text-foreground">
                                            {stat.value}
                                        </div>
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                            <stat.icon className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="shadow-none rounded-sm dark:bg-[#1a1a1a] border p-0">
                    <CardContent className="space-y-4">
                        {recentIssues.length > 0 ? (
                            recentIssues.map((issue) => (
                                <div key={issue._id} className="border-b py-2">
                                    <div className="space-y-2 flex">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <PriorityCommon priority={issue.priority} className="border shadow-xs" />
                                            <StatusCommon status={issue.status} className="border shadow-xs" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-foreground/80 leading-relaxed">
                                                {issue.title}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No recent issues found
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};