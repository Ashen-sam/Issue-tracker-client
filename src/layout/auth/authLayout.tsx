import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
    return (
        <div className="flex items-center justify-center dark:bg-[#1a1a1a] overflow-hidden min-h-screen">
            <div className="w-full rounded-lg  overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
};
