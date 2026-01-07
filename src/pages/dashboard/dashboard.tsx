import { CommonLoader, InitialPage, PriorityCommon, SeverityCommon, StatusCommon } from "@/common";
import { InteractivePieChart } from "@/common/InteractivePieChart";
import { Card, CardContent } from "@/components/ui/card";
import { useGetDashboardQuery } from "@/services/dashboardApi";
import { AlertCircle, Bug, CheckCircle2, Clock, Home, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";

const COLORS = {
    status: {
        Open: "#3b82f6",
        "In Progress": "#f59e0b",
        Resolved: "#10b981",
        Closed: "#6b7280"
    },
    priority: {
        Low: "#10b981",
        Medium: "#f59e0b",
        High: "#ef4444",
        Critical: "#dc2626"
    },
    severity: {
        Minor: "#3b82f6",
        Major: "#f59e0b",
        Critical: "#ef4444"
    }
};

export const Dashboard = () => {
    const [, setCreateOpen] = useState(false);
    const { data: dashboardData, isLoading, isError } = useGetDashboardQuery();

    if (isLoading) {
        return (
            <div className="w-full flex justify-center items-center min-h-100">
                <div className="flex items-center gap-2 text-sm px-3 py-2 border border-dashed rounded-md">
                    <CommonLoader />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <div className="flex items-center gap-2 text-sm px-3 py-2 border border-dashed rounded-md w-fit mb-4">
                    <Home size={14} /> Home
                </div>
                <Card className="shadow-none rounded-sm dark:bg-[#1a1a1a] border">
                    <CardContent className="flex items-center gap-3 text-destructive p-4">
                        <AlertCircle className="h-5 w-5" />
                        <span>Failed to load dashboard data</span>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const stats = [
        {
            label: "In Progress",
            value: dashboardData?.userStats.myInProgressIssues || 0,
            icon: Clock,
        },
        {
            label: "Resolved",
            value: dashboardData?.userStats.myResolvedIssues || 0,
            icon: CheckCircle2,
        },
        {
            label: "Total Issues",
            value: dashboardData?.userStats.myIssues || 0,
            icon: TrendingUp,
        },
    ];

    const recentIssues = [
        ...(dashboardData?.recentIssues.myIssues || []),
        ...(dashboardData?.recentIssues.assignedToMe || []),
    ]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
        .slice(0, 5);

    const hasNoIssues = dashboardData?.userStats.myIssues === 0;

    const statusPieData = Object.entries(dashboardData?.charts.byStatus || {}).map(([status, count]) => ({
        label: status,
        value: count,
        color: COLORS.status[status as keyof typeof COLORS.status]
    }));


    if (hasNoIssues) {
        return (
            <div className="w-full flex items-center justify-center">
                <InitialPage
                    actionLink="/issues"
                    icon={Bug}
                    title="Welcome to Bug Track"
                    description="Track bugs, feature requests, and improvements in one place. Create your first issue to get started."
                    actionLabel="New Issue"
                    actionIcon={Plus}
                    onAction={() => setCreateOpen(true)}
                />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-2 text-sm px-3 py-2 border border-dashed rounded-md w-fit mb-4">
                <Home size={14} /> Home
            </div>

            <div className="space-y-4">
                {/* Stats Grid */}
                <div className="grid gap-4 lg:grid-cols-3">
                    {stats.map((stat, index) => (
                        <Card key={index} className="shadow-none p-0 rounded-sm dark:bg-[#1a1a1a] border">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-semibold text-muted-foreground  tracking-wide mb-1">
                                            {stat.label}
                                        </div>
                                        <div className="text-2xl font-bold text-gray-700 dark:text-foreground">
                                            {stat.value}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center relative w-10 h-10 rounded-lg border border-dashed ">
                                        <stat.icon className=" text-primary" />
                                        <div
                                            className="absolute inset-0 rounded-xl bg-white opacity-30 blur-lg"
                                            style={{
                                                background: 'radial-gradient(circle, rgba(255,255,255,0.5) 70%, transparent 20%)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <InteractivePieChart
                        data={statusPieData}
                        title="Issues by Status"
                        centerLabel="Issues"
                        className="shadow-none rounded-sm dark:bg-[#1a1a1a] border"
                    />
                    {/* Recent Issues */}
                    <div className="shadow-none p-3 rounded-sm dark:bg-[#1a1a1a] border">
                        <div className="text-sm font-semibold ">Recent Issues</div>
                        <div className="p-2">
                            {recentIssues.length > 0 ? (
                                <div className=" ">
                                    {recentIssues.map((issue) => (
                                        <div key={issue._id} className=" border-b py-2   last:border-b-0 last:pb-0">
                                            <div className=" items-start gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm text-foreground/90 p-2 line-clamp-2">
                                                        {issue.title}
                                                    </div>
                                                    {issue?.assignedTo?.name && (
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            Assigned to {issue.assignedTo?.name}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <PriorityCommon priority={issue.priority} className="border " />
                                                    <StatusCommon status={issue.status} className="border" />
                                                    <SeverityCommon severity={issue.severity} className="border" />
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No recent issues found
                                </div>
                            )}
                        </div>
                    </div>
                    <div className=" gap-4 ">
                        <Card className="shadow-none rounded-sm pt-0 dark:bg-[#1a1a1a] border">
                            <div className="p-4 pb-2">
                                <div className="text-sm font-semibold">Recent Activity</div>
                            </div>
                            <CardContent className="p-4 pt-2">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between pb-3 border-b">
                                        <span className="text-sm text-muted-foreground">Today</span>
                                        <span className="text-lg font-bold text-gray-700 dark:text-foreground">
                                            {dashboardData?.timeBased.today || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pb-3 border-b">
                                        <span className="text-sm text-muted-foreground">This Week</span>
                                        <span className="text-lg font-bold text-gray-700 dark:text-foreground">
                                            {dashboardData?.timeBased.thisWeek || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">This Month</span>
                                        <span className="text-lg font-bold text-gray-700 dark:text-foreground">
                                            {dashboardData?.timeBased.thisMonth || 0}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}