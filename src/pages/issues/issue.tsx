import { Layers, Layers2, LayersPlus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
    InitialPage,
    IssueDialog,
    IssueDialogFooter,
    IssueForm,
    PriorityCommon,
    StatusCommon,
    type IssuePriority,
    type IssueStatus,
} from "@/common";
import { CommonTable } from "@/common/commonTable";
import { Button } from "@/components/ui/button";
import {
    useCreateIssueMutation,
    useDeleteIssueMutation,
    useGetIssuesQuery,
    useUpdateIssueMutation,
    type IIssue,
} from "../../services/issueApi";
import type { RootState } from "@/store";
export const Issue = () => {
    const navigate = useNavigate();
    const { issueId } = useParams();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const [currentFormData, setCurrentFormData] = useState(null);
    const { data: issuesData, isLoading: isLoadingIssues } = useGetIssuesQuery({});
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

    if (issueId) {
        return <Outlet />;
    }

    const issues = currentUser
        ? (issuesData?.issues || []).filter(issue => {
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
            console.log('Issue created successfully');
            setCreateOpen(false);
        } catch (error) {
            console.error('Failed to create issue:', error);
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
                }
            }).unwrap();
            setEditOpen(false);
            setCurrentIssue(null);
        } catch (error) {
            console.error('Failed to update issue:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!currentIssue) return;

        setIsLoading(true);
        try {
            await deleteIssue(currentIssue._id).unwrap();
            console.log('Issue deleted successfully');
            setDeleteOpen(false);
            setCurrentIssue(null);
        } catch (error) {
            console.error('Failed to delete issue:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        setIsLoading(true);
        try {
            await Promise.all(
                selectedIssues.map(id => deleteIssue(id).unwrap())
            );
            console.log('Bulk deleted issues successfully');
            setSelectedIssues([]);
            setBulkDeleteOpen(false);
        } catch (error) {
            console.error('Failed to bulk delete issues:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const issueTableColumns = [
        {
            key: "title",
            header: "Title",
        },
        {
            key: "status",
            header: "Status",
            render: (item: IIssue) => (
                <StatusCommon status={item.status} />
            ),
        },
        {
            key: "priority",
            header: "Priority",
            render: (item: IIssue) => (
                <PriorityCommon priority={item.priority} />
            ),
        },
        {
            key: "createdAt",
            header: "Created At",
            render: (item: IIssue) => (
                new Date(item.createdAt).toLocaleDateString()
            ),
        },
    ];

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

    if (isLoadingIssues) {
        return (
            <div className="w-full flex items-center justify-center py-8">
                <div className="text-gray-500">Loading issues...</div>
            </div>
        );
    }

    return (
        <div className="w-full flex items-center flex-col relative gap-3">
            {issues.length === 0 ? (
                <InitialPage
                    icon={Layers}
                    title="No issues yet"
                    description="Track bugs, feature requests, and improvements in one place. Create your first issue to get started."
                    actionLabel="New Issue"
                    actionIcon={LayersPlus}
                    onAction={() => setCreateOpen(true)}
                />
            ) : (
                <>
                    <div className="absolute w-max left-0 rounded-md border border-dashed px-3 py-[5.2px] overflow-hidden">
                        <div className="relative text-lg flex items-center justify-center gap-2 text-[16px]">
                            <Layers2 size={14} /> Issues
                        </div>
                    </div>

                    <div className="w-full relative">
                        <div className="flex items-center gap-2 absolute right-0">
                            <Button
                                variant={'outline'}
                                size={'sm'}
                                className="inline-flex bg-indigo-700/80 text-white
  dark:bg-indigo-500/60
  hover:bg-indigo-600/80 dark:hover:bg-indigo-400/60
  hover:text-white dark:hover:text-white items-center gap-2  px-3 py-1.5 text-xs font-medium transition"
                                onClick={() => setCreateOpen(true)}
                            >
                                <LayersPlus size={15} />
                                New Issue
                            </Button>
                            <Button
                                size={'sm'}
                                variant={'outline'}
                                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition"
                                onClick={() => setBulkDeleteOpen(true)}
                                disabled={selectedIssues.length === 0}
                            >
                                <Trash2 size={15} />
                            </Button>
                        </div>
                        <CommonTable
                            data={issues}
                            columns={issueTableColumns}
                            enableCheckbox={true}
                            onView={handleViewIssue}
                            onEdit={handleEditIssue}
                            onDelete={handleDeleteIssue}
                            onSelectionChange={handleSelectionChange}
                        />
                    </div>
                </>
            )}

            <IssueDialog
                open={createOpen}
                title="Create Issue"
                note="Add a new issue to the tracker"
                icon={<LayersPlus size={15} />}
                onClose={() => setCreateOpen(false)}
                footer={
                    <IssueDialogFooter
                        onCancel={() => setCreateOpen(false)}
                        onConfirm={() => currentFormData && handleCreate(currentFormData)}
                        confirmText="Create"
                        isLoading={isLoading}
                        formMode="add"
                    />
                }
            >
                <IssueForm
                    onFormDataChange={setCurrentFormData}
                    onSubmit={handleCreate}
                    onCancel={() => setCreateOpen(false)}
                />
            </IssueDialog>

            <IssueDialog
                open={editOpen}
                title="Edit Issue"
                note="Update the issue details"
                icon={<Pencil className="w-4 h-4" />}
                onClose={() => {
                    setEditOpen(false);
                    setCurrentIssue(null);
                }}
                footer={
                    <IssueDialogFooter
                        onCancel={() => {
                            setEditOpen(false);
                            setCurrentIssue(null);
                        }}
                        onConfirm={() => { }}
                        confirmText="Save Changes"
                        isLoading={isLoading}
                        formMode="edit"
                        enableCreateAnother={false}
                    />
                }
            >
                <IssueForm
                    initialData={currentIssue || undefined}
                    onSubmit={handleEdit}
                    onCancel={() => {
                        setEditOpen(false);
                        setCurrentIssue(null);
                    }}
                />
            </IssueDialog>

            <IssueDialog
                open={deleteOpen}
                title="Delete Issue"
                note="This action cannot be undone"
                icon={<Trash2 className="w-4 h-4" />}
                onClose={() => {
                    setDeleteOpen(false);
                    setCurrentIssue(null);
                }}
                footer={
                    <IssueDialogFooter
                        onCancel={() => {
                            setDeleteOpen(false);
                            setCurrentIssue(null);
                        }}
                        onConfirm={handleDelete}
                        confirmText="Delete"
                        isLoading={isLoading}
                        formMode="delete"
                        enableCreateAnother={false}
                    />
                }
            >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Are you sure you want to delete "<strong>{currentIssue?.title}</strong>"? This action cannot be undone.
                </div>
            </IssueDialog>

            <IssueDialog
                open={bulkDeleteOpen}
                title="Delete Multiple Issues"
                note={`Delete ${selectedIssues.length} selected issue${selectedIssues.length > 1 ? 's' : ''}`}
                icon={<Trash2 className="w-4 h-4" />}
                onClose={() => setBulkDeleteOpen(false)}
                footer={
                    <IssueDialogFooter
                        onCancel={() => setBulkDeleteOpen(false)}
                        onConfirm={handleBulkDelete}
                        confirmText="Delete All"
                        isLoading={isLoading}
                        formMode="delete"
                        enableCreateAnother={false}
                    />
                }
            >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Are you sure you want to delete <strong>{selectedIssues.length}</strong> selected issue{selectedIssues.length > 1 ? 's' : ''}? This action cannot be undone.
                </div>
            </IssueDialog>
        </div>
    );
};