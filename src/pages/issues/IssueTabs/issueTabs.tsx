import { Bolt, ChartLine } from "lucide-react";
import { useRef, useState } from 'react';
import { Outlet } from "react-router-dom";

export const IssueTabs = () => {
    const [activeTab, setActiveTab] = useState<string>("details");
    const [hoverStyle, setHoverStyle] = useState<{
        opacity?: number;
        left?: number;
        width?: number;
    }>({});
    const tabsListRef = useRef<HTMLDivElement>(null);
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        { value: "details", icon: Bolt, label: "Details" },
        { value: "comments", icon: ChartLine, label: "Analytics" },

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

                        {tabsConfig.map(({ value, icon: Icon, label }) => (
                            <button
                                key={value}
                                onClick={() => setActiveTab(value)}
                                onMouseEnter={handleMouseEnter}
                                className={`
                                    rounded-none px-4 py-3 
                                    ${activeTab === value
                                        ? 'bg-transparent border-b-2 border-primary dark:border-primary'
                                        : 'bg-transparent text-muted-foreground border-b-2 border-transparent'
                                    }
                                    transition-all duration-200 
                                    gap-2 border-0 shadow-none relative z-10
                                    flex items-center hover:text-foreground
                                `}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-xs font-medium">{label}</span>
                            </button>
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