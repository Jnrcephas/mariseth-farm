import ApprovalsCreditTable from "@/modules/Approvals/CreditRequest";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { APPROVALS_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={APPROVALS_TABS} />
            <ApprovalsCreditTable/>
        </div>
    )
}
