import { baseApi } from "@/store";

// Interfaces for Analytics Data
export interface StatusBreakdownItem {
  status: string;
  count: number;
  percentage: string;
}

export interface PriorityBreakdownItem {
  priority: string;
  count: number;
  percentage: string;
}

export interface SeverityBreakdownItem {
  severity: string;
  count: number;
  percentage: string;
}

export interface TrendDataItem {
  month: string;
  count: number;
}

export interface UserActivityItem {
  userId: string;
  userName: string;
  userEmail: string;
  issuesCreated?: number;
  issuesAssigned?: number;
}

export interface GeneralAnalyticsResponse {
  overview: {
    totalIssues: number;
    openIssues: number;
    inProgressIssues: number;
    resolvedIssues: number;
    closedIssues: number;
  };
  timeBased: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
  };
  breakdowns: {
    status: StatusBreakdownItem[];
    priority: PriorityBreakdownItem[];
    severity: SeverityBreakdownItem[];
  };
  charts: {
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    bySeverity: Record<string, number>;
  };
  resolution: {
    totalResolved: number;
    avgResolutionDays: number;
    minResolutionDays: number;
    maxResolutionDays: number;
    resolutionRate: string;
  };
  userActivity: {
    topCreators: UserActivityItem[];
    topAssignees: UserActivityItem[];
  };
  trends: {
    monthlyTrend: TrendDataItem[];
  };
}

export interface UserAnalyticsResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  overview: {
    totalCreated: number;
    totalAssigned: number;
    unresolvedAssigned: number;
    createdOpen: number;
    createdInProgress: number;
    createdResolved: number;
    createdClosed: number;
    assignedOpen: number;
    assignedInProgress: number;
    assignedResolved: number;
    assignedClosed: number;
  };
  timeBased: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
  };
  createdIssues: {
    breakdowns: {
      status: StatusBreakdownItem[];
      priority: PriorityBreakdownItem[];
      severity: SeverityBreakdownItem[];
    };
    charts: {
      byStatus: Record<string, number>;
      byPriority: Record<string, number>;
      bySeverity: Record<string, number>;
    };
  };
  assignedIssues: {
    breakdowns: {
      status: StatusBreakdownItem[];
    };
    charts: {
      byStatus: Record<string, number>;
    };
  };
  resolution: {
    totalResolved: number;
    avgResolutionDays: number;
    minResolutionDays: number;
    maxResolutionDays: number;
    resolutionRate: string;
  };
  trends: {
    monthlyTrend: TrendDataItem[];
  };
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGeneralAnalytics: builder.query<GeneralAnalyticsResponse, void>({
      query: () => ({
        url: "/analytics",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
      transformErrorResponse: (response) => {
        console.error("Analytics API Error:", response);
        return response;
      },
    }),

    getUserAnalytics: builder.query<UserAnalyticsResponse, string>({
      query: (userId) => ({
        url: `/analytics/user/${userId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, userId) => [
        { type: "User", id: userId },
        "Dashboard",
      ],
      transformErrorResponse: (response) => {
        console.error("User Analytics API Error:", response);
        return response;
      },
    }),
  }),
});

export const {
  useGetGeneralAnalyticsQuery,
  useGetUserAnalyticsQuery,
  useLazyGetGeneralAnalyticsQuery,
  useLazyGetUserAnalyticsQuery,
} = analyticsApi;
