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

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
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

import { Textarea } from "@/components/ui/textarea";
import { cleanJsonData, formatDateReadable, getErrorMap } from "@/lib/helpers";
import { useFarmManagementProductList, usePaybackCreate, usePaybackUpdate } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { LoadingLabel, TextLabel } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { CEDI } from "@/lib/constants";
import { PAYBACK_PAYMENT_STATUS, PAYMENT_TYPES } from "../utils/constants";
import { paybackSchema } from "../utils/validations";


export default function PaybackModal({open, setOpen, defaultData, isEdit}:TModal){

    const modalTitle = isEdit ? "Edit Payback" : `Payback - ${defaultData?.credit_id}`;
    const submitTitle = isEdit ? "Update Payback" : "Payback";

    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof paybackSchema>>({
        resolver: zodResolver(paybackSchema),
        defaultValues: defaultData,
    });

    const {data: _productsData} = useFarmManagementProductList({queryParams:{type: "crop", page: 1, page_size: 50}})
    const crops = _productsData?.results || []

    const {mutate, isPending} = usePaybackCreate({
        onSuccess: () =>{
            queryClient.refetchQueries({
                queryKey: ['usePaybackList']
            });
            toast.success("Payback added successfully");
            setOpen(false);},
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })
    const {mutate: updateMutate, isPending: isUpdating} = usePaybackUpdate({
        onSuccess: () =>{
            queryClient.refetchQueries({
                queryKey: ['usePaybackList'],
            });
            toast.success("Payback updated successfully");
            setOpen(false);},
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof paybackSchema>) {
        const payload = cleanJsonData({
            credit: defaultData?.id,
            product: Number(values?.product),
            quantity_bags: Number(values?.quantity_bags),
            amount: Number(values?.amount),
            payback_method: values?.payback_method,
            payment_status: values?.payment_status,
            comments: values?.comments,
        })
        if(isEdit){
            updateMutate({
                body: payload,
                pathParams: {
                    id: defaultData?.id
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
            <SheetContent className="md:max-w-[550px] md:max-h-[750px] text-[#334155] rounded-lg mt-4">
                <SheetTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">{modalTitle}</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </SheetTitle>
                <hr/>
                <div className="mt-0 px-5 overflow-y-auto ">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <TextLabel title="Farmer" subTitle={`${defaultData?.farmer?.first_name} ${defaultData?.farmer?.last_name}`} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                <div>
                                    <TextLabel title="Credit Type" subTitle={defaultData?.input_credit?.category?.name} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                <div>
                                    <TextLabel title="Inputs Credits" subTitle={defaultData?.input_credit?.name || "N/A"} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                <div>
                                    <TextLabel title="Quantity" subTitle={defaultData?.quantity} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                <div>
                                    <TextLabel title="Issue Date" subTitle={formatDateReadable(defaultData?.issue_date)} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                <div>
                                    <TextLabel title="Due Date" subTitle={formatDateReadable(defaultData?.due_date)} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                <div>
                                    <TextLabel title="Credit Amount" subTitle={`${CEDI} ${defaultData?.credit_amount}`} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                <div>
                                    <TextLabel title="Interest Rate" subTitle={`${Number(defaultData?.interest_rate || 0).toFixed(0)}%`} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                
                            </div>
                            {/*  <div className="mt-8">
                                <div>
                                    <TextLabel title="Extra Information/Notes" subTitle={defaultData?.notes} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                            </div> */}
                            <div className="grid grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="payback_method"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Type<div className='text-red-500'>*</div></FormLabel>
                                        <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        required
                                        >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {PAYMENT_TYPES.map((item, idx) => (
                                                <SelectItem key={idx} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="payment_status"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Status<div className='text-red-500'>*</div></FormLabel>
                                        <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        required
                                        >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {PAYBACK_PAYMENT_STATUS.map((item, idx) => (
                                                <SelectItem key={idx} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                {form.watch("payback_method") === "crop_exchange" && (  
                                    <FormField
                                        control={form.control}
                                        name="product"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Crop for Exchange <div className='text-red-500'>*</div></FormLabel>
                                            <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            required
                                            >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {crops?.map((item, idx) => (
                                                    <SelectItem key={idx} value={String(item?.id)}>
                                                        {item?.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                )}
                                
                                
                                    
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center">
                                                <span className="absolute left-2 mt-1 text-[#4A8D34] font-medium text-xs">{CEDI}</span>
                                                <Input placeholder="0" {...field} type="number" className="px-10" required/>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                
                                {form.watch("payback_method") === "crop_exchange" && (
                                    <FormField
                                    control={form.control}
                                    name="quantity_bags"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute right-2 mt-[10px] ms-3 text-[#4A8D34] font-medium text-xs">Bags/kg</span>
                                                <Input placeholder="0" {...field} type="number" required/>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />)}
                            </div>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="comments"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Extra Information/Notes</FormLabel>
                                        <FormControl>
                                        <Textarea placeholder="Type here..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex justify-center bg-white sticky bottom-0">
                                <Button type="submit" variant="default" className="w-full mt-3 ">
                                    <LoadingLabel isLoading={isPending || isUpdating}>{submitTitle}</LoadingLabel>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
                <DialogPoweredByFooter/>
                
            </SheetContent>
            
        </Sheet>
    )
  }