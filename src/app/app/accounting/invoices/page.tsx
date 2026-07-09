// src/app/app/accounting/invoices/page.tsx  (previously had NO tabs)
import InvoicesView from "@/modules/Accounting/Invoices";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { FINANCE_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={FINANCE_TABS} />
            <InvoicesView/>
        </div>
    )
}