"use client"
import { useAccountsUsersAdminCreate, useAccountsUsersAdminUpdate, useAccountsUsersGroupsList } from "@/apis/adminApiComponents";
import { Button } from "@/components/ui/button";
import { Label, LoadingLabel } from "@/components/ui/label";
import { GENDER_OPTIONS, routeTo } from "@/lib/constants";
import { getErrorMap } from "@/lib/helpers";
import { ArrowLeft, Loader, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { userSchema } from "../utils/validations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PhoneNumberInput from "react-phone-number-input";


export default function AddUser({isEdit, defaultData={}}:{isEdit?: boolean; defaultData?: any}){

    const submitTitle = isEdit ? "Update Admin User" : "Add Admin User";

    const router = useRouter()
    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            ...defaultData,
            phone_number: defaultData?.phone_number,
            group: String(defaultData?.groups?.[0]?.id)
        }
    });

    const {data: _roles, isLoading: isLoadingGroups} = useAccountsUsersGroupsList({})
    const rolesDate = _roles as any
    const roles = rolesDate?.results as any[] || []


     const {mutate, isPending} = useAccountsUsersAdminCreate({
        onSuccess: () =>{
            toast.success("User Admin Added Successfully")
            router.push(routeTo.userAccount)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const {mutate: updateMutate, isPending: isUpdating} = useAccountsUsersAdminUpdate({
        onSuccess: () =>{
            toast.success("User Admin Updated Successfully")
            router.push(routeTo.userAccount)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof userSchema>) {
        const payload = {
            first_name: values?.first_name,
            last_name: values?.last_name,
            gender: values?.gender,
            email: values?.email,
            phone_number: values?.phone_number,
            group: values?.group,
            username: values?.email
        } as any

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
    return (
        <div className="mt-1 p-5 w-full">
            <div className="flex justify-between mb-5">
                <Button variant="outline" className="cursor-pointer" onClick={() => router.push(routeTo.userAccount)}>
                   <ArrowLeft className="text-[#16A34A]"/>  Discard
                </Button>
                <Button variant="outline" className="bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A] cursor-pointer" onClick={form.handleSubmit(onSubmit)}>
                   <Save className="text-[#16A34A]"/>  
                   <LoadingLabel isLoading={isPending || isUpdating}>{submitTitle}</LoadingLabel>
                </Button>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name <div className='text-red-500'>*</div></FormLabel>
                                <FormControl>
                                <Input placeholder="Enter First Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name <div className='text-red-500'>*</div></FormLabel>
                                <FormControl>
                                <Input placeholder="Enter Last Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div>
                            <Label className="capitalize mb-3">Gender<div className='text-red-500'>*</div></Label>
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <RadioGroup 
                                            className="flex flex-row w-full gap-x-6"
                                            required
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                        {GENDER_OPTIONS.map((item, idx) =>(
                                            <div key={idx} className="flex items-center space-x-2">
                                                <RadioGroupItem value={item.value} id={item.value} />
                                                <Label htmlFor={item.value} className="capitalize cursor-pointer">{item.label}</Label>
                                            </div>
                                        ))}
                                        <FormMessage />
                                    </RadioGroup> 
                                </FormItem>
                            )}/>
                        </div>
                        <FormField
                            control={form.control}
                            name="phone_number"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number <div className='text-red-500'>*</div></FormLabel>
                                <FormControl>
                                    <PhoneNumberInput
                                        {...field}
                                        maxLength={12}
                                        placeholder={"eg. 024 123 4567"}
                                        defaultCountry="GH"
                                        className="phone-input"
                                        international={false}
                                        countryCallingCodeEditable={true}
                                        required
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
                                <FormLabel>Email <div className='text-red-500'>*</div></FormLabel>
                                <FormControl>
                                <Input placeholder="Enter Email" {...field} type="email"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="group"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role {isLoadingGroups && <Loader className="animate-spin"/>}<div className='text-red-500'>*</div></FormLabel>
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
                                    {roles?.map((item, idx) => (
                                        <SelectItem key={idx} value={String(item.id)}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-center">
                        <Button type="submit" variant="default" className="w-[150px] mt-5">
                            <LoadingLabel isLoading={isPending || isUpdating}>
                                {submitTitle}
                            </LoadingLabel>
                        </Button>
                    </div>
                </form>
            </Form>

        </div>
    )
}