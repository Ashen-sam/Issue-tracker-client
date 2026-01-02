import { useState } from "react";
import { Layers, Layers2, LayersPlus, Trash2 } from "lucide-react";
import { useNavigate, Outlet, useParams } from "react-router-dom";

import {
    InitialPage,
    IssueDialog,
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

const mockIssues: Issue[] = [
    {
        id: 1,
        title: "Login button not working",
        status: "OPEN",
        priority: "HIGH",
        createdAt: "2025-01-10",
    },
    {
        id: 2,
        title: "Dashboard loading slow",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        createdAt: "2025-01-12",
    },
    {
        id: 3,
        title: "Fix mobile navbar UI",
        status: "RESOLVED",
        priority: "LOW",
        createdAt: "2025-01-14",
    },
    {
        id: 4,
        title: "API returns 500 error",
        status: "CLOSED",
        priority: "HIGH",
        createdAt: "2025-01-15",
    },
    {
        id: 5,
        title: "Database connection timeout",
        status: "CLOSED",
        priority: "HIGH",
        createdAt: "2025-01-15",
    },
    {
        id: 6,
        title: "Email notification not sending",
        status: "CLOSED",
        priority: "HIGH",
        createdAt: "2025-01-15",
    },
    {
        id: 7,
        title: "Search functionality broken",
        status: "CLOSED",
        priority: "HIGH",
        createdAt: "2025-01-15",
    },
];

export const Issue = () => {
    const navigate = useNavigate();
    const { issueId } = useParams();
    const [isOpen, setIsOpen] = useState(false);

    // If we're viewing a specific issue, show the Outlet
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
        console.log('Edit:', item);
    };

    const handleDeleteIssue = (item: Issue) => {
        console.log('Delete:', item);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCreateIssue = (data: any) => {
        console.log('Form submitted:', data);
        setIsOpen(false);
    };

    return (
        <div className="w-full flex  items-center  flex-col relative  gap-3">
            {mockIssues.length !== 0 ? (
                <InitialPage
                    icon={Layers}
                    title="No issues yet"
                    description="Track bugs, feature requests, and improvements in one place. Create your first issue to get started."
                    actionLabel="New Issue"
                    actionIcon={LayersPlus}
                    onAction={() => setIsOpen(true)} />
            ) : (
                <>
                    <div className="absolute w-max left-0  rounded-md border border-dashed px-3 py-[5.2px] overflow-hidden">
                        <div className="relative text-lg flex items-center justify-center gap-2 text-[16px]">
                            <Layers2 size={14} /> Issues
                        </div>
                    </div>

                    <div className="w-full  relative">
                        <div className="flex items-center gap-2 absolute right-0">
                            <Button
                                size={'sm'}
                                variant={'outline'}
                                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition"
                                onClick={() => setIsOpen(true)}
                            >
                                <LayersPlus size={15} />
                                New Issue
                            </Button>
                            <Button size={'sm'} variant={'outline'} className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition">
                                <Trash2 size={15} />
                            </Button>
                        </div>
                        <CommonTable
                            data={mockIssues}
                            columns={issueTableColumns}
                            enableCheckbox={true}
                            onView={handleViewIssue}
                            onEdit={handleEditIssue}
                            onDelete={handleDeleteIssue}
                        />
                    </div>
                </>
            )}

            <IssueDialog
                open={isOpen}
                mode="create"
                title="Create Issue"
                onClose={() => setIsOpen(false)}
            >
                <IssueForm
                    mode="create"
                    onSubmit={handleCreateIssue}
                    onCancel={() => setIsOpen(false)}
                />
            </IssueDialog>
        </div>
    );
};