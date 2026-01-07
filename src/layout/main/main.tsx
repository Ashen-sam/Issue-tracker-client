import { IssueDialog, IssueDialogFooter, ModeToggle } from "@/common";
import { MotionPopup } from "@/common/motionPopup";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useGetCurrentUserQuery } from "@/services";
import { AnimatePresence } from "framer-motion";
import { Bug, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../sidebar";

export const MainLayout = () => {
    const navigate = useNavigate();
    const { data: user } = useGetCurrentUserQuery();
    const [showPopup, setShowPopup] = useState(false);
    const [hasShownPopup, setHasShownPopup] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userName');
        localStorage.removeItem('vite-ui-theme');
        navigate('/login');
    };

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');

        if (!isDarkMode && !hasShownPopup) {
            const timer = setTimeout(() => {
                setShowPopup(true);
                setHasShownPopup(true);

                const hideTimer = setTimeout(() => {
                    setShowPopup(false);
                }, 3000);

                return () => clearTimeout(hideTimer);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [hasShownPopup, user]);

    const handleDismiss = () => {
        setShowPopup(false);
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
                                        <AvatarFallback className=" text-white
        border px-4 py-2 text-sm 
        dark:bg-indigo-500/60 bg-indigo-700/80
        hover:text-white dark:hover:text-white font-semibold  text-[13px]">
                                            {getInitials(username)}
                                        </AvatarFallback>
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-56 p-2" align="end">
                                    <div className="flex flex-col gap-1">
                                        <div className="px-2 py-2 border-b">
                                            <div className="text-sm font-medium">
                                                {username}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {email}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start gap-2 text-sm font-normal"
                                            onClick={() => setLogoutOpen(true)}
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

            <AnimatePresence>
                {showPopup && (
                    <MotionPopup handleDismiss={handleDismiss} />
                )}
            </AnimatePresence>
            <IssueDialog
                open={logoutOpen}
                title="Logout"
                note="You will be logged out of your account"
                icon={<LogOut className="w-4 h-4" />}
                onClose={() => setLogoutOpen(false)}
                footer={
                    <IssueDialogFooter
                        onCancel={() => setLogoutOpen(false)}
                        onConfirm={handleLogout}
                        confirmText="Logout"
                        isLoading={false}
                        formMode="delete"
                        enableCreateAnother={false}
                    />
                }
            >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Are you sure you want to logout? You will need to sign in again to access your account.
                </div>
            </IssueDialog>
        </div >
    )
}