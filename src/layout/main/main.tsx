// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebar";

export const MainLayout = () => {
    return (
        <div className="min-h-screen dark:bg-[#1a1a1a] flex items-center justify-center p-8">
            <div className="flex w-full max-w-7xl min-h-150 dark:bg-[#1a1a1a] ">
                <Sidebar />
                <main className="flex-1 overflow-y-auto  ">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};