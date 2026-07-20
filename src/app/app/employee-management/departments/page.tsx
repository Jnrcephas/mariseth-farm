import Departments from "@/modules/EmployeeManagement/Departments";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { HR_MANAGEMENT_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={HR_MANAGEMENT_TABS} />
            <Departments />
        </div>
    )
}