import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { StatusCommon, type IssueStatus } from '../statusCommon';
import { PriorityCommon, type IssuePriority } from '../priorityCommon';
import { SeverityCommon, } from '../seveorityCommon';
import type { IssueSeverity } from '@/services/issueApi';


interface IssueFormProps {
    initialData?: {
        title?: string;
        description?: string;
        status?: IssueStatus;
        priority?: IssuePriority;
        severity?: IssueSeverity
        createdAt?: string;
    };
    onSubmit?: (data: {
        title: string;
        description: string;
        status: IssueStatus;
        priority: IssuePriority;
        severity: IssueSeverity,
        createdAt: string;
    }) => void;
    onCancel?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFormDataChange?: (data: any) => void;
}

export const IssueForm = ({
    initialData,
    onFormDataChange,
}: IssueFormProps) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        status: initialData?.status || 'Open' as IssueStatus,
        priority: initialData?.priority || 'Medium' as IssuePriority,
        severity: initialData?.severity || "" as IssueSeverity,
        createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0]
    });

    const [date, setDate] = useState<Date>(
        initialData?.createdAt ? new Date(initialData.createdAt) : new Date()
    );

    const [statusOpen, setStatusOpen] = useState(false);
    const [priorityOpen, setPriorityOpen] = useState(false);
    const [seveorityOpen, setseveorityOpen] = useState(false);


    const statuses: IssueStatus[] = ["Open", "In Progress", "Resolved", "Closed"];
    const priorities: IssuePriority[] = ["Low", "Medium", "High"];
    const severity: IssueSeverity[] = ["Minor", "Major", "Critical"];


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

    useEffect(() => {
        if (onFormDataChange) {
            onFormDataChange(formData);
        }
    }, [formData, onFormDataChange]);

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="space-y-5">
            <div className="space-y-1.5">

                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full text-sm px-3 py-2.5 border rounded-md focus:outline-none focus:border-gray-400 "
                    placeholder="Enter issue title"
                    autoFocus
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="">

                    <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                        <PopoverTrigger asChild>
                            <button className="w-full px-3 py-2.5 text-sm text-left border rounded-md hover:border-gray-400 transition-colors flex items-center justify-between">
                                <StatusCommon status={formData.status} />
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-50 p-2" align="start">
                            <div className="space-y-1">
                                <div className='px-3'>Status</div>
                                {statuses.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            handleChange('status', status);
                                            setStatusOpen(false);
                                        }}
                                        className={cn(
                                            "w-full  py-2 text-left rounded-md hover:bg-zinc-700/20 transition-colors",
                                            formData.status === status && ""
                                        )}
                                    >
                                        <StatusCommon status={status} />
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-1.5">

                    <Popover open={priorityOpen} onOpenChange={setPriorityOpen}>
                        <PopoverTrigger asChild>
                            <button className="w-full px-3 py-2.5 text-sm text-left border rounded-md hover:border-gray-400 transition-colors flex items-center justify-between">
                                <PriorityCommon priority={formData.priority} />
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-50 p-2" align="start">
                            <div className="space-y-1">
                                <div className='px-3'>Priority</div>
                                {priorities.map((priority) => (
                                    <button
                                        key={priority}
                                        onClick={() => {
                                            handleChange('priority', priority);
                                            setPriorityOpen(false);
                                        }}
                                        className={cn(
                                            "w-full py-2 text-left rounded-md hover:bg-zinc-700/20 transition-colors",
                                            formData.priority === priority && ""
                                        )}
                                    >
                                        <PriorityCommon priority={priority} />
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-1.5">

                    <Popover open={seveorityOpen} onOpenChange={setseveorityOpen}>
                        <PopoverTrigger asChild>
                            <button className="w-full px-3 py-2.5 text-sm text-left border rounded-md hover:border-gray-400 transition-colors flex items-center justify-between">
                                <SeverityCommon severity={formData.severity} />
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-50 p-2" align="start">
                            <div className="space-y-1">
                                <div className='px-3'>severity</div>
                                {severity.map((severity) => (
                                    <button
                                        key={severity}
                                        onClick={() => {
                                            handleChange('severity', severity);
                                            setseveorityOpen(false);
                                        }}
                                        className={cn(
                                            "w-full py-2 text-left rounded-md hover:bg-zinc-700/20 transition-colors",
                                            formData.severity === severity && ""
                                        )}
                                    >
                                        <SeverityCommon severity={severity} />
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="space-y-1.5">
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="w-full px-3 py-2.5 text-sm text-left border rounded-md hover:border-gray-400 transition-colors flex items-center justify-between">
                            <span className="">{formatDate(formData.createdAt)}</span>
                            <CalendarIcon className="w-4 h-4 " />
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
            <div className="space-y-1.5">
                <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                    className="w-full text-sm px-3 py-2.5 border rounded-md focus:outline-none focus:border-gray-400  resize-none"
                    placeholder="Add a description..."
                />
            </div>


        </div>
    );
}