// src/app/app/employee-management/job-titles/page.tsx
import JobTitles from "@/modules/EmployeeManagement/JobTitles";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { HR_MANAGEMENT_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={HR_MANAGEMENT_TABS} />
            <JobTitles />
        </div>
    )
}