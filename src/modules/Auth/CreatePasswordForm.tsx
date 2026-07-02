'use client'

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createPasswordSchema } from "./utils/validations";
import { routeTo } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { useAccountsAuthResendVerificationCode, useAccountsAuthResetPassword } from "@/apis/adminApiComponents";
import { getErrorMap } from "@/lib/helpers";
import { LoadingLabel } from "@/components/ui/label";


export default function CreatePasswordForm() { 

    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const verification_code = searchParams.get("verification_code");

    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    
    const router = useRouter();
   
    const form = useForm<z.infer<typeof createPasswordSchema>>({
        resolver: zodResolver(createPasswordSchema),
        defaultValues: {
            verification_code: verification_code || "",
            password: "",
            confirm_password: ""
        }
    });

    const {mutate: resendMutate, isPending:isSending} = useAccountsAuthResendVerificationCode({
        onSuccess: () =>{
            toast.success("Verification code email sent successfully to " + email);
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const {mutate, isPending} = useAccountsAuthResetPassword({
        onSuccess: () =>{
            toast.success("Password reset successful");
            router.push(routeTo.createPasswordSuccess)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function resendVerificationCode(){
        resendMutate({
            body: {
                email: email || ""  
        }})
    }

    async function onSubmit(values: z.infer<typeof createPasswordSchema>) {
        mutate({
            body: {
                email: email || "",
                verification_code: Number(values?.verification_code),
                new_password: values?.password,
            }
        })
    }

    return(
        <div className="mt-5 p-5">
            <Form {...form}>
                <form className="grid grid-cols-1 gap-4 space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col items-center justify-center">
                         <FormLabel className="!text-slate-600 text-center mb-3 text-lg">Verification Code</FormLabel>
                        <FormField
                            control={form.control}
                            name="verification_code"
                            render={({ field }) => (
                                <FormItem>
                                    <InputOTP maxLength={6} {...field} className="!w-full">
                                        <InputOTPGroup >
                                            <InputOTPSlot index={0} className="w-12"/>
                                            <InputOTPSlot index={1} className="w-12"/>
                                            <InputOTPSlot index={2} className="w-12"/>
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup >
                                            <InputOTPSlot index={3} className="w-12"/>
                                            <InputOTPSlot index={4} className="w-12"/>
                                            <InputOTPSlot index={5} className="w-12"/>
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormItem>
                        )}/>
                        {email &&
                        <small className="mt-2 text-slate-500">Didn&apos;t receive verification code? 
                            <span className="font-bold text-[#4A8D34] cursor-pointer ml-2 underline" onClick={resendVerificationCode}>
                               {isSending ? "Loading..." : "Resend"} 
                            </span>
                        </small>}
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel htmlFor="password" className="!text-slate-600">Password</FormLabel>
                                    {showPassword ? 
                                        <EyeOff className="absolute right-0 mt-7 me-7 text-slate-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}/> : 
                                        <Eye className="absolute right-0 mt-7 me-7 text-slate-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}/>}
                                        <FormControl>
                                            <Input
                                                id="password"
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
                        <small className="mt-2 text-slate-500">Password should be at least 8 characters long.</small>
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="confirm_password"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel htmlFor="confirm_password" className="!text-slate-600">Confirm Password</FormLabel>
                                    {showPassword2 ? 
                                        <EyeOff className="absolute right-0 mt-7 me-7 text-slate-400 cursor-pointer" onClick={() => setShowPassword2(!showPassword2)}/> : 
                                        <Eye className="absolute right-0 mt-7 me-7 text-slate-400 cursor-pointer" onClick={() => setShowPassword2(!showPassword2)}/>}
                                        <FormControl>
                                            <Input
                                                id="confirm_password"
                                                placeholder="Confirm your password"
                                                type={showPassword2 ? `text` : `password`}
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
                            Create New Password
                        </LoadingLabel>
                    </Button>
                </form>
            </Form>
        </div>
    )
}