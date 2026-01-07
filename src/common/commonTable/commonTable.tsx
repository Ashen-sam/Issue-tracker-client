import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Bolt,
    ChevronLeft,
    ChevronRight,
    ListFilter,
    MoreHorizontal,
    Pencil,
    Search,
    Trash2
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
    width?: string;
    filterable?: boolean;
}

interface CommonTableProps<T> {
    data: T[];
    columns: Column<T>[];
    emptyMessage?: string;
    className?: string;
    onView?: (item: T) => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    enableCheckbox?: boolean;
    onSelectionChange?: (selectedIds: string[]) => void;
    statusKey?: keyof T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CommonTable = <T extends { _id: string } & Record<string, any>>({
    data,
    columns,
    emptyMessage = 'No data available',
    className = '',
    onView,
    onEdit,
    onDelete,
    enableCheckbox = false,
    onSelectionChange,
    statusKey = 'status' as keyof T,
}: CommonTableProps<T>) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [openPopover, setOpenPopover] = useState<string | null>(null);
    const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
    const [filterOpen, setFilterOpen] = useState(false);

    const getCellValue = (item: T, column: Column<T>) => {
        if (column.render) return column.render(item);
        return item[column.key as keyof T];
    };

    // Extract unique statuses from data
    const availableStatuses = useMemo(() => {
        const statuses = new Set<string>();
        data.forEach(item => {
            const status = item[statusKey];
            if (status) {
                statuses.add(String(status));
            }
        });
        return Array.from(statuses).sort();
    }, [data, statusKey]);

    const filteredData = useMemo(() => {
        let filtered = data;

        if (selectedStatuses.size > 0) {
            filtered = filtered.filter(item => {
                const itemStatus = String(item[statusKey]);
                return selectedStatuses.has(itemStatus);
            });
        }

        if (searchTerm) {
            filtered = filtered.filter((item) =>
                columns.some((column) => {
                    if (column.filterable === false) return false;
                    const value = getCellValue(item, column);
                    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
                })
            );
        }

        return filtered;
    }, [data, searchTerm, columns, selectedStatuses, statusKey]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = new Set(paginatedData.map(item => item._id));
            setSelectedRows(allIds);
            if (onSelectionChange) {
                onSelectionChange(Array.from(allIds));
            }
        } else {
            setSelectedRows(new Set());
            if (onSelectionChange) {
                onSelectionChange([]);
            }
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        const newSelected = new Set(selectedRows);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedRows(newSelected);

        if (onSelectionChange) {
            onSelectionChange(Array.from(newSelected));
        }
    };

    const isAllSelected = paginatedData.length > 0 &&
        paginatedData.every(item => selectedRows.has(item._id));

    const handleAction = (action: 'view' | 'edit' | 'delete', item: T) => {
        setOpenPopover(null);
        if (action === 'view' && onView) onView(item);
        if (action === 'edit' && onEdit) onEdit(item);
        if (action === 'delete' && onDelete) onDelete(item);
    };

    const handleStatusToggle = (status: string) => {
        const newStatuses = new Set(selectedStatuses);
        if (newStatuses.has(status)) {
            newStatuses.delete(status);
        } else {
            newStatuses.add(status);
        }
        setSelectedStatuses(newStatuses);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSelectedStatuses(new Set());
        setCurrentPage(1);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center gap-2 ml-25">
                <div className="relative flex-1 max-w-58">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-10 rounded-md"
                    />
                </div>
                <div className='flex items-center gap-2'>
                    <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ListFilter size={18} />
                                {selectedStatuses.size > 0 && (
                                    <span className="text-xs bg-blue-500 text-white rounded-full px-2 py-0.5">
                                        {selectedStatuses.size}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-3" align="end">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-sm">Filter by Status</h4>
                                    {selectedStatuses.size > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearFilters}
                                            className="h-auto py-1 px-2 text-xs"
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {availableStatuses.length === 0 ? (
                                        <p className="text-sm text-gray-500">No statuses available</p>
                                    ) : (
                                        availableStatuses.map((status) => (
                                            <div key={status} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`status-${status}`}
                                                    checked={selectedStatuses.has(status)}
                                                    onCheckedChange={() => handleStatusToggle(status)}
                                                />
                                                <label
                                                    htmlFor={`status-${status}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {status}
                                                </label>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="rounded-md overflow-x-auto border">
                <Table className="w-full min-w-150 table-auto">
                    <TableHeader className="border-b border-gray-700 ">
                        <TableRow>
                            {enableCheckbox && (
                                <TableHead className="w-12 px-4 py-3">
                                    <Checkbox
                                        checked={isAllSelected}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                            )}
                            {columns.map((column, index) => (
                                <TableHead
                                    key={index}
                                    className="text-left text-xs font-semibold dark:text-gray-400 text-zinc-700 tracking-wider px-4 py-3"
                                    style={column.width ? { width: column.width } : undefined}
                                >
                                    {column.header}
                                </TableHead>
                            ))}
                            {(onView || onEdit || onDelete) && (
                                <TableHead className="w-16 px-4 text-xs py-3 dark:text-gray-400 text-zinc-700 text-center">
                                    Actions
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (enableCheckbox ? 1 : 0) + (onView || onEdit || onDelete ? 1 : 0)}
                                    className="text-center text-gray-500 py-8 text-sm"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((item) => (
                                <TableRow
                                    key={item._id}
                                    className="text-sm border-b hover:dark:bg-zinc-800/20 transition-colors"
                                >
                                    {enableCheckbox && (
                                        <TableCell className="px-4 py-3">
                                            <Checkbox
                                                checked={selectedRows.has(item._id)}
                                                onCheckedChange={(checked) =>
                                                    handleSelectRow(item._id, checked as boolean)
                                                }
                                            />
                                        </TableCell>
                                    )}
                                    {columns.map((column, colIndex) => (
                                        <TableCell key={colIndex} className="px-4 py-3">
                                            {getCellValue(item, column)}
                                        </TableCell>
                                    ))}
                                    {(onView || onEdit || onDelete) && (
                                        <TableCell className="px-4 py-3 text-center">
                                            <Popover
                                                open={openPopover === item._id}
                                                onOpenChange={(open) => setOpenPopover(open ? item._id : null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <MoreHorizontal className='text-zinc-400' />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-30 p-1 " align="end">
                                                    <div className="flex flex-col">
                                                        {onView && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="justify-start gap-3"
                                                                onClick={() => handleAction('view', item)}
                                                            >
                                                                <Bolt />
                                                                View
                                                            </Button>
                                                        )}
                                                        {onEdit && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="justify-start gap-3"
                                                                onClick={() => handleAction('edit', item)}
                                                            >
                                                                <Pencil />
                                                                Edit
                                                            </Button>
                                                        )}
                                                        {onDelete && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="justify-start gap-3 text-red-400 hover:text-red-500"
                                                                onClick={() => handleAction('delete', item)}
                                                            >
                                                                <Trash2 />
                                                                Delete
                                                            </Button>
                                                        )}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {filteredData.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Rows per page:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="border rounded px-2 py-1 text-sm"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">
                            Page {safePage} of {totalPages}
                        </span>
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={safePage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={safePage === totalPages || filteredData.length === 0}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};