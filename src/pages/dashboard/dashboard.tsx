import { InitialPage } from "@/common"
import { Bug, Home, LayersPlus } from "lucide-react"

export const Dashboard = () => {
    return (
        <div className="w-full flex justify-center relative ">
            <div className=" w-max  absolute left-0  rounded-md border border-dashed px-3 py-[5.2px] overflow-hidden">

                <div className="relative text-lg flex items-center justify-center gap-2 text-[16px]">
                    <Home size={14} /> Home
                </div>
            </div>

            <InitialPage
                icon={Bug}
                title="                    Welcome to Issue Tracker"
                description="  Manage bugs, feature requests, and improvements in one place.
                    Create your first issue to start tracking work effectively."
                actionLabel="New Issue"
                actionIcon={LayersPlus}
                onAction={() => console.log('Create new issue')} />
        </div>
    )
}