"use client"
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
import { LoadingLabel } from "@/components/ui/label";
import { XCircle } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { useHelpCreate, useHelpUpdate } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { getErrorMap } from "@/lib/helpers";
import { helpSchema } from "../utils/validations";
import { TCategoryModal } from "../utils/types";
import { Help } from "@/apis/adminApiSchemas";

export default function AddHelpModal({open, setOpen, defaultData, isEdit, refetch}:TCategoryModal){
    const modalTitle = isEdit ? `Edit Help` : `Add New Help`;
    const submitTitle = isEdit ? `Update Help` : `Add Help`;

    const form = useForm<z.infer<typeof helpSchema>>({
        resolver: zodResolver(helpSchema),
        defaultValues: {...defaultData, description: defaultData?.description || ""},
    });

    const {mutate, isPending} = useHelpCreate({
        onSuccess: () =>{
            refetch()
            toast.success("Added Successfully")
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const {mutate:updateMutate, isPending: isUpdating} = useHelpUpdate({
        onSuccess: () =>{
            refetch()
            toast.success("Updated Successfully")
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof helpSchema>) {
        const payload = {
            title: values?.title,
            description:  values?.description,
            url: values?.url
        } as Help
        
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
            <SheetContent className="md:max-w-[550px] md:max-h-[700px] text-[#334155] rounded-lg mt-4">
                <SheetTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A] capitalize">{modalTitle}</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </SheetTitle>
                <hr/>
                <div className="mt-1 p-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 gap-8">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name<div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="url"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Link<div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Link" {...field} type="url"/>
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
                                        <FormLabel>Description </FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex justify-center">
                                <Button  type="submit" variant="default" className="w-full mt-5 capitalize">
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