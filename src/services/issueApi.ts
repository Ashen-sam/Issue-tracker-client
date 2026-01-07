import type { IssuePriority, IssueSeverity, IssueStatus } from "@/common";
import { baseApi } from "@/store";

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
  foundDate?: string;
  createdAt: string;
  updatedAt: string;
}

type IssuesQueryResponse = {
  issues: IIssue[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
  statusCounts: Record<string, number>;
};

type IssuesQueryParams = {
  status?: string;
  priority?: string;
  severity?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const issueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIssues: builder.query<IssuesQueryResponse, IssuesQueryParams>({
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
      invalidatesTags: ["Issue"],
      async onQueryStarted(newIssue, { dispatch, queryFulfilled, getState }) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const state = getState() as any;
        const currentUser = state.auth.user;

        const tempId = `temp-${Date.now()}`;
        const optimisticIssue: IIssue = {
          _id: tempId,
          title: newIssue.title || "",
          description: newIssue.description || "",
          status: newIssue.status || "Open",
          priority: newIssue.priority || "Medium",
          severity: newIssue.severity || "Minor",
          createdBy: currentUser,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const patchResults: any[] = [];

        const emptyPatch = dispatch(
          issueApi.util.updateQueryData("getIssues", {}, (draft) => {
            draft.issues.unshift(optimisticIssue);
            draft.pagination.total += 1;
          })
        );
        patchResults.push(emptyPatch);

        try {
          const { data: serverIssue } = await queryFulfilled;

          dispatch(
            issueApi.util.updateQueryData("getIssues", {}, (draft) => {
              const index = draft.issues.findIndex((i) => i._id === tempId);
              if (index !== -1) {
                draft.issues[index] = serverIssue;
              }
            })
          );
        } catch {
          patchResults.forEach((patch) => patch.undo());
        }
      },
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

      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        const now = new Date().toISOString();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const patchResults: any[] = [];

        const listPatch = dispatch(
          issueApi.util.updateQueryData("getIssues", {}, (draft) => {
            const issue = draft.issues.find((i) => i._id === id);
            if (issue) {
              Object.assign(issue, body);
              issue.updatedAt = now;
            }
          })
        );
        patchResults.push(listPatch);

        const singlePatch = dispatch(
          issueApi.util.updateQueryData("getIssue", id, (draft) => {
            Object.assign(draft, body);
            draft.updatedAt = now;
          })
        );
        patchResults.push(singlePatch);

        try {
          const { data: serverIssue } = await queryFulfilled;

          dispatch(
            issueApi.util.updateQueryData("getIssues", {}, (draft) => {
              const issue = draft.issues.find((i) => i._id === id);
              if (issue) {
                Object.assign(issue, serverIssue);
              }
            })
          );

          dispatch(
            issueApi.util.updateQueryData("getIssue", id, (draft) => {
              Object.assign(draft, serverIssue);
            })
          );
        } catch {
          patchResults.forEach((patch) => patch.undo());
        }
      },
    }),

    deleteIssue: builder.mutation<{ msg: string }, string>({
      query: (id) => ({
        url: `/issues/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Issue"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const patchResults: any[] = [];

        const listPatch = dispatch(
          issueApi.util.updateQueryData("getIssues", {}, (draft) => {
            draft.issues = draft.issues.filter((issue) => issue._id !== id);
            draft.pagination.total -= 1;
          })
        );
        patchResults.push(listPatch);

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patch) => patch.undo());
        }
      },
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
