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
import { useCustomerCreate, useCustomerUpdate } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { getErrorMap } from "@/lib/helpers";
import { LoadingLabel } from "@/components/ui/label";
import { customerSchema } from "../../../Accounting/utils/validations";
import PhoneNumberInput from "react-phone-number-input";



export default function AddCustomerModal({open, setOpen, defaultData, isEdit, refetch}:TModal){

    const modalTitle = isEdit ? "Edit Customer" : "Add New Customer";
    const submitTitle = isEdit ? "Update Customer" : "Add Customer";

    const form = useForm<z.infer<typeof customerSchema>>({
        resolver: zodResolver(customerSchema),
        defaultValues: defaultData
    });


    const {mutate, isPending} =  useCustomerCreate({
        onSuccess: () =>{
            if(refetch) refetch()
            toast.success("Customer Added Successfully")
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const {mutate: updateMutate, isPending: isUpdating} =  useCustomerUpdate({
        onSuccess: () =>{
            if(refetch) refetch()
            toast.success("Customer Added Successfully")
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof customerSchema>) {
        const payload = {
            name: values?.name ?? "",
            phone_number: values?.phone_number ?? "",
            email: values?.email ?? "",
            location: values?.location ?? "",
            company: values?.company ?? "",
            comments: values?.comments ?? "",
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
                                        <Input placeholder="Enter Customer Fullname" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="phone_number"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <PhoneNumberInput
                                                {...field}
                                                maxLength={12}
                                                placeholder={"eg. 024 123 4567"}
                                                defaultCountry="GH"
                                                className="phone-input"
                                                international={false}
                                                countryCallingCodeEditable={true}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                        <Input placeholder="Email" {...field} type="email"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="company"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company</FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Company" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Location" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1">
                                <FormField
                                    control={form.control}
                                    name="comments"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Comments</FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Comments" {...field} />
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