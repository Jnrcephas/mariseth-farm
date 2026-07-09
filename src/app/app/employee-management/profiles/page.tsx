// src/app/app/employee-management/profiles/page.tsx
import EmployeeProfiles from "@/modules/EmployeeManagement/Profiles";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { HR_MANAGEMENT_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={HR_MANAGEMENT_TABS} />
            <EmployeeProfiles />
        </div>
    )
}