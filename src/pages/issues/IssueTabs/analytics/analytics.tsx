import { CommonLoader } from "@/common";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { useGetGeneralAnalyticsQuery } from "@/services";
import { AlertCircle, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export const Analytics = () => {
    const { data: analytics, isLoading, error, isError } = useGetGeneralAnalyticsQuery();

    const barChartData = useMemo(() => {
        if (!analytics?.breakdowns || !analytics?.charts) return [];

        const categories = new Set<string>();
        analytics.breakdowns.status?.forEach(item => categories.add(item.status));
        analytics.breakdowns.priority?.forEach(item => categories.add(item.priority));
        analytics.breakdowns.severity?.forEach(item => categories.add(item.severity));

        return Array.from(categories).map((category) => ({
            category,
            status: analytics.charts.byStatus?.[category] || 0,
            priority: analytics.charts.byPriority?.[category] || 0,
            severity: analytics.charts.bySeverity?.[category] || 0,
        }));
    }, [analytics]);

    const chartConfig = {
        status: {
            label: "Status",
            color: "#93c5fd",
        },
        priority: {
            label: "Priority",
            color: "#3b82f6",
        },
        severity: {
            label: "Severity",
            color: "#60a5fa",
        },
    } satisfies ChartConfig;

    if (isLoading) {
        return (
            <div className="w-full flex justify-center items-center min-h-100">
                <div className="flex items-center gap-2 text-sm px-3 py-[7.5px] border border-dashed rounded-md">
                    <CommonLoader />
                </div>
            </div>
        );
    }

    if (isError || !analytics) {
        return (
            <div className="w-full flex justify-center items-center min-h-100">
                <div className="text-center max-w-lg">
                    <AlertCircle size={48} className="mx-auto mb-4 text-destructive" />
                    <div className="text-lg font-medium mb-2">Unable to Load Analytics</div>
                    <div className="text-sm text-muted-foreground mb-4">
                        {isError
                            ? "There was an error loading the analytics data. Please try again later."
                            : "No analytics data is currently available. Create some issues to see analytics."}
                    </div>
                    {error && (
                        <div className="mt-4 p-4 bg-destructive/10 rounded-lg text-xs text-left">
                            <div className="font-semibold mb-2 text-destructive">Error Details:</div>
                            <pre className="overflow-auto whitespace-pre-wrap wrap-break-word">
                                {JSON.stringify(error, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const hasData = analytics.overview?.totalIssues > 0;

    if (!hasData) {
        return (
            <div className="w-full flex justify-center items-center min-h-100">
                <div className="text-center">
                    <AlertCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <div className="text-lg font-medium mb-2">No Data Available</div>
                    <div className="text-sm text-muted-foreground">
                        Create some issues to see analytics and insights
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6">


            {barChartData.length > 0 && (
                <Card className="bg-transparent rounded-md">
                    <CardHeader>
                        <CardTitle>Issue Distribution</CardTitle>
                        <CardDescription>Complete breakdown by status, priority, and severity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-75 w-full">
                            <BarChart accessibilityLayer data={barChartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="category"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tick={{ fontSize: 12 }}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dashed" />}
                                />
                                <Bar dataKey="status" fill="var(--color-status)" radius={4} />
                                <Bar dataKey="priority" fill="var(--color-priority)" radius={4} />
                                <Bar dataKey="severity" fill="var(--color-severity)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 leading-none font-medium">
                            Total of {analytics.overview.totalIssues} issues tracked <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground leading-none">
                            Showing all status, priority, and severity distributions
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};