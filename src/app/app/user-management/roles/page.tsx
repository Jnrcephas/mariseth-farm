import PageTitle from "@/components/layouts/PageTitle";
import RolesView from "@/modules/UserManagement/Roles/RolesView";
import QuickActionTabs from "@/components/customs/QuickActionTabs";
import { USER_MANAGEMENT_TABS } from "@/lib/actionTabs";

export default function Page(){
    return(
        <div>
            <QuickActionTabs tabs={USER_MANAGEMENT_TABS} />
            <PageTitle title="User Roles"/>
            <RolesView />
        </div>
    )
}
