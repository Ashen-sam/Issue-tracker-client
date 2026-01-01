import { Layers, Layers2, LayersPlus, Trash2 } from "lucide-react";

import {
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
        id: 4,
        title: "API returns 500 error",
        status: "CLOSED",
        priority: "HIGH",
        createdAt: "2025-01-15",
    },
    {
        id: 4,
        title: "API returns 500 error",
        status: "CLOSED",
        priority: "HIGH",
        createdAt: "2025-01-15",
    },
    {
        id: 4,
        title: "API returns 500 error",
        status: "CLOSED",
        priority: "HIGH",
        createdAt: "2025-01-15",
    },
];

export const Issue = () => {
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

    return (
        <div className="w-full flex flex-col items-center gap-3">
            {mockIssues.length !== 0 ? (
                <>
                    <div className="relative w-full flex items-center justify-between rounded-sm border border-dashed px-3 py-1 overflow-hidden">
                        {/* Subtle left-to-right glow */}
                        <div
                            className="absolute inset-0 rounded-sm"
                            style={{
                                background: 'linear-gradient(to right, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)',
                            }}
                        />

                        {/* Content */}
                        <div className="relative text-lg flex items-center justify-center gap-2 text-[16px]">
                            <Layers2 size={14} /> Issues
                        </div>
                    </div>



                    <div className="w-full  rounded-sm relative">
                        <div className="flex items-center gap-2  absolute right-0">
                            <Button size={'sm'} variant={'outline'} className="inline-flex items-center gap-2 rounded-md  px-3 py-1.5 text-xs font-medium transition">
                                <LayersPlus size={15} />
                                New Issue
                            </Button>
                            <Button size={'sm'} variant={'outline'} className="inline-flex items-center gap-2 rounded-md   px-3 py-1.5 text-xs font-medium transition">
                                <Trash2 size={15} />
                            </Button>
                        </div>
                        <CommonTable
                            data={mockIssues}
                            columns={issueTableColumns}
                            enableCheckbox={true}
                            onView={(item) => console.log('View:', item)}
                            onEdit={(item) => console.log('Edit:', item)}
                            onDelete={(item) => console.log('Delete:', item)}
                        />
                    </div>
                </>

            ) : (
                <div className="flex flex-col items-center text-center pt-30 gap-4 max-w-md">
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-xl border border-dashed">
                        <div
                            className="absolute inset-0 rounded-xl bg-white opacity-30 blur-lg "
                            style={{
                                background: 'radial-gradient(circle, rgba(255,255,255,0.5) 10%, transparent 90%)',
                            }}
                        />

                        {/* Icon on top */}
                        <Layers size={40} className="relative dark:text-muted-foreground" />
                    </div>


                    <div className="text-xl font-semibold tracking-tight dark:text-muted-foreground">
                        No issues yet
                    </div>

                    <div className="text-sm text-muted-foreground px-6 leading-relaxed">
                        Track bugs, feature requests, and improvements in one
                        place. Create your first issue to get started.
                    </div>

                    <Button variant={'outline'} className="mt-2 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent transition">
                        <LayersPlus />
                        New Issue
                    </Button>
                </div>
            )}
        </div>
    );
};
