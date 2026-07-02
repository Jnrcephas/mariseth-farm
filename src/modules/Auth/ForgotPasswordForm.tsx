'use client'

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { emailSchema } from "./utils/validations";
import { routeTo } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAccountsAuthForgotPassword } from "@/apis/adminApiComponents";
import { LoadingLabel } from "@/components/ui/label";
import { getErrorMap } from "@/lib/helpers";


export default function ForgotPasswordForm() { 
    
    const router = useRouter();
   
    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {}
    });

    const {mutate, isPending} = useAccountsAuthForgotPassword({
        onSuccess: () =>{
            toast.success("Email Sent Successfully")
            router.push(`${routeTo.sentMagicLink}?email=${form.getValues("email")}`);
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    async function onSubmit(values: z.infer<typeof emailSchema>) {
        mutate({
            body: {
                email: values.email
            }
        })
    }

    return(
        <div className="mt-5 p-5">
            <Form {...form}>
                <form className="grid grid-cols-1 gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel htmlFor="phone_number" className="!text-slate-600">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email"
                                                placeholder="Enter your email"
                                                type="email"
                                                {...field}
                                                required
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button className="rounded-lg h-[40px] cursor-pointer bg-[#4A8D34] hover:bg-[#4A8D34] font-medium" type="submit">
                        <LoadingLabel isLoading={isPending}>
                            Send Reset Instructions
                        </LoadingLabel>
                    </Button>
                     <div className="text-[#E32527] py-3 text-center">
                        <Link href={routeTo.login} className="font-normal">Wait, I Remember My Password</Link>
                    </div>
                </form>
            </Form>
        </div>
    )
}