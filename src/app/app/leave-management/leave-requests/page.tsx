// src/app/app/leave-management/leave-requests/page.tsx
import ViewLeaveRequests from "@/modules/LeaveRequests";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { HR_MANAGEMENT_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={HR_MANAGEMENT_TABS} />
            <ViewLeaveRequests />
        </div>
    )
}