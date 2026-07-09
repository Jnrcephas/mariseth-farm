// src/app/app/leave-management/leave-request-types/page.tsx
import LeaveRequestTypes from "@/modules/LeaveRequests/LeaveRequestTypes";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { HR_MANAGEMENT_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={HR_MANAGEMENT_TABS} />
            <LeaveRequestTypes />
        </div>
    )
}