import InflowApprovals from "@/modules/Approvals/Inflow/Index";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { APPROVALS_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={APPROVALS_TABS} />
            <InflowApprovals/>
        </div>
    )
}
