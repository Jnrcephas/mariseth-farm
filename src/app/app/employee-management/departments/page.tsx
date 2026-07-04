import Departments from "@/modules/EmployeeManagement/Departments";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { EMPLOYEE_MANAGEMENT_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={EMPLOYEE_MANAGEMENT_TABS} />
            <Departments />
        </div>
    )
}
