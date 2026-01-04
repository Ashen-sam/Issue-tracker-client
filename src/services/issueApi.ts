import type { IssuePriority, IssueStatus } from "@/common";
import { baseApi } from "@/store";

export type IssueSeverity = "Minor" | "Major" | "Critical";

export interface IUser {
  _id: string;
  id: string;
  name: string;
  email: string;
}

export interface IIssue {
  _id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  createdBy: IUser;
  assignedTo?: IUser;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}
export const issueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIssues: builder.query<
      {
        issues: IIssue[];
        pagination: {
          total: number;
          page: number;
          pages: number;
          limit: number;
        };
        statusCounts: Record<string, number>;
      },
      {
        status?: string;
        priority?: string;
        severity?: string;
        search?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
      }
    >({
      query: (params) => ({
        url: "/issues",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.issues.map(({ _id }) => ({
                type: "Issue" as const,
                id: _id,
              })),
              { type: "Issue", id: "LIST" },
            ]
          : [{ type: "Issue", id: "LIST" }],
    }),

    getIssue: builder.query<IIssue, string>({
      query: (id) => `/issues/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Issue", id }],
    }),

    createIssue: builder.mutation<IIssue, Partial<IIssue>>({
      query: (body) => ({
        url: "/issues",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Issue", id: "LIST" }],
    }),

    updateIssue: builder.mutation<
      IIssue,
      { id: string; body: Partial<IIssue> }
    >({
      query: ({ id, body }) => ({
        url: `/issues/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Issue", id },
        { type: "Issue", id: "LIST" },
      ],
    }),

    deleteIssue: builder.mutation<{ msg: string }, string>({
      query: (id) => ({
        url: `/issues/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Issue", id },
        { type: "Issue", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetIssuesQuery,
  useGetIssueQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
} = issueApi;
