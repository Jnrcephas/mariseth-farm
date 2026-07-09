// src/app/app/accounting/expenses/page.tsx  (previously had NO tabs)
import ExpensesView from "@/modules/Accounting/Expenses";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { FINANCE_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={FINANCE_TABS} />
            <ExpensesView/>
        </div>
    )
}