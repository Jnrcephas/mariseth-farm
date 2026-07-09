// src/app/app/accounting/waybills/page.tsx  (previously had NO tabs)
import WaybillView from "@/modules/Accounting/Waybills";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { FINANCE_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={FINANCE_TABS} />
            <WaybillView/>
        </div>
    )
}