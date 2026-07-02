"use client"
import {
    DialogPoweredByFooter,
  } from "@/components/ui/dialog"
import { LoadingLabel, TextLabel } from "@/components/ui/label";
import { XCircle } from "lucide-react";
import { TModal } from "@/lib/types";
import { formatDateReadable, getErrorMap } from "@/lib/helpers";
import { CEDI } from "@/lib/constants";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCreditWarehouseManagerFulfillCredit } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { Form} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { approveCreditSchema } from "../../utils/validations";
import { Badge } from "@/components/ui/badge";


  export default function ViewWarehouseCreditModal({open, setOpen, defaultData, refetch}:TModal){


    const form = useForm<z.infer<typeof approveCreditSchema>>({
        resolver: zodResolver(approveCreditSchema),
        defaultValues: {},
    });
   
    const {mutate, isPending} = useCreditWarehouseManagerFulfillCredit({
        onSuccess: () =>{
            refetch?.()
            toast.success(`Credit Fulfilled Successfully`);
            setOpen(false);
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function handleApprove(){
        const payload = {
           action : "approve"
        } as any

        mutate({
            body: payload,
            pathParams: {
                id: defaultData.credit?.id,
                warehouseId: defaultData?.warehouse?.id
            }
        })
    }

    return(
        <Sheet open={open}>
            <SheetContent className="md:max-w-[550px] md:max-h-[580px] text-[#334155] rounded-lg mt-4">
                <SheetTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">Credit Request Approval - {defaultData?.credit?.credit_id}</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </SheetTitle>
                <hr/>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleApprove)} className="space-y-5">
                        <div className="mt-1 px-5 mb-10 overflow-y-auto h-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <TextLabel title="Farmer" subTitle={`${defaultData?.credit?.farmer?.first_name} ${defaultData?.credit?.farmer?.last_name}`} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                <div>
                                    <TextLabel title="Inputs Credits" subTitle={defaultData?.credit?.input_credit?.name} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                <div>
                                    <TextLabel title="Credit Type" subTitle={defaultData?.credit?.input_credit?.category?.name} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                
                                <div>
                                    <TextLabel title="Quantity" subTitle={defaultData?.quantity} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                    
                                <div>
                                    <TextLabel title="Issue Date" subTitle={formatDateReadable(defaultData?.credit?.issue_date)} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                <div>
                                    <TextLabel title="Due Date" subTitle={formatDateReadable(defaultData?.credit?.due_date)} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                <div>
                                    <TextLabel title="Credit Amount" subTitle={`${CEDI} ${defaultData?.credit?.credit_amount}`} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                <div>
                                    <TextLabel title="Interest Rate" subTitle={`${Number(defaultData?.credit?.interest_rate || 0).toFixed(0)}%`} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                <div>
                                    <TextLabel title="Approval Status" subTitle={<Badge className="capitalize" variant={defaultData?.is_fulfilled ? "success" : "warning"}>{defaultData?.is_fulfilled ? "Fulfilled" : "Pending"}</Badge>} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                <div>
                                    <TextLabel title="Created By" subTitle={`${defaultData?.credit?.input_credit?.created_by?.first_name} ${defaultData?.credit?.input_credit?.created_by?.last_name}`} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                   
                            </div>

                            <div className="grid grid-cols-1 mt-5 gap-5">
                                <div className="">
                                    <TextLabel title="Extra Information/Notes" subTitle={defaultData?.credit?.notes} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                
                            </div>
                            {/* <div className="flex justify-end mt-5">
                                <div className="md:w-[1/2]">
                                    <TextLabel title="Created By" subTitle={`${defaultData?.created_by?.first_name} ${defaultData?.created_by?.last_name}`} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                            </div> */}
                            {/* {defaultData?.action === "deny" &&
                                <div className="mt-10 mb-5">
                                    <FormField
                                        control={form.control}
                                        name="denial_notes"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type the reason for denying this credit request.
                                            <span className="text-red-500 font-medium">This is irreversible!</span></FormLabel>
                                            <FormControl>
                                            <Textarea placeholder="Type here..." {...field} required/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                </div>
                            } */}
                            
                            {defaultData?.action !== "view" && 
                                <div className="flex justify-end mt-5">
                                     <Button className="" type="button" variant={"default"} onClick={handleApprove}>
                                        <LoadingLabel isLoading={isPending}>
                                            Fulfill Request
                                        </LoadingLabel>
                                    </Button>
                                </div>
                            }
                        </div>
                    </form>
                </Form>
                <div className="bottom-0 absolute w-full rounded-b-lg">
                    <DialogPoweredByFooter/>
                </div>
            </SheetContent>
            
        </Sheet>
    )
  }