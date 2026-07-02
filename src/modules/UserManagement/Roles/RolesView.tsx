"use client"
import { useState } from "react";
import { useAccountsUsersGroupsList, useAccountsUsersPermissionsList } from "@/apis/adminApiComponents";
import DeleteBranchModal from "./Modals/DeleteRole";
import GroupsSidebar from "./GroupsSidebar";
import PermissionsView from "./PermissionsView";
import EditGroupRole from "./EditGroupRole";
import AddGroupRole from "./AddGroupRole";
import { Button } from "@/components/ui/button";
import { useGroupPermissionMap } from "../utils/helpers";
import SuspensePageWrapper from "@/components/SuspensePageWrapper";


export default function RolesView(){


    const [activeTab, setActiveTab] = useState("Super Admin");

    const [selected, setSelected] = useState<any>({});
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    // const {hasAccess: create_group_and_assign_roles} = useHasAccess("account_management|create_group_and_assign_roles")
    // const {hasAccess: update_groups_and_roles} = useHasAccess("account_management|update_groups_and_roles")
    // const {hasAccess: delete_groups_and_roles} = useHasAccess("account_management|delete_groups_and_roles")

    function handleDeleteButton(data: any){
        setSelected(data)
        setDeleteModal(true)
    }
    function handleCloseEdit(){
        setEditModal(false)

    }
    function handleCloseAdd(){
        setAddModal(false)

    }
    function handleRefetch(){
        refetch()
        setActiveTab("Super Admin")
        
    }

    function handleSelectPerm(activeTab: string){
        setEditModal(false)
        setAddModal(false)
        setActiveTab(activeTab)
    }

    const {data,  refetch, isLoading} = useAccountsUsersGroupsList({})
    const dataList = data as any

    const {data: PermData} = useAccountsUsersPermissionsList({})
    const permList = PermData as any

    const groupPerms = useGroupPermissionMap(dataList?.results || [], permList?.results || [])

    const selectedGroupPerm = groupPerms?.find((item) => item?.name === activeTab)
    const selectedPermIds = selectedGroupPerm?.permissions?.filter((item: any) => item?.is_active === true)?.map((item: any) => item?.id)

    return(
        <SuspensePageWrapper isLoading={isLoading}>
            <div className="flex justify-between">
                <div></div>
                <div>
                    <Button  className={"mb-2"} 
                    onClick={() => {
                        setAddModal(true)
                        setActiveTab("")
                    }}> New Role</Button>
                </div>
            </div>
            <div className="h-full rounded-[10px] bg-white shadow-1 lg:flex capitalize text-sm text-[#667085]">
                <GroupsSidebar groups={dataList?.results || []} activeTab={activeTab} setActiveTab={handleSelectPerm}/>
                <div className="flex h-full flex-col border-stroke dark:border-dark-3 lg:w-4/5 lg:border-l">
                    {(editModal || addModal) ?
                        <>  
                            {editModal ? 
                                <EditGroupRole selectedPermIds={selectedPermIds} data={selectedGroupPerm} refetch={refetch} onClose={handleCloseEdit}/>
                            :
                                <AddGroupRole data={permList?.results || []} refetch={refetch} onClose={handleCloseAdd} setActiveTab={setActiveTab}/>
                            }
                        </>:
                        <>
                            <div className="h-full">
                                <PermissionsView groupPermissions={selectedGroupPerm}/>
                            </div>
                            {selectedGroupPerm?.name !== "Super Admin" && 
                                <div>
                                    <hr className="border-stroke dark:border-dark-3"/>
                                    <div className=" flex flex-wrap gap-y-4 p-5">
                                        <div className="w-full px-3 2xsm:w-1/2">
                                            <Button type="button"  onClick={() => setEditModal(true)} className="block w-full p-[5px] rounded-[7px] border text-md text-center font-medium text-white hover:bg-opacity-90">
                                                Edit {selectedGroupPerm?.name} Role
                                            </Button>
                                        </div>
                                        <div className="w-full px-3 2xsm:w-1/2">
                                            <button
                                                onClick={() => handleDeleteButton(selectedGroupPerm)}
                                                className=" block w-full rounded-[7px] border border-destructive bg-gray-2 p-[5px] text-center font-medium text-destructive"
                                            >
                                            Delete {selectedGroupPerm?.name} Role
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            }
                        </>
                    }
                    
                </div>
            </div>
            
            {deleteModal && 
                <DeleteBranchModal 
                    open={deleteModal} 
                    onClose={() => setDeleteModal(false)} 
                    data={selected} 
                    refetch={handleRefetch}
                    setActiveTab={setActiveTab}
                />
            }
        </SuspensePageWrapper>
    )
}