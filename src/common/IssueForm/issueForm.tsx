import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';

type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH';

interface IssueFormProps {
    initialData?: {
        title?: string;
        description?: string;
        status?: IssueStatus;
        priority?: IssuePriority;
        createdAt?: string;
    };
    onSubmit?: (data: {
        title: string;
        description: string;
        status: IssueStatus;
        priority: IssuePriority;
        createdAt: string;
    }) => void;
    onCancel?: () => void;
}

export const IssueForm = ({
    initialData,
}: IssueFormProps) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        status: initialData?.status || 'OPEN' as IssueStatus,
        priority: initialData?.priority || 'MEDIUM' as IssuePriority,
        createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0]
    });

    const [date, setDate] = useState<Date>(
        initialData?.createdAt ? new Date(initialData.createdAt) : new Date()
    );

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
            handleChange('createdAt', selectedDate.toISOString().split('T')[0]);
        }
    };

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="space-y-5">
            {/* Title Input */}
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full text-sm px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
                    placeholder="Enter issue title"
                    autoFocus
                />
            </div>

            {/* Status and Priority Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                    </label>
                    <select
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="w-full text-sm px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                    >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                    </label>
                    <select
                        value={formData.priority}
                        onChange={(e) => handleChange('priority', e.target.value)}
                        className="w-full text-sm px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    className="w-full text-sm px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-gray-400 placeholder:text-gray-400 resize-none"
                    placeholder="Add a description..."
                />
            </div>

            {/* Date Picker */}
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                </label>
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="w-full px-3 py-2.5 text-sm text-left border border-gray-300 rounded hover:border-gray-400 transition-colors flex items-center justify-between">
                            <span className="text-gray-700">{formatDate(formData.createdAt)}</span>
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}