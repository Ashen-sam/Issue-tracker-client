import { baseApi } from "@/store";
import type { IIssue } from "./issueApi";
export interface UserStats {
  myIssues: number;
  assignedToMe: number;
  myOpenIssues: number;
  myInProgressIssues: number;
  myResolvedIssues: number;
  myClosedIssues: number;
  assignedOpen: number;
  assignedInProgress: number;
  unresolvedAssigned: number;
}

export interface TimeBasedStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export interface BreakdownItem {
  status?: string;
  priority?: string;
  severity?: string;
  count: number;
  percentage: string;
}

export interface StatusBreakdown extends BreakdownItem {
  status: string;
}

export interface PriorityBreakdown extends BreakdownItem {
  priority: string;
}

export interface SeverityBreakdown extends BreakdownItem {
  severity: string;
}

export interface Breakdowns {
  status: StatusBreakdown[];
  priority: PriorityBreakdown[];
  severity: SeverityBreakdown[];
}

export interface IssuesByStatus {
  Open: number;
  "In Progress": number;
  Resolved: number;
  Closed: number;
}

export interface IssuesByPriority {
  Low?: number;
  Medium?: number;
  High?: number;
  Critical?: number;
}

export interface IssuesBySeverity {
  Minor?: number;
  Major?: number;
  Critical?: number;
}

export interface Charts {
  byStatus: IssuesByStatus;
  byPriority: IssuesByPriority;
  bySeverity: IssuesBySeverity;
}

export interface RecentIssues {
  myIssues: IIssue[];
  assignedToMe: IIssue[];
}

export interface DashboardData {
  userStats: UserStats;
  timeBased: TimeBasedStats;
  breakdowns: Breakdowns;
  charts: Charts;
  recentIssues: RecentIssues;
  recentActivity: IIssue[];
  highPriorityAssigned: IIssue[];
}
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardData, void>({
      query: () => "/dashboard",
      providesTags: ["Issue"],
      transformResponse: (response: DashboardData) => response,
      transformErrorResponse: (response: { status: string | number }) =>
        response,
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardQuery, useLazyGetDashboardQuery } = dashboardApi;
