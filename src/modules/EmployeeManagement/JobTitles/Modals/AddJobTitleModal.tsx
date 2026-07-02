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
import { Link, XCircle } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { TModal } from "@/modules/FarmManagement/utils/types";
import { useCustomTypeList, useDepartmentList, useJobTitleCreate, useJobTitleUpdate } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { cleanJsonData, getErrorMap } from "@/lib/helpers";
import {  LoadingLabel } from "@/components/ui/label";
import { jobTitleSchema } from "../../utils/validations";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



export default function AddJobTitleModal({open, setOpen, defaultData, isEdit, refetch}:TModal){

    const modalTitle = isEdit ? "Edit Job Title" : "Add New Job Title";
    const submitTitle = isEdit ? "Edit Job Title" : "Add Job Title";

    const form = useForm<z.infer<typeof jobTitleSchema>>({
        resolver: zodResolver(jobTitleSchema),
        defaultValues: {
            ...defaultData,
            department: String(defaultData?.department?.id),
            level: String(defaultData?.level?.id),
            job_description_url: defaultData?.job_description_url || ""
        }
    });

    const {data: _data} = useDepartmentList({queryParams:{page: 1, page_size:50}})
    const _departments = _data as any
    const departments = _departments?.results || []

    const {data:_customTypesData} = useCustomTypeList({queryParams:{query: "job_title_level"}})
    const customTypes = _customTypesData?.results || []


    const {mutate, isPending} =  useJobTitleCreate({
        onSuccess: () =>{
            if(refetch) refetch()
            toast.success("Job Title Added Successfully")
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const {mutate: updateMutate, isPending: isUpdating} =  useJobTitleUpdate({
        onSuccess: () =>{
            if(refetch) refetch()
            toast.success("Job Title Edited Successfully")
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof jobTitleSchema>) {
        const payload = cleanJsonData({
            name: values?.name,
            department: values?.department,
            level: values?.level,
            job_description_url: values?.job_description_url
        })
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
                                        <FormLabel>Job Title <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Job Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 gap-5">
                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department<div className='text-red-500'>*</div></FormLabel>
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
                                            {departments?.map((item: any, idx: number) => (
                                                <SelectItem key={`d-${idx}`} value={`${item?.id}`}>{item?.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-5">
                                <FormField
                                    control={form.control}
                                    name="level"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Level<div className='text-red-500'>*</div></FormLabel>
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
                                                <SelectItem key={`c-${idx}`} value={`${item?.id}`}>{item?.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-5">
                                <FormField
                                    control={form.control}
                                    name="job_description_url"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Link className="absolute text-green-600 mt-2 mx-2"/>
                                                <Input placeholder="Enter url" className="px-10" {...field} type="url"/>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
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