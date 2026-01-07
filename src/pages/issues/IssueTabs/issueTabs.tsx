import { Bolt } from "lucide-react";
import { useRef, useState } from 'react';
import { NavLink, Outlet } from "react-router-dom";

export const IssueTabs = () => {
    const [hoverStyle, setHoverStyle] = useState<{
        opacity?: number;
        left?: number;
        width?: number;
    }>({});
    const tabsListRef = useRef<HTMLDivElement>(null);
    const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        const button = e.currentTarget;
        const tabsList = tabsListRef.current;
        if (tabsList) {
            const tabsListRect = tabsList.getBoundingClientRect();
            const buttonRect = button.getBoundingClientRect();

            setHoverStyle({
                opacity: 1,
                left: buttonRect.left - tabsListRect.left,
                width: buttonRect.width,
            });
        }
    };
    const handleMouseLeave = () => {
        setHoverStyle({ opacity: 0 });
    };
    const tabsConfig = [
        { to: "", icon: Bolt, label: "Overview" },
    ];

    return (
        <div className="w-full mx-auto">
            <div className="border-b ">
                <div className="">
                    <div
                        ref={tabsListRef}
                        className="h-auto p-0 bg-transparent border-0 gap-1 relative inline-flex"
                        onMouseLeave={handleMouseLeave}
                    >
                        <div
                            className="absolute bottom-0 h-full bg-muted/50 rounded-t-sm transition-all duration-200 ease-out pointer-events-none"
                            style={{
                                opacity: hoverStyle.opacity || 0,
                                left: `${hoverStyle.left || 0}px`,
                                width: `${hoverStyle.width || 0}px`,
                                zIndex: 0,
                            }}
                        />
                        {tabsConfig.map(({ to, icon: Icon, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={to === ""}
                                onMouseEnter={handleMouseEnter}
                                className={({ isActive }) =>
                                    `
      rounded-none px-4 py-3 flex items-center gap-2
      transition-all duration-200 relative z-10
      ${isActive
                                        ? "border-b-2 border-primary text-foreground"
                                        : "border-b-2 border-transparent text-muted-foreground hover:text-foreground"
                                    }
    `
                                }
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-xs font-medium">{label}</span>
                            </NavLink>
                        ))}

                    </div>
                </div>
            </div>

            <div className="py-4">
                <Outlet />
            </div>
        </div>
    );
};