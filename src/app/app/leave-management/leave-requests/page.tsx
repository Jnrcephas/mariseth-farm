import ViewLeaveRequests from "@/modules/LeaveRequests";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { LEAVE_MANAGEMENT_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={LEAVE_MANAGEMENT_TABS} />
            <ViewLeaveRequests />
        </div>
    )
}
