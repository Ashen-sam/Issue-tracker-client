import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import { type IssuePriority, type IssueStatus } from "@/common";
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
  createdAt?: string;
}

export const useIssues = () => {
  const navigate = useNavigate();
  const { issueId } = useParams();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [currentFormData, setCurrentFormData] = useState<IssueFormData | null>(
    null
  );

  const {
    data: issuesData,
    isLoading: isLoadingIssues,
    error: issuesError,
  } = useGetIssuesQuery({});

  const [createIssue] = useCreateIssueMutation();
  const [updateIssue] = useUpdateIssueMutation();
  const [deleteIssue] = useDeleteIssueMutation();

  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [currentIssue, setCurrentIssue] = useState<IIssue | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      toast.error("Title is required", {
        description: "Please enter a title for the issue.",
      });
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Creating issue...");

    try {
      const result = await createIssue({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
      }).unwrap();

      toast.success("Issue created successfully", {
        id: toastId,
        description: `"${formData.title}" has been added to your issues.`,
      });

      setCreateOpen(false);
      setCurrentFormData(null);

      return result;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred";

      toast.error("Failed to create issue", {
        id: toastId,
        description: errorMessage,
      });

      console.error("Failed to create issue:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (formData: IssueFormData) => {
    if (!currentIssue) {
      toast.error("No issue selected", {
        description: "Please select an issue to edit.",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title is required", {
        description: "Please enter a title for the issue.",
      });
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Updating issue...");

    try {
      await updateIssue({
        id: currentIssue._id,
        body: {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
        },
      }).unwrap();

      toast.success("Issue updated successfully", {
        id: toastId,
        description: `"${formData.title}" has been updated.`,
      });

      setEditOpen(false);
      setCurrentIssue(null);
      setCurrentFormData(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred";

      toast.error("Failed to update issue", {
        id: toastId,
        description: errorMessage,
      });

      console.error("Failed to update issue:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentIssue) {
      toast.error("No issue selected", {
        description: "Please select an issue to delete.",
      });
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Deleting issue...");

    try {
      await deleteIssue(currentIssue._id).unwrap();

      toast.success("Issue deleted successfully", {
        id: toastId,
        description: `"${currentIssue.title}" has been removed.`,
      });

      setDeleteOpen(false);
      setCurrentIssue(null);

      // Navigate away if viewing the deleted issue
      if (issueId === currentIssue._id) {
        navigate("/issues");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred";

      toast.error("Failed to delete issue", {
        id: toastId,
        description: errorMessage,
      });

      console.error("Failed to delete issue:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIssues.length === 0) {
      toast.error("No issues selected", {
        description: "Please select at least one issue to delete.",
      });
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading(
      `Deleting ${selectedIssues.length} issue${
        selectedIssues.length > 1 ? "s" : ""
      }...`
    );

    try {
      const deletePromises = selectedIssues.map((id) =>
        deleteIssue(id).unwrap()
      );
      await Promise.all(deletePromises);

      toast.success(
        `${selectedIssues.length} issue${
          selectedIssues.length > 1 ? "s" : ""
        } deleted successfully`,
        {
          id: toastId,
          description: "The selected issues have been removed.",
        }
      );

      setSelectedIssues([]);
      setBulkDeleteOpen(false);

      if (issueId && selectedIssues.includes(issueId)) {
        navigate("/issues");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "An unexpected error occurred";

      toast.error("Failed to delete issues", {
        id: toastId,
        description: errorMessage,
      });

      console.error("Failed to bulk delete issues:", error);
      throw error;
    } finally {
      setIsLoading(false);
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
    isLoading,
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
