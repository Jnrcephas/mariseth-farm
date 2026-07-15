import FinancialAnalytics from "@/modules/Accounting/Analytics";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { FINANCE_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={FINANCE_TABS} />
            <FinancialAnalytics/>
        </div>
    )
}
