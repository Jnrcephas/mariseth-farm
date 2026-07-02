import { useLeaveApproveDecline } from "@/apis/adminApiComponents";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { LoadingLabel } from "@/components/ui/label";
import { getErrorMap } from "@/lib/helpers";
import { XCircle } from "lucide-react"
import { toast } from "sonner";
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
import { z } from "zod";
import { denyRequestSchema } from "../utils/validations";
import { Textarea } from "@/components/ui/textarea";

export default function DenyLeaveRequest({
    open, 
    setOpen, 
    data,
    refetch}:{
        open: boolean, 
        setOpen: (open: boolean) => void, 
        data: any;
        refetch: () => void;
    }) {

    const form = useForm<z.infer<typeof denyRequestSchema>>({
        resolver: zodResolver(denyRequestSchema),
    });

    const {mutate, isPending} = useLeaveApproveDecline({
        onSuccess: () =>{
            refetch()
            setOpen(false)
            toast.success("Leave Request Denied Successfully")
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })
    const onSubmit = (values: z.infer<typeof denyRequestSchema>) => {
        const payload = {
            action: "decline",
            rejection_reason: values?.rejection_reason
        } as any
        mutate({
            body: payload,
            pathParams: {
                id: data?.id
            }
        })
    }
    return(
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[500px] p-0 text-[#334155] !rounded-b-lg">
                <DialogTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">Are you sure you want to deny this leave request?</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <div className="grid grid-cols-1 gap-5 p-5">
                            <FormField
                                control={form.control}
                                name="rejection_reason"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-500">Type reason for rejecting this leave request. This action can be undone.</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Type..." {...field} required/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="flex !justify-between p-5 bg-[#F8FAFC]">
                            <Button type="button" variant={"outline"} onClick={() => setOpen(false)}>Cancel</Button>
                            <Button  type="submit" variant={"destructive"}>
                                <LoadingLabel isLoading={isPending}>
                                    Yes, Deny Request
                                </LoadingLabel>
                            </Button>
                        </DialogFooter> 
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}