import { Layers, Layers2, LayersPlus, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

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

interface Issue {
    id: number;
    title: string;
    description?: string;
    status: IssueStatus;
    priority: IssuePriority;
    createdAt: string;
}

const initialMockIssues: Issue[] = [
    {
        id: 1,
        title: "Login button not working",
        description: "Users unable to click the login button on mobile devices",
        status: "OPEN",
        priority: "HIGH",
        createdAt: "2025-01-10",
    },
    {
        id: 2,
        title: "Dashboard loading slow",
        description: "Dashboard takes more than 5 seconds to load",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        createdAt: "2025-01-12",
    },
    {
        id: 3,
        title: "Fix mobile navbar UI",
        description: "Mobile navigation menu is not responsive",
        status: "RESOLVED",
        priority: "LOW",
        createdAt: "2025-01-14",
    },
    {
        id: 4,
        title: "API returns 500 error",
        description: "Server error when fetching user data",
        status: "CLOSED",
        priority: "HIGH",
        createdAt: "2025-01-15",
    },
    {
        id: 5,
        title: "Database connection timeout",
        description: "Connection timeout after 30 seconds",
        status: "CLOSED",
        priority: "HIGH",
        createdAt: "2025-01-15",
    },
    {
        id: 6,
        title: "Email notification not sending",
        description: "Password reset emails not being delivered",
        status: "CLOSED",
        priority: "HIGH",
        createdAt: "2025-01-15",
    },
    {
        id: 7,
        title: "Search functionality broken",
        description: "Search returns no results for valid queries",
        status: "CLOSED",
        priority: "HIGH",
        createdAt: "2025-01-15",
    },
];

export const Issue = () => {
    const navigate = useNavigate();
    const { issueId } = useParams();

    const [issues, setIssues] = useState<Issue[]>(initialMockIssues);
    const [selectedIssues, setSelectedIssues] = useState<number[]>([]);

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

    const [currentIssue, setCurrentIssue] = useState<Issue | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // If we're viewing a specific issue, show the Outlet
    if (issueId) {
        return <Outlet />;
    }

    const handleCreate = (formData: {
        title: string;
        description: string;
        status: IssueStatus;
        priority: IssuePriority;
        createdAt: string;
    }) => {
        setIsLoading(true);
        setTimeout(() => {
            const newIssue: Issue = {
                id: Math.max(...issues.map(i => i.id), 0) + 1,
                ...formData,
            };
            setIssues(prev => [newIssue, ...prev]);
            console.log('Issue created:', newIssue);
            setIsLoading(false);
            setCreateOpen(false);
        }, 1000);
    };

    const handleCreateAnother = (formData: {
        title: string;
        description: string;
        status: IssueStatus;
        priority: IssuePriority;
        createdAt: string;
    }) => {
        setIsLoading(true);
        setTimeout(() => {
            const newIssue: Issue = {
                id: Math.max(...issues.map(i => i.id), 0) + 1,
                ...formData,
            };
            setIssues(prev => [newIssue, ...prev]);
            console.log('Issue created, ready for another:', newIssue);
            setIsLoading(false);
            // Don't close dialog, just reset loading state
        }, 1000);
    };

    const handleEdit = (formData: {
        title: string;
        description: string;
        status: IssueStatus;
        priority: IssuePriority;
        createdAt: string;
    }) => {
        if (!currentIssue) return;

        setIsLoading(true);
        setTimeout(() => {
            setIssues(prev => prev.map(issue =>
                issue.id === currentIssue.id
                    ? { ...issue, ...formData }
                    : issue
            ));
            console.log('Issue edited:', { ...currentIssue, ...formData });
            setIsLoading(false);
            setEditOpen(false);
            setCurrentIssue(null);
        }, 1000);
    };

    const handleDelete = () => {
        if (!currentIssue) return;

        setIsLoading(true);
        setTimeout(() => {
            setIssues(prev => prev.filter(issue => issue.id !== currentIssue.id));
            console.log('Issue deleted:', currentIssue);
            setIsLoading(false);
            setDeleteOpen(false);
            setCurrentIssue(null);
        }, 1000);
    };

    const handleBulkDelete = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIssues(prev => prev.filter(issue => !selectedIssues.includes(issue.id)));
            console.log('Bulk deleted issues:', selectedIssues);
            setSelectedIssues([]);
            setIsLoading(false);
            setBulkDeleteOpen(false);
        }, 1000);
    };

    const issueTableColumns = [
        {
            key: "title",
            header: "Title",
        },
        {
            key: "status",
            header: "Status",
            render: (item: Issue) => (
                <StatusCommon status={item.status} />
            ),
        },
        {
            key: "priority",
            header: "Priority",
            render: (item: Issue) => (
                <PriorityCommon priority={item.priority} />
            ),
        },
        {
            key: "createdAt",
            header: "Created At",
        },
    ];

    const handleViewIssue = (item: Issue) => {
        navigate(`/issues/${item.id}`);
    };

    const handleEditIssue = (item: Issue) => {
        setCurrentIssue(item);
        setEditOpen(true);
    };

    const handleDeleteIssue = (item: Issue) => {
        setCurrentIssue(item);
        setDeleteOpen(true);
    };

    const handleSelectionChange = (selectedIds: number[]) => {
        setSelectedIssues(selectedIds);
    };

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
                                size={'sm'}
                                variant={'outline'}
                                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition"
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
                icon={<Plus size={15} />}
                onClose={() => setCreateOpen(false)}
                footer={
                    <IssueDialogFooter
                        onCancel={() => setCreateOpen(false)}
                        onConfirm={handleCreate}
                        onConfirmAndCreateAnother={handleCreateAnother}
                        confirmText="Create"
                        isLoading={isLoading}
                        formMode="add"
                    />
                }
            >
                <IssueForm
                    onSubmit={handleCreate}
                    onCancel={() => setCreateOpen(false)}
                />
            </IssueDialog>

            {/* Edit Dialog */}
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
                        onConfirm={handleEdit}
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

            {/* Delete Single Issue Dialog */}
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