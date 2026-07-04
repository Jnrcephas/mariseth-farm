import CreditManagement from "@/modules/CreditManagement";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { CREDIT_MANAGEMENT_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={CREDIT_MANAGEMENT_TABS} />
            <CreditManagement />
        </div>
    )
}
