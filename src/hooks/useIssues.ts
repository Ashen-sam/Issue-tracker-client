import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { type IssuePriority, type IssueStatus } from "@/common";
import {
  useCreateIssueMutation,
  useDeleteIssueMutation,
  useGetIssuesQuery,
  useUpdateIssueMutation,
  type IIssue,
} from "../services/issueApi";
import type { RootState } from "@/store";

export const useIssues = () => {
  const navigate = useNavigate();
  const { issueId } = useParams();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [currentFormData, setCurrentFormData] = useState(null);
  const { data: issuesData, isLoading: isLoadingIssues } = useGetIssuesQuery(
    {}
  );
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

  const issues = currentUser
    ? (issuesData?.issues || []).filter((issue) => {
        const creatorId = issue.createdBy?._id || issue.createdBy?.id;
        return creatorId === currentUser.id;
      })
    : [];

  const handleCreate = async (formData: {
    title: string;
    description: string;
    status: IssueStatus;
    priority: IssuePriority;
    createdAt: string;
  }) => {
    setIsLoading(true);
    try {
      await createIssue({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
      }).unwrap();
      console.log("Issue created successfully");
      setCreateOpen(false);
    } catch (error) {
      console.error("Failed to create issue:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (formData: {
    title: string;
    description: string;
    status: IssueStatus;
    priority: IssuePriority;
    createdAt: string;
  }) => {
    if (!currentIssue) return;

    setIsLoading(true);
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
      setEditOpen(false);
      setCurrentIssue(null);
    } catch (error) {
      console.error("Failed to update issue:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentIssue) return;

    setIsLoading(true);
    try {
      await deleteIssue(currentIssue._id).unwrap();
      console.log("Issue deleted successfully");
      setDeleteOpen(false);
      setCurrentIssue(null);
    } catch (error) {
      console.error("Failed to delete issue:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsLoading(true);
    try {
      await Promise.all(selectedIssues.map((id) => deleteIssue(id).unwrap()));
      console.log("Bulk deleted issues successfully");
      setSelectedIssues([]);
      setBulkDeleteOpen(false);
    } catch (error) {
      console.error("Failed to bulk delete issues:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewIssue = (item: IIssue) => {
    navigate(`/issues/${item._id}`);
  };

  const handleEditIssue = (item: IIssue) => {
    setCurrentIssue(item);
    setEditOpen(true);
  };

  const handleDeleteIssue = (item: IIssue) => {
    setCurrentIssue(item);
    setDeleteOpen(true);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedIssues(selectedIds);
  };

  return {
    issueId,
    issues,
    isLoadingIssues,
    currentFormData,
    setCurrentFormData,
    selectedIssues,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    bulkDeleteOpen,
    setBulkDeleteOpen,
    currentIssue,
    setCurrentIssue,
    isLoading,
    handleCreate,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    handleViewIssue,
    handleEditIssue,
    handleDeleteIssue,
    handleSelectionChange,
  };
};
