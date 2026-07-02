"use client"
import { useAccountsAuthUpdateAccount} from "@/apis/adminApiComponents";
import { Button } from "@/components/ui/button";
import { Label, LoadingLabel } from "@/components/ui/label";
import { GENDER_OPTIONS} from "@/lib/constants";
import { getErrorMap } from "@/lib/helpers";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PhoneNumberInput from "react-phone-number-input";
import { userSchema } from "../UserManagement/utils/validations";


export default function ProfileUpdate({defaultData}:{defaultData?: any; refetch: () => void;}){

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            ...defaultData,
            phone_number: defaultData?.phone_number,
            group: String(defaultData?.groups?.[0]?.id)
        }
    });

    const {mutate, isPending} = useAccountsAuthUpdateAccount({
        onSuccess: () =>{
            toast.success("Profile Updated Successfully")
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof userSchema>) {
        const payload = {
            first_name: values?.first_name,
            last_name: values?.last_name,
            gender: values?.gender as "m" | "f",
            email: defaultData?.email,
            phone_number: values?.phone_number,
            username: defaultData?.email,
            user_type: defaultData?.user_type
        } 
        mutate({
            body: payload,
        })
    }
    return (
        <div className="mt-1 p-5 w-full">
            
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
                                <FormLabel>Email </FormLabel>
                                <FormControl>
                                <Input placeholder="Enter Email" {...field} type="email" disabled value={defaultData?.email}/>
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
                                <FormLabel>Role </FormLabel>
                                <FormControl>
                                <Input {...field} type="email" disabled value={defaultData?.groups?.[0]?.name}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        
                    </div>
                    <div className="flex justify-center">
                        <Button type="submit" variant="default" className="w-[150px] mt-5">
                            <LoadingLabel isLoading={isPending}>
                                Save
                            </LoadingLabel>
                        </Button>
                    </div>
                </form>
            </Form>

        </div>
    )
}