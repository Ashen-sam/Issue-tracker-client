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
}: CommonTableProps<T>) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [openPopover, setOpenPopover] = useState<string | null>(null);

    const getCellValue = (item: T, column: Column<T>) => {
        if (column.render) return column.render(item);
        return item[column.key as keyof T];
    };

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;

        return data.filter((item) =>
            columns.some((column) => {
                if (column.filterable === false) return false;
                const value = getCellValue(item, column);
                return String(value).toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    }, [data, searchTerm, columns]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
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
                    <ListFilter size={18} />
                </div>
            </div>

            <div className="rounded-md overflow-x-auto border">
                <Table className="w-full min-w-150 table-auto">
                    <TableHeader className="border-b border-gray-700">
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
                                    className="text-left text-xs font-semibold text-gray-400 tracking-wider px-4 py-3"
                                    style={column.width ? { width: column.width } : undefined}
                                >
                                    {column.header}
                                </TableHead>
                            ))}
                            {(onView || onEdit || onDelete) && (
                                <TableHead className="w-16 px-4 py-3 text-center">
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
                                                <PopoverContent className="w-30 p-1" align="end">
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
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
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