import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import {
  type IssuePriority,
  type IssueSeverity,
  type IssueStatus,
} from "@/common";
import {
  useCreateIssueMutation,
  useDeleteIssueMutation,
  useGetIssuesQuery,
  useUpdateIssueMutation,
  type IIssue,
} from "../services/issueApi";
import type { RootState } from "@/store";

interface IssueFormData {
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  createdAt?: string;
}

export const useIssues = () => {
  const navigate = useNavigate();
  const { issueId } = useParams();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [currentFormData, setCurrentFormData] = useState<IssueFormData | null>(
    null
  );
  const EMPTY_PARAMS = {};
  const {
    data: issuesData,
    isLoading: isLoadingIssues,
    error: issuesError,
  } = useGetIssuesQuery(EMPTY_PARAMS);

  const [createIssue] = useCreateIssueMutation();
  const [updateIssue] = useUpdateIssueMutation();
  const [deleteIssue] = useDeleteIssueMutation();

  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [currentIssue, setCurrentIssue] = useState<IIssue | null>(null);

  // Filter issues for current user
  const issues = currentUser
    ? (issuesData?.issues || []).filter((issue) => {
        const creatorId = issue.createdBy?._id || issue.createdBy?.id;
        return creatorId === currentUser.id;
      })
    : [];

  // Show error toast if issues failed to load
  if (issuesError) {
    toast.error("Failed to load issues", {
      description: "Please refresh the page to try again.",
    });
  }

  const handleCreate = async (formData: IssueFormData) => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.severity.trim()) {
      toast.error("severity is required");
      return;
    }
    setCreateOpen(false);
    setCurrentFormData(null);

    toast.success("Issue created", {
      description: `"${formData.title}" has been added.`,
    });

    try {
      await createIssue({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        severity: formData.severity,
        priority: formData.priority,
      }).unwrap();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Failed to create issue", {
        description: error?.data?.message || "Something went wrong",
      });
    }
  };

  const handleEdit = async (formData: IssueFormData) => {
    if (!currentIssue) {
      toast.error("No issue selected");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.severity.trim()) {
      toast.error("severity is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    setEditOpen(false);
    setCurrentIssue(null);
    setCurrentFormData(null);

    toast.success("Issue updated", {
      description: `"${formData.title}" has been updated.`,
    });

    try {
      await updateIssue({
        id: currentIssue._id,
        body: {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          severity: formData.severity,
          priority: formData.priority,
        },
      }).unwrap();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Failed to update issue", {
        description: error?.data?.message || "Something went wrong",
      });
    }
  };

  const handleDelete = async () => {
    if (!currentIssue) {
      toast.error("No issue selected");
      return;
    }

    const issueTitle = currentIssue.title;
    const issueIdToDelete = currentIssue._id;
    setDeleteOpen(false);
    setCurrentIssue(null);

    toast.success("Issue deleted", {
      description: `"${issueTitle}" has been removed.`,
    });

    if (issueId === issueIdToDelete) {
      navigate("/issues");
    }

    try {
      await deleteIssue(issueIdToDelete).unwrap();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Failed to delete issue", {
        description: error?.data?.message || "Something went wrong",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIssues.length === 0) {
      toast.error("No issues selected");
      return;
    }

    const deleteCount = selectedIssues.length;
    const issuesToDelete = [...selectedIssues];

    setBulkDeleteOpen(false);
    setSelectedIssues([]);

    toast.success(`${deleteCount} issue${deleteCount > 1 ? "s" : ""} deleted`, {
      description: "The selected issues have been removed.",
    });

    if (issueId && issuesToDelete.includes(issueId)) {
      navigate("/issues");
    }

    try {
      const deletePromises = issuesToDelete.map((id) =>
        deleteIssue(id).unwrap()
      );
      await Promise.all(deletePromises);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Failed to delete issues", {
        description: error?.data?.message || "Something went wrong",
      });
    }
  };

  const handleViewIssue = (item: IIssue) => {
    navigate(`/issues/${item._id}`);
  };

  const handleEditIssue = (item: IIssue) => {
    setCurrentIssue(item);
    setCurrentFormData({
      title: item.title,
      description: item.description,
      status: item.status,
      severity: item.severity,
      priority: item.priority,
    });
    setEditOpen(true);
  };

  const handleDeleteIssue = (item: IIssue) => {
    setCurrentIssue(item);
    setDeleteOpen(true);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedIssues(selectedIds);
  };

  const handleOpenCreate = () => {
    setCurrentFormData(null);
    setCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setCreateOpen(false);
    setCurrentFormData(null);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setCurrentIssue(null);
    setCurrentFormData(null);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setCurrentIssue(null);
  };

  const handleCloseBulkDelete = () => {
    setBulkDeleteOpen(false);
  };

  return {
    issueId,
    issues,
    isLoadingIssues,
    currentFormData,
    setCurrentFormData,
    selectedIssues,
    currentIssue,
    createOpen,
    editOpen,
    deleteOpen,
    bulkDeleteOpen,
    setCreateOpen,
    setEditOpen,
    setDeleteOpen,
    setBulkDeleteOpen,
    handleOpenCreate,
    handleCloseCreate,
    handleCloseEdit,
    handleCloseDelete,
    handleCloseBulkDelete,
    handleCreate,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    handleViewIssue,
    handleEditIssue,
    handleDeleteIssue,
    handleSelectionChange,
    setCurrentIssue,
    setSelectedIssues,
  };
};
