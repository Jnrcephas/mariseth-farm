import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAccountsUsersGroupsUpdate} from "@/apis/adminApiComponents";
import { groupPermissionsByCodename } from "../utils/helpers";
import { toast } from "sonner";
import { getErrorMap } from "@/lib/helpers";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label, LoadingLabel } from "@/components/ui/label";

export default function EditGroupRole({selectedPermIds, data, refetch, onClose}:
    {data: any; 
        selectedPermIds: any[]
        refetch: () => void;
        onClose: () => void;
    }){

    const {handleSubmit, control} = useForm<any>({defaultValues:
        {
            name: data?.name,
            rank: data?.rank,
        }
    });

    const [selectedPerm, setSelectedPerm] = useState<any[]>(selectedPermIds)
    const [permissions, setPermissions] = useState<any[]>(data?.permissions || [])

    const handleSelectRole = (target: HTMLInputElement, value: string) => {
        const selectedID = Number(value);
        if (target){
            selectedPerm.push(selectedID)

            const checkedPerms = permissions.map((item) => {
                if(selectedID === item?.id){
                    return {...item, is_active: true}
                }
                return item
            })
            setPermissions(checkedPerms)

        } else {
          const popSelected = selectedPerm.filter((number) => number != selectedID);
          setSelectedPerm(popSelected);

          const checkedPerms = permissions.map((item) => {
            if(selectedID === item?.id){
                return {...item, is_active: false}
            }
                return item
            })
            setPermissions(checkedPerms)
        }
        
    };

    const handleSelectAllRoles = (target: HTMLInputElement, selectedGroupIds: any[]) => {
        if (target){
            selectedPerm.push(...selectedGroupIds)

            const checkedPerms = permissions.map((item) => {
                if(selectedGroupIds.includes(item?.id)){
                    return {...item, is_active:true}
                }
                return item
            })
            setPermissions(checkedPerms)
        } else {
           
            const popSelected = selectedPerm.filter((number) => !selectedGroupIds.includes(number));
            setSelectedPerm(popSelected);

            const uncheckedPerms = permissions.map((item) => {
                if(selectedGroupIds.includes(item?.id)){
                    return {...item, is_active:false}
                }
                return item
            })
            setPermissions(uncheckedPerms)
        }
        
    };

    const isAllSelected = (perms: any[]) => {
        const permsIsActive = perms?.filter((item) => item?.is_active === true).length
        return permsIsActive === perms.length
    }

    const {mutate, isPending} = useAccountsUsersGroupsUpdate(
        {
            onSuccess: () => {
                refetch()
                toast.success("Updated successfully");
                onClose()
            },
            onError: (errors:any) => {
                toast.error(getErrorMap(errors?.stack));
            },
        }
    )

    const onSubmit = async (payload: any) => {

        const newPayload = {
            name: payload?.name,
            rank: payload?.rank,
            permissions: selectedPerm
        } as any

        mutate({
            body: newPayload,
            pathParams: {
                id: data?.id
            }
        })
    }

    const groupedPermissions = groupPermissionsByCodename(permissions);



    return(
        <div >
            <div className="p-10">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full" >
                    
                    <div className=" mb-10 font-medium " >
                        <div className="gap-5 grid grid-cols-1 md:grid-cols-2">
                            <div className="mb-3">
                                <Controller
                                    control={control}
                                    name="name"
                                    rules={{required:"required"}}
                                    render={({ field }) => (
                                        <Input {...field} name="name"  type="text"  placeholder={"Name"} required/>
                                           
                                )}/>
                            </div>
                            <div className="mb-3">
                                <Controller
                                    control={control}
                                    name="rank"
                                    rules={{required:"required"}}
                                    render={({ field }) => (
                                        <Input {...field} name="rank"  type={"number"} placeholder={"Rank"} required/>
                                       
                                )}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                            {Object.entries(groupedPermissions).map(([group, perms]) => (
                                <div key={group} className="mb-5">
                                    <div className="mb-3">
                                        <div className="flex gap-2 items-center capitalize font-medium bg-[#D1FAE5] text-[#4A8D34] px-2 rounded">
                                            <div className="mt-1">
                                                <Checkbox
                                                    name={`${group}_selectAll`}
                                                    onCheckedChange={(e: any) => {
                                                        const permIDs = perms?.map((perms) => perms?.id)
                                                        handleSelectAllRoles(e, permIDs);
                                                    }}
                                                    className="form-check-input"
                                                    defaultChecked={isAllSelected(perms)}
                                                />
                                            </div>
                                            <div>
                                                <h2 className="" >{group.replaceAll("_", " ")}</h2>
                                            </div>
                                        </div>

                                        <hr className="border-stroke dark:border-dark-3" />
                                    </div>
                                    {perms?.map(
                                        (perm: any, perIdx: number) => (
                                        <div className="col-md-4 mb-5 px-2 flex gap-2 capitalize items-center" key={perIdx}>
                                            <Checkbox
                                                name={`${perm?.id}`}
                                                value={perm?.id}
                                                onCheckedChange={(e: any) => {
                                                    handleSelectRole(e, perm?.id);
                                                }}
                                                checked={perm?.is_active}
                                                className="form-check-input"
                                                id={`${perm?.codename}`}
                                                defaultChecked={perm?.is_active}
                                            />
                                            <Label htmlFor={perm?.codename} className="leading-5 text-[#667085]">{perm?.name}</Label>                                            
                                        </div>
                                        ),
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="-mx-2.5 flex flex-wrap gap-y-4">
                        <div className="w-full px-3 2xsm:w-1/2">
                            <Button type="submit" className="block w-full rounded-[7px] border text-center font-medium text-white hover:bg-opacity-90">
                                <LoadingLabel isLoading={isPending}>
                                    Update Role
                                </LoadingLabel>
                            </Button>
                        </div>
                        <div className="w-full px-4 2xsm:w-1/2">
                            <button
                                onClick={onClose}
                                className=" block w-full rounded-[7px] border border-destructive bg-gray-2 p-[5px] text-center font-medium text-destructive"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}