import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { PriorityCommon, type IssuePriority } from '../priorityCommon';
import { StatusCommon, type IssueStatus } from '../statusCommon';



interface IssueFormProps {
    mode: "create" | "edit";
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
        <div className="">
            <div className="space-y-6">
                {/* Title */}
                <div className="space-y-1">

                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="w-full text-sm font-medium p-3 border rounded-sm outline-none placeholder:text-gray-300 focus:outline-none"
                        placeholder="Issue title"
                        autoFocus
                    />
                </div>



                <div className="space-y-4 ">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400  tracking-wide">
                                Status
                            </label>
                            <StatusCommon status={'OPEN'} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-400  tracking-wide">
                                Priority
                            </label>
                            <PriorityCommon priority={'LOW'} />
                        </div>
                    </div>
                    <div className="space-y-2">

                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={4}
                            className="w-full text-sm border rounded-sm p-3 outline-none placeholder:text-gray-300 focus:outline-none resize-none"
                            placeholder="Add description..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="w-full px-3 py-2 text-sm text-left border rounded-md hover:border-gray-400 transition-colors flex items-center justify-between">
                                    <span>{formatDate(formData.createdAt)}</span>
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

            </div>
        </div>
    );
}