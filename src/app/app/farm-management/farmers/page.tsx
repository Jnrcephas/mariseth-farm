import { Farmers } from "@/modules/FarmManagement/Farmers";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { FARM_MANAGEMENT_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={FARM_MANAGEMENT_TABS} />
            <Farmers />
        </div>
    )
}
