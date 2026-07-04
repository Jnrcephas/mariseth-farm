import InputCreditProcurement from "@/modules/CreditManagement/InputCreditProcurement/Index";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { CREDIT_MANAGEMENT_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={CREDIT_MANAGEMENT_TABS} />
            <InputCreditProcurement />
        </div>
    )
}
