import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useAccountsUsersGroupsUpdate } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { getErrorMap } from "@/lib/helpers";
import { Input } from "@/components/ui/input";

const EditRoleModal = ({open, onClose, data, refetch}:
    {open: boolean, 
        onClose: () => void;
        data: any;
        refetch: () => void;}) => {

    const {handleSubmit, control} = useForm<any>({defaultValues:data});

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
        mutate({
            body: {
                name: payload?.name,
                rank: payload?.rank,
            },
            pathParams: {
                id: data?.id
            }
        })
    }

   

  return (
    <div>
      {open && (
        <div
          className={`fixed left-0 top-0 z-50 flex h-full min-h-screen w-full items-center justify-center bg-[#111928]/90 px-4 py-5`}
        >
          {/* <ClickOutside onClick={onClose}> */}
            <div className="w-full max-w-[550px] rounded-[15px] bg-white px-5 py-12 shadow-3 dark:bg-gray-dark dark:shadow-card md:px-10 md:py-15">
                <form onSubmit={handleSubmit(onSubmit)} className="w-[550px]" style={{width: "400px"}}>
                    <div className="text-center">
                        <h3 className="pb-4 text-xl font-bold text-dark dark:text-white sm:text-2xl">
                            Edit Branch
                        </h3>
                        <span className="mx-auto mb-5.5 inline-block h-[3px] w-22.5 rounded-[2px] bg-primary"></span>
                    </div>
                    <div className=" mb-10 font-medium " >
                        <div className="gap-5 grid grid-cols-1">
                        <div className="mb-3">
                                <Controller
                                    control={control}
                                    name="name"
                                    rules={{required:"required"}}
                                    render={({ field }) => (
                                        <Input {...field} name="name" type="text"  placeholder={"Name"} required/>
                                          
                                )}/>
                            </div>
                            <div className="mb-3">
                                <Controller
                                    control={control}
                                    name="rank"
                                    rules={{required:"required"}}
                                    render={({ field }) => (
                                        <Input {...field} name="rank" type={"number"} placeholder={"Rank"} required/>
                                          
                                )}/>
                            </div>
                        </div>
                    </div>
                    <div className="-mx-2.5 flex flex-wrap gap-y-4">
                        <div className="w-full px-2.5 2xsm:w-1/2">
                        <button
                            onClick={onClose}
                            className="block w-full rounded-[7px] border border-stroke bg-gray-2 p-[11px] text-center font-medium text-dark transition hover:border-gray-3 hover:bg-gray-3 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:border-dark-4 dark:hover:bg-dark-4"
                        >
                            Cancel
                        </button>
                        </div>
                        <div className="w-full px-3 2xsm:w-1/2">
                            <button type="submit" className="block w-full rounded-[7px] border border-primary bg-primary p-[11px] text-center font-medium text-white transition hover:bg-opacity-90">
                                {isPending ? "Loading...": "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
          {/* </ClickOutside> */}
        </div>
      )}
    </div>
  );
};

export default EditRoleModal;
