"use client"
import {
    DialogPoweredByFooter,
  } from "@/components/ui/dialog"
import { TCategoryModal} from "../../utils/types";
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
import { useCustomTypeCreate, useCustomTypeUpdate } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { getErrorMap } from "@/lib/helpers";
import { categorySchema } from "../../utils/validations";

export default function AddCategoryModal({open, setOpen, category, defaultData, isEdit, refetch}:TCategoryModal){
    const categoryText = category?.replaceAll("_", " ")
    const modalTitle = isEdit ? `Edit ${categoryText}` : `Add New ${categoryText}`;
    const submitTitle = isEdit ? `Update ${categoryText}` : `Add ${categoryText}`;

    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {...defaultData, description: defaultData?.description || ""},
    });

    const {mutate, isPending} = useCustomTypeCreate({
        onSuccess: () =>{
            refetch()
            toast.success("Category Added Successfully")
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const {mutate:updateMutate, isPending: isUpdating} = useCustomTypeUpdate({
        onSuccess: () =>{
            refetch()
            toast.success("Category Updated Successfully")
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof categorySchema>) {
        const payload = {
            category_name: category,
            category_type: category,
            name: values?.name,
            description:  values?.description,
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
                                    name="name"
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