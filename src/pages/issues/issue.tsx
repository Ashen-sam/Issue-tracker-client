import { Layers, Layers2, LayersPlus, Pencil, Trash2, Upload } from "lucide-react";
import { Outlet } from "react-router-dom";
import {
    CommonLoader,
    InitialPage,
    IssueDialog,
    IssueDialogFooter,
    IssueForm,
    PriorityCommon,
    SeverityCommon,
    StatusCommon,
} from "@/common";
import { CommonTable } from "@/common/commonTable";
import { Button } from "@/components/ui/button";
import { useIssues } from "@/hooks";
import type { IIssue } from "@/services/issueApi";

export const Issue = () => {
    const {
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
        handleCreate,
        handleEdit,
        handleDelete,
        handleBulkDelete,
        handleViewIssue,
        handleExportCSV,
        handleEditIssue,
        handleDeleteIssue,
        handleSelectionChange,
    } = useIssues();

    if (issueId) {
        return <Outlet />;
    }

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
            key: "severity",
            header: "severity",
            render: (item: IIssue) => (
                <SeverityCommon severity={item.severity} />
            ),
        },
        {
            key: "Found date",
            header: "Found date",
            render: (item: IIssue) => (
                item.foundDate
                    ? new Date(item.foundDate).toLocaleDateString()
                    : 'loading...'
            ),
        },
    ];

    if (isLoadingIssues) {
        return (
            <div className="w-full  flex justify-center items-center min-h-100">
                <div className="flex items-center gap-2 text-sm px-3 py-[7.5px] border border-dashed rounded-md w-fit">
                    <CommonLoader />
                </div>
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
                                className="inline-flex text-white  dark:bg-indigo-500/60 bg-indigo-700/80
  hover:bg-indigo-600/80 dark:hover:bg-indigo-400/60
  hover:text-white dark:hover:text-white 
         items-center gap-2  px-3 py-1.5 text-xs font-medium transition"
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

                            <Button
                                size={'sm'}
                                variant={'outline'}
                                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition"
                                onClick={handleExportCSV}
                                disabled={selectedIssues.length === 0}
                            >
                                <Upload size={15} />
                                {selectedIssues.length > 0 && `(${selectedIssues.length})`}
                            </Button>
                        </div>
                        <CommonTable
                            data={issues}
                            columns={issueTableColumns}
                            enableCheckbox={true}
                            statusKey="status"
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
                        isLoading={false}
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
                        onConfirm={() => currentFormData && handleEdit(currentFormData)}
                        confirmText="Save Changes"
                        isLoading={false}
                        formMode="edit"
                        enableCreateAnother={false}
                    />
                }
            >
                <IssueForm
                    initialData={currentIssue || undefined}
                    onFormDataChange={setCurrentFormData}
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
                        isLoading={false}
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
                        isLoading={false}
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