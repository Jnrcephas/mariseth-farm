import { useEmployeeDisciplinaryAction, useEmployeeUpdate } from "@/apis/adminApiComponents";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeDisciplinarySchema } from "../../utils/validations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DISCIPLINARY_ACTIONS } from "../../utils/constants";
import { Textarea } from "@/components/ui/textarea";

export default function DisciplinaryModal({
    open, 
    setOpen, 
    data,
    refetch}:{
        open: boolean, 
        setOpen: (open: boolean) => void, 
        data: any;
        refetch: () => void;
    }) {

    const form = useForm<z.infer<typeof employeeDisciplinarySchema>>({
        resolver: zodResolver(employeeDisciplinarySchema),
    });

    const {mutate, isPending} = useEmployeeDisciplinaryAction({
        onSuccess: () =>{
            refetch()
            setOpen(false)
            toast.success("Disciplinary Action Recorded Successfully")
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const {mutate: updateMutate, isPending: isUpdating} =  useEmployeeUpdate({
        onSuccess: () =>{
            refetch()
            setOpen(false)
            toast.success("Employee Restored Successfully")
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })
    
    function onSubmit(values: z.infer<typeof employeeDisciplinarySchema>) {
        const payload = {
            action_type: values?.action_type,
            offence: values?.offense
        }
        if(values?.action_type !== "active"){
            mutate({
                pathParams: {
                    id: data?.id
                },
                body: payload as any
            })
        }else{
            updateMutate({
                pathParams: {
                    id: data?.id
                },
                body: {status: "active"} as any
            })
        }
    }
    return(
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[550px] p-0 text-[#334155] !rounded-b-lg">
                <DialogTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">Disciplinary Actions</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pb-5 px-5">
                        <div className="grid grid-cols-1 gap-5">
                            <p className="capitalize text-center text-xl">{data?.first_name} {data?.last_name}</p>
                            <FormField
                                control={form.control}
                                name="action_type"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Action<div className='text-red-500'>*</div></FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        required
                                    >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select" />
                                        </SelectTrigger> 
                                    </FormControl>
                                    <SelectContent>
                                        {DISCIPLINARY_ACTIONS?.map((item, idx) => (
                                            <SelectItem key={`d-${idx}`} value={item.value}>{item?.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            {form.watch("action_type") !== "active" &&
                            <FormField
                                control={form.control}
                                name="offense"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Offense<div className='text-red-500'>*</div></FormLabel>
                                    <FormControl>
                                    <Textarea placeholder="Type here..." {...field} required/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />}
                        </div>
                        <Button type="submit" variant={"default"} className="w-full">
                            <LoadingLabel isLoading={isPending || isUpdating}>
                               {form.watch("action_type") === "active" ? "Restore": "Add Disciplinary Action"} 
                            </LoadingLabel>
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}