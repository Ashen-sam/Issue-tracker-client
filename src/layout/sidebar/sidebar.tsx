import { ModeToggle } from '@/common';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    House,
    Layers2,
    Settings
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Sidebar = () => {
    const [activeItem,] = useState('inbox');

    const menuItems = [
        { id: 'dashboard', icon: House, label: 'Home' },
        { id: 'issues', icon: Layers2, label: 'My Issues' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="w-56  flex flex-col">

            <div className="p-2.5">
                <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-800/50 rounded cursor-pointer transition-colors">
                    <Avatar className="h-5 w-5">
                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-[10px]">
                            WS
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium  truncate">Workspace</div>
                    </div>
                </div>
            </div>

            <div className='p-2.5 '>
                <ModeToggle />
            </div>

            <ScrollArea className="flex-1 px-2.5 pt-3">
                <div className="space-y-0.5">
                    {menuItems.map((item) => (
                        <Link
                            to={item.id}
                            key={item.id}
                            className={`group flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-all ${activeItem === item.id
                                ? 'text-white'
                                : 'dark:text-gray-200 hover:dark:text-gray-200'
                                }`}
                        >
                            <item.icon className={`h-3.5 w-3.5 shrink-0 transition-all ${activeItem === item.id
                                ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                                : 'group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                                }`} />
                            <div className="flex-1 text-[14px] font-medium">{item.label}</div>

                        </Link>
                    ))}
                </div>
            </ScrollArea>


        </div>
    );
}