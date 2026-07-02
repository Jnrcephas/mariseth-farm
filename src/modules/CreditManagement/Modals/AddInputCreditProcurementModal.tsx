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
import { inputCreditProcurementSchema } from "../utils/validations";

import { Textarea } from "@/components/ui/textarea";
import { cleanJsonData, getErrorMap } from "@/lib/helpers";
import { useCustomTypeList, useInputCreditInputCreditPurchase, useInputCreditList, useWarehouseList } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { LoadingLabel } from "@/components/ui/label";


export default function AddInputCreditProcurementModal({open, setOpen, defaultData, refetch, isEdit}:TModal){

    const modalTitle = isEdit ? "Edit Input Credit Purchase" : "Add Input Credit Purchase";
    const submitTitle = isEdit ? "Update Input Credit Purchase" : "Input Credit Purchase";

    const form = useForm<z.infer<typeof inputCreditProcurementSchema>>({
        resolver: zodResolver(inputCreditProcurementSchema),
        defaultValues: defaultData,
    });

    const {data:_customTypesData} = useCustomTypeList({queryParams:{query: "input_credits_category"}})
    const customTypes = _customTypesData?.results || []

    const {data: _data} = useInputCreditList({queryParams: {page: 1, page_size: 100, category: form.watch("category")}})
    const inputCredits = _data as any

    const {data: _warehouseData} = useWarehouseList({queryParams: {page: 1, page_size: 100} as any})
    const warehouses = _warehouseData?.results as any[] || []

   
    const {mutate, isPending} = useInputCreditInputCreditPurchase({
        onSuccess: () =>{
            refetch?.()
            toast.success("Credit added successfully");
            setOpen(false);},
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof inputCreditProcurementSchema>) {
        const payload = cleanJsonData({
            ...values,
        })
       
        mutate({
            body: payload
        })
        
    }

    return(
        <Sheet open={open}>
            <SheetContent className="md:max-w-[550px] md:max-h-[705px] text-[#334155] rounded-lg mt-4">
                <SheetTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">{modalTitle}</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </SheetTitle>
                <hr/>
                <div className="mt-0 px-5 overflow-y-auto ">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid grid-cols-1 gap-5">
                                <div className="grid grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Input Credit Category
                                            <div className='text-red-500'>*</div>
                                        </FormLabel>
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
                                            {customTypes?.map((item: any, idx: number) => (
                                                <SelectItem key={`inc-${idx}`} value={`${item?.id}`}>{item?.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="input_credit"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Input Credit
                                            <div className='text-red-500'>*</div>
                                        </FormLabel>
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
                                            {inputCredits?.results?.map((item: any, idx:number) =>(
                                                <SelectItem key={`ics${idx}`} value={String(item?.id)}>{item?.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="purchase_date"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Purchase Date <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input type="date" {...field} max={new Date().toISOString().split("T")[0]} required/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="source"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Source </FormLabel>
                                        <FormControl>
                                        <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="warehouse"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Warehouse<div className='text-red-500'>*</div></FormLabel>
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
                                            {warehouses?.map((item, idx) => (
                                                <SelectItem key={idx} value={String(item?.id)}>{item?.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute right-2 mt-[10px] ms-3 text-[#4A8D34] font-medium text-xs">Bags/kg</span>
                                                <Input placeholder="0" {...field} type="number"/>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="notes"
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
                                    <LoadingLabel isLoading={isPending}>{submitTitle}</LoadingLabel>
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