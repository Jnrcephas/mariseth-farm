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
import { inputCreditSchema } from "../utils/validations";
import { cleanJsonData, getErrorMap } from "@/lib/helpers";
import {  useCustomTypeList, useInputCreditCreate, useInputCreditUpdate } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { LoadingLabel } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";


export default function AddInputCreditModal({open, setOpen, defaultData, isEdit, refetch}:TModal){

    const modalTitle = isEdit ? "Edit Input Credit" : "Record New Input Credit";
    const submitTitle = isEdit ? "Update Input Credit" : "Add Input Credit";

    const queryClient = useQueryClient();

    const {data:_customTypesData} = useCustomTypeList({queryParams:{query: "input_credits_category"}})
    const customTypes = _customTypesData?.results || []

    const form = useForm<z.infer<typeof inputCreditSchema>>({
        resolver: zodResolver(inputCreditSchema),
        defaultValues: {
            ...defaultData,
            category: String(defaultData?.category?.id),
            weight: String(defaultData?.weight)
        },
    });

    const {mutate, isPending} = useInputCreditCreate({
        onSuccess: () =>{
            refetch?.()
            queryClient.refetchQueries({
                queryKey: ['useInputCreditList']
            });
            toast.success("Input Credit added successfully");
            setOpen(false);},
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })
    const {mutate: updateMutate, isPending: isUpdating} = useInputCreditUpdate({
        onSuccess: () =>{
            queryClient.refetchQueries({
                queryKey: ['useCreditList'],
            });
            toast.success("Input Credit updated successfully");
            setOpen(false);},
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof inputCreditSchema>) {
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
            <SheetContent className="md:max-w-[550px] md:max-h-[520px] text-[#334155] rounded-lg mt-4">
                <SheetTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">{modalTitle}</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </SheetTitle>
                <hr/>
                <div className="mt-0 px-5 overflow-y-autos ">
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
                                        <Input placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
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
                                    name="price"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Input Credits <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="" {...field} type="number"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="weight"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Weight <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute right-2 mt-[10px] ms-3 text-[#4A8D34] font-medium text-xs">kg</span>
                                                <Input placeholder="0" {...field} type="number"/>
                                            </div>
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