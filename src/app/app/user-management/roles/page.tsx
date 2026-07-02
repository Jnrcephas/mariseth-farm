import PageTitle from "@/components/layouts/PageTitle";
import RolesView from "@/modules/UserManagement/Roles/RolesView";

export default function Page(){
    return(
        <div>
            <PageTitle title="User Roles"/>
            <RolesView />
        </div>
    )
}