import { useAccountsUsersPermissionsList } from "@/apis/adminApiComponents";
import PermissionsView from "../UserManagement/Roles/PermissionsView";
import { useGroupPermissionMap } from "../UserManagement/utils/helpers";

export default function ViewPermissions({defaultData}:{defaultData: any}){
    const {data: PermData} = useAccountsUsersPermissionsList({})
    const permList = PermData as any

    const groupPerms = useGroupPermissionMap(defaultData?.groups || [], permList?.results || [])
    const roleType = defaultData?.groups?.[0]?.name

    return(
        <div className="mt-1 p-5 w-full">
            <div className="font-medium text-[#64748B]">
                {roleType}
            </div>
            <hr className="py-2"/>
            <div className="h-full">
                <PermissionsView groupPermissions={groupPerms?.[0]}/>
            </div>

        </div>
    )
}