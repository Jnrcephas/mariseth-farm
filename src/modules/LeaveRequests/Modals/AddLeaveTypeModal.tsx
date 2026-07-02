import {
    DialogPoweredByFooter,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form';
  import { Input } from '@/components/ui/input';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { TModal } from "@/modules/FarmManagement/utils/types";
import { useLeaveTypeCreate, useLeaveTypeUpdate } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { getErrorMap } from "@/lib/helpers";
import { Label, LoadingLabel } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEDUCT_FROM_OPTIONS } from "@/lib/constants";
import { leaveRequestTypeSchema } from "../utils/validations";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



export default function AddLeaveTypeModal({open, setOpen, defaultData, isEdit, refetch}:TModal){

    const modalTitle = isEdit ? "Edit Leave Type" : "Add Leave Type";
    const submitTitle = isEdit ? "Edit Leave Type" : "Add Leave Type";

    const form = useForm<z.infer<typeof leaveRequestTypeSchema>>({
        resolver: zodResolver(leaveRequestTypeSchema),
        defaultValues: { 
            ...defaultData,
            max_days: String(defaultData?.max_days)
        }
    });


    const {mutate, isPending} =  useLeaveTypeCreate({
        onSuccess: () =>{
            if(refetch) refetch()
            toast.success("Leave Type Added Successfully")
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const {mutate: updateMutate, isPending: isUpdating} =  useLeaveTypeUpdate({
        onSuccess: () =>{
            if(refetch) refetch()
            toast.success("Leave Type Edited Successfully")
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof leaveRequestTypeSchema>) {
        const payload = {
                name: values?.name,
                description: values?.description ?? "",
                max_days: Number(values?.max_days),
                deducts_from_allowance: values?.deducts_from_allowance,
                deduct_from:  values?.deduct_from as "annual" | "sick"
            }
        if(isEdit){
            updateMutate({
                body: payload,
                pathParams: {
                    id: defaultData.id
                }
            })

        }else{
            mutate({
                body: payload
            })
        } 
        
    }

    return(
        <Sheet open={open}>
            <SheetContent className="md:max-w-[600px] md:max-h-[700px] text-[#334155] rounded-lg mt-4">
                <SheetTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">{modalTitle}</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </SheetTitle>
                <hr/>
                <div className="mt-1 p-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid grid-cols-1 gap-5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Leave Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Type..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="max_days"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Maximum Days <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Maximum Days Number" {...field} type="number"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                <FormField
                                    control={form.control}
                                    name="deducts_from_allowance"
                                    render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <Switch 
                                            checked={field.value}
                                            onCheckedChange={field.onChange} 
                                            id="airplane-mode" 
                                        />
                                        <Label htmlFor="airplane-mode">Deducts From Allowance</Label>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                {form.watch("deducts_from_allowance") && 
                                    <FormField
                                        control={form.control}
                                        name="deduct_from"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Deduct From</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select" />
                                                </SelectTrigger> 
                                            </FormControl>
                                            <SelectContent>
                                                {DEDUCT_FROM_OPTIONS.map((item, idx) =>(
                                                    <SelectItem key={`df-${idx}`} value={item.value}>{item.label}</SelectItem>
                                                ))} 
                                            </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                }
                            </div>
                            <div className="flex justify-center">
                                <Button type="submit" variant="default" className="w-full mt-5">
                                    <LoadingLabel isLoading={isPending || isUpdating}>
                                        {submitTitle}
                                    </LoadingLabel>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
                <div className="bottom-0 absolute w-full rounded-b-lg">
                    <DialogPoweredByFooter/>
                </div>
            </SheetContent>
            
        </Sheet>
    )
  }