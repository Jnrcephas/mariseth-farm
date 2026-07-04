import UserAccounts from "@/modules/UserManagement/UserAccounts";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { USER_MANAGEMENT_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={USER_MANAGEMENT_TABS} />
            <UserAccounts />
        </div>
    )
}
