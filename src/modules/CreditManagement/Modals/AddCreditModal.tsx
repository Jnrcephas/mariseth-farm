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
import { creditSchema } from "../utils/validations";
import { useAllFarmers } from "@/modules/FarmManagement/utils/hooks";
import { Textarea } from "@/components/ui/textarea";
import { cleanJsonData, getErrorMap } from "@/lib/helpers";
import { useCreditCreate, useCreditUpdate, useCustomTypeList, useInputCreditList } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { LoadingLabel } from "@/components/ui/label";


export default function AddCreditModal({open, setOpen, defaultData, refetch, isEdit}:TModal){

    const modalTitle = isEdit ? "Edit Credit" : "Record New Credit";
    const submitTitle = isEdit ? "Update Credit" : "Add New Credit";

    const form = useForm<z.infer<typeof creditSchema>>({
        resolver: zodResolver(creditSchema),
        defaultValues: defaultData,
    });

    const {allFarmers} = useAllFarmers("")

    const {data:_customTypesData} = useCustomTypeList({queryParams:{page: 1, page_size:100}})
    const customTypes = _customTypesData?.results || []

    const inputCreditsCategories = customTypes?.filter((item) => item?.category_name === "input_credits_category")
    const quantityMetrics = customTypes?.filter((item) => item?.category_name === "quantity_metric")

    const {data: _data} = useInputCreditList({queryParams: {page: 1, page_size: 100, category: form.watch("input_credit_category")}},{
        enabled: Boolean(form.watch("input_credit_category"))
    })
    const inputCredits = _data as any

   

    
    const {mutate, isPending} = useCreditCreate({
        onSuccess: () =>{
            refetch?.()
            toast.success("Credit added successfully");
            setOpen(false);
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })
    const {mutate: updateMutate, isPending: isUpdating} = useCreditUpdate({
        onSuccess: () =>{
            toast.success("Credit updated successfully");
            setOpen(false);},
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof creditSchema>) {
        const payload = cleanJsonData({
            ...values,
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
            <SheetContent className="md:max-w-[550px] md:max-h-[625px] text-[#334155] rounded-lg mt-4">
                <SheetTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">{modalTitle}</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </SheetTitle>
                <hr/>
                <div className="mt-0 px-5 overflow-y-auto ">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid grid-cols-1 gap-5">
                                <FormField
                                    control={form.control}
                                    name="farmer"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Farmer Name
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
                                            {allFarmers?.map((item, idx) =>(
                                                <SelectItem key={idx} value={String(item?.id)}>{item?.first_name} {item?.last_name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="input_credit_category"
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
                                            {inputCreditsCategories?.map((item: any, idx: number) => (
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
                                <div className="grid grid-cols-12 gap-5">
                                    <div className="col-span-8">
                                        <FormField
                                            control={form.control}
                                            name="quantity"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Quantity <div className='text-red-500'>*</div></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0" {...field} type="number"/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <div className="mt-4s">
                                                <FormField
                                                    control={form.control}
                                                    name="quantity_metric"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Metric <div className='text-red-500'>*</div></FormLabel>
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
                                                                    {quantityMetrics?.map((item: any, idx:number) =>(
                                                                        <SelectItem key={`mq${idx}`} value={String(item?.id)}>{item?.name}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                        </div>

                                    </div>
                                </div>
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
                            {/* move below to approval  */}
                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="issue_date"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Issue Date <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="due_date"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Due Date <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input type="date" {...field} min={form.watch("issue_date")}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>  
                                )}/>

                            </div>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="interest_rate"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Interest Rate <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center">
                                                <span className="absolute right-2 ms-2s text-[#4A8D34] font-medium text-xs">%</span>
                                                    <Input placeholder="0" {...field} type="number"/>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>  
                                )}/>
                            </div> */}
                            
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