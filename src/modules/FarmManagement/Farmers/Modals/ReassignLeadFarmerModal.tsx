"use client"
import { useFarmManagementFarmerReassignSmallholderFarmer } from "@/apis/adminApiComponents";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { XCircle } from "lucide-react"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getErrorMap } from "@/lib/helpers";
import { FarmerCombobox } from "../../utils/FarmerCombobox";
import { reassignFarmerSchema } from "../../utils/validations";

export default function ReassignLeadFarmerModal({
    open, 
    setOpen, 
    data,
    refetch
}:{
    open: boolean, 
    setOpen: (open: boolean) => void, 
    data: any[];
    refetch: () => void;
    })
{
    const countFarmers = data.length

    const form = useForm<z.infer<typeof reassignFarmerSchema>>({
        resolver: zodResolver(reassignFarmerSchema),
    });

    const {mutate, isPending} = useFarmManagementFarmerReassignSmallholderFarmer({
        onSuccess: () => {
            refetch()
            toast.success(`${countFarmers} Farmer(s) reassigned successfully`)
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const onSubmit = (values: z.infer<typeof reassignFarmerSchema>) => {
        const farmers_ids = data?.map((item) => item?.id)
        const payload = {
            lead_farmer_id: values.lead_farmer_id,
            smallholder_farmer_ids: farmers_ids
        } as any
        
        mutate({
            body: payload
        })
    }
    return(
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[500px] p-0 text-[#334155] !rounded-b-lg">
                <DialogTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">Reassign Lead Farmer?</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
               
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                         <div className=" px-5 p-2 text-center mb-5">
                            <div className="mb-3">Reassign <span className="text-green-700">{countFarmers} farmer(s)</span></div>
                            <div className="text-xl mb-3">To</div>
                                <FormField
                                    control={form.control}
                                    name="lead_farmer_id"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lead Farmer
                                            <div className='text-red-500'>*</div>
                                        </FormLabel>
                                        <FormControl>
                                            <FarmerCombobox
                                                value={field.value}
                                                onChange={(value) => form.setValue("lead_farmer_id", value)}
                                                farmerType="lead"
                                                required
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                        </div>
                        <DialogFooter className="flex !justify-between p-5 bg-[#F8FAFC]">
                            <Button type="button" variant={"outline"} onClick={() => setOpen(false)}>Cancel</Button>
                            <Button  type="submit" variant={"default"}>
                                {isPending ? "Loading..." : "Reassign"}
                                
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}