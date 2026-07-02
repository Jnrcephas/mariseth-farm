'use client'

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAccountsAuthUpdatePassword } from "@/apis/adminApiComponents";
import { getErrorMap } from "@/lib/helpers";
import { LoadingLabel } from "@/components/ui/label";
import { changePasswordSchema } from "../Auth/utils/validations";
import { useUserActions } from "@/hooks/auth/useAuth";


export default function ChangePassword() { 
    const {logout} = useUserActions()

    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [showPassword3, setShowPassword3] = useState(false)
       
    const form = useForm<z.infer<typeof changePasswordSchema>>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {}
    });


    const {mutate, isPending} = useAccountsAuthUpdatePassword({
        onSuccess: () =>{
            toast.success("Password changed successful");
            logout()
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    async function onSubmit(values: z.infer<typeof changePasswordSchema>) {
        mutate({
            body: {
                new_password: values?.new_password,
                old_password: values?.old_password,
            }
        })
    }

    return(
        <div className="mt-5 p-5 flex justify-center">
            <Form {...form}>
                <form className="grid grid-cols-1 gap-4 space-y-3 w-[500px]" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="relative">
                        <FormField
                            control={form.control}
                            name="old_password"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel htmlFor="old_password" className="!text-slate-600">Old Password</FormLabel>
                                    {showPassword ? 
                                        <EyeOff className="absolute right-0 mt-7 me-7 text-slate-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}/> : 
                                        <Eye className="absolute right-0 mt-7 me-7 text-slate-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}/>}
                                        <FormControl>
                                            <Input
                                                id="old_password"
                                                placeholder="Enter your password"
                                                type={showPassword ? `text` : `password`}
                                                {...field}
                                                required
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <div className="relative">
                        <FormField
                            control={form.control}
                            name="new_password"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel htmlFor="password" className="!text-slate-600">Password</FormLabel>
                                    {showPassword2 ? 
                                        <EyeOff className="absolute right-0 mt-7 me-7 text-slate-400 cursor-pointer" onClick={() => setShowPassword2(!showPassword2)}/> : 
                                        <Eye className="absolute right-0 mt-7 me-7 text-slate-400 cursor-pointer" onClick={() => setShowPassword2(!showPassword2)}/>}
                                        <FormControl>
                                            <Input
                                                id="password"
                                                placeholder="Enter your password"
                                                type={showPassword2 ? `text` : `password`}
                                                {...field}
                                                required
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <small className="mt-2 text-slate-500">Password should be at least 8 characters long.</small>
                    </div>
                    <div className="relative">
                        <FormField
                            control={form.control}
                            name="confirm_password"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel htmlFor="confirm_password" className="!text-slate-600">Confirm Password</FormLabel>
                                    {showPassword3 ? 
                                        <EyeOff className="absolute right-0 mt-7 me-7 text-slate-400 cursor-pointer" onClick={() => setShowPassword3(!showPassword3)}/> : 
                                        <Eye className="absolute right-0 mt-7 me-7 text-slate-400 cursor-pointer" onClick={() => setShowPassword3(!showPassword3)}/>}
                                        <FormControl>
                                            <Input
                                                id="confirm_password"
                                                placeholder="Confirm your password"
                                                type={showPassword3 ? `text` : `password`}
                                                {...field}
                                                required
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <small className="mt-2 text-slate-500">This should be the same as the password imputed above.</small>
                    </div>
                    <Button className="rounded-lg h-[40px] cursor-pointer bg-[#4A8D34] hover:bg-[#4A8D34] font-medium" type="submit">
                        <LoadingLabel isLoading={isPending}>
                            Change Password
                        </LoadingLabel>
                    </Button>
                </form>
            </Form>
        </div>
    )
}