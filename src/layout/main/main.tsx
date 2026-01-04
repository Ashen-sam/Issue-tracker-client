import { ModeToggle } from "@/common";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { logout } from "@/services/slices/authSlice";
import type { RootState } from "@/store";
import { Bug, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../sidebar";

export const MainLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const getUserInitials = () => {
        if (user?.name) {
            return user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase();
        }
        const name = localStorage.getItem('userName') || 'WS';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div className="min-h-screen dark:bg-[#1a1a1a] flex items-center justify-center p-8">
            <div className="flex w-full max-w-7xl min-h-150 ">
                <Sidebar />
                <div>

                </div>
                <div className="absolute top-1 left-1 flex items-center justify-between  right-5">
                    <div className="relative flex items-center  w-20 h-20 ">
                        <div />
                        <div className="relative flex items-center justify-center w-15 h-15 rounded-xl"  >
                            <Bug size={30} className="relative text-zinc-600 dark:text-muted-foreground" />
                        </div>
                    </div>
                    <div className='py-2 flex items-center gap-4 '>
                        <ModeToggle />
                        <div className="flex items-center gap-2 rounded cursor-pointer transition-colors ">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="h-10 w-10 rounded-sm cursor-pointer hover:opacity-80  transition-opacity">
                                        <AvatarFallback className=" dark:bg-indigo-500/50 bg-indigo-700/80 text-white  text-[13px]">
                                            {getUserInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-56 p-2" align="end">
                                    <div className="flex flex-col gap-1">
                                        <div className="px-2 py-2 border-b">
                                            <div className="text-sm font-medium">
                                                {user?.name || localStorage.getItem('userName') || 'User'}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {user?.email || localStorage.getItem('userEmail') || ''}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start gap-2 text-sm font-normal"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                <main className="flex-1 overflow-y-auto  ">
                    <Outlet />
                </main>
            </div>
        </div >
    );
};