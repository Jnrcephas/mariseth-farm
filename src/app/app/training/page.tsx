// src/app/app/training/page.tsx  (this one previously had NO tabs at all)
import ViewTrainings from "@/modules/Training";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { HR_MANAGEMENT_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={HR_MANAGEMENT_TABS} />
            <ViewTrainings/>
        </div>
    )
}