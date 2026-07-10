import Weather from "@/modules/FarmMonitoring/Weather";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { FARM_MONITORING_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={FARM_MONITORING_TABS} />
            <Weather />
        </div>
    )
}
