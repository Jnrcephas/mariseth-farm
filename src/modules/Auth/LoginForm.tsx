'use client'

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginSchema } from "./utils/validations";
import { routeTo } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useUserStore } from "@/app/providers/user-store-provider";
import { IPermObj } from "@/hooks/auth/useHasAccess";
import { LoadingLabel } from "@/components/ui/label";
import { fetchUserGroupsApi } from "@/lib/auth";


export default function LoginForm() { 

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const updateUser = useUserStore((state) => state.updateUser)
   
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setLoading(true);

    const res = await signIn("credentials", {
      email: values?.email,
      password: values?.password,
      redirect: false,
    });
    if (res?.status === 200 && res.ok) {
      const userData = await getSession()
      
      const userPermissionResponse = await fetchUserGroupsApi();
      const userPermission = userPermissionResponse?.data?.results?.[0]?.permissions;

      const permObj: { [key: string]: IPermObj } = {};
      const permissions = userPermission || []

      permissions?.map((perm: IPermObj) => {
          permObj[`${perm.codename}`] = perm
      })
      updateUser({...userData?.user, permissions:permObj} as any)
      toast.success("Logged in successfully");
      router.push(routeTo.dashboard);
    }else{
      toast.error("Invalid email or password");

    }
    setLoading(false);
  };
    

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
                                    <FormLabel htmlFor="email" className="!text-slate-600">Email</FormLabel>
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
                    <div>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="grid gap-2 relative">
                                    <FormLabel htmlFor="password" className="!text-slate-600 text-normal">Password</FormLabel>
                                    {showPassword ? 
                                        <EyeOff className="absolute right-0 mt-7 me-3 text-slate-400" onClick={() => setShowPassword(!showPassword)}/> : 
                                        <Eye className="absolute right-0 mt-7 me-3 text-slate-400" onClick={() => setShowPassword(!showPassword)}/>}
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
                         <div className="text-[#E32527] text-end mt-1">
                            <Link href={routeTo.forgotPassword} className="font-normal">Forgot password?</Link>
                        </div>
                    </div>
                   
                    <Button className="mt-3 rounded-lg h-[40px] cursor-pointer bg-[#4A8D34] hover:bg-[#4A8D34] font-medium" type="submit" disabled={loading}>
                        <LoadingLabel isLoading={loading}>
                            Sign in
                        </LoadingLabel>
                    </Button>
                </form>
            </Form>
        </div>
    )
}