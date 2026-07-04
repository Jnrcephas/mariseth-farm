import { Farms } from "@/modules/FarmManagement/Farms";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { FARM_MANAGEMENT_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div className="">
            <QuickActionTabs tabs={FARM_MANAGEMENT_TABS} />
            <Farms/>
        </div>
    )
}
