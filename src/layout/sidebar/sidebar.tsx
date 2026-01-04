import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetCurrentUserQuery } from '@/services';
import {
    House,
    Layers2,
    Settings
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar = () => {
    const location = useLocation();
    const { data: user } = useGetCurrentUserQuery();
    const menuItems = [
        { id: 'dashboard', icon: House, label: 'Home' },
        { id: 'issues', icon: Layers2, label: 'My Issues' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    const username = user?.user?.name || 'User';
    const email = user?.user?.email || 'email@example.com';

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const isActive = (itemId: string) => {
        const currentPath = location.pathname.split('/')[1] || 'dashboard';
        return currentPath === itemId;
    };

    return (
        <div className="w-56 flex flex-col">
            <div className="">
                <div className="flex items-center gap-2 rounded cursor-pointer transition-colors">
                    <div className="border-2 h-8 w-8 relative rounded-sm flex items-center justify-center  ">
                        <div
                            className="absolute inset-0 rounded-xl bg-white opacity-30 blur-lg"
                            style={{
                                background: 'radial-gradient(circle, rgba(255,255,255,0.5) 90%, transparent 90%)',
                            }}
                        />
                        <div className="dark:text-white text-[13px] font-medium relative ">

                            {getInitials(username)}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-medium truncate">
                            {username}
                        </div>
                        <div className="text-[12px] text-gray-400 truncate">
                            {email}
                        </div>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 pt-3">
                <div className="space-y-0.5">
                    {menuItems.map((item) => {
                        const active = isActive(item.id);
                        return (
                            <Link
                                to={item.id}
                                key={item.id}
                                className={`group relative flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all
    ${active
                                        ? 'text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }
  `}
                            >
                                {active && (
                                    <div
                                        className="absolute inset-0 rounded-md opacity-30 blur-md"
                                        style={{
                                            background:
                                                'linear-gradient(to left, transparent 0%, rgba(255,255,255,0.25) 100%)',
                                        }}
                                    />
                                )}

                                <div
                                    className="absolute inset-0 rounded-md opacity-0 blur-md group-hover:opacity-20 transition-opacity"
                                    style={{
                                        background:
                                            'linear-gradient(to left, transparent 0%, rgba(255,255,255,0.2) 100%)',
                                    }}
                                />

                                <item.icon className="relative z-10 h-3.5 w-3.5 shrink-0" />

                                <span className="relative z-10 flex-1 text-[14px] font-medium">
                                    {item.label}
                                </span>
                            </Link>

                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
};