import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="w-full max-w-md p-6  rounded-lg shadow">
                <Outlet />
            </div>
        </div>
    );
};
