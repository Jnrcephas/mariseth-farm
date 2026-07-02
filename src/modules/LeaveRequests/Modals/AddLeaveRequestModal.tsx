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
import { Check, ChevronsUpDown, XCircle } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { TModal } from "@/modules/FarmManagement/utils/types";
import { useEmployeeList, useLeaveCreate, useLeaveTypeList, useLeaveUpdate } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { getErrorMap } from "@/lib/helpers";
import { LoadingLabel } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { leaveRequestSchema } from "../utils/validations";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";



export default function AddLeaveRequestModal({open, setOpen, defaultData, isEdit, refetch}:TModal){

    const modalTitle = isEdit ? "Edit Request" : "Add New Request";
    const submitTitle = isEdit ? "Edit Request" : "Add Request";

    const form = useForm<z.infer<typeof leaveRequestSchema>>({
        resolver: zodResolver(leaveRequestSchema),
        defaultValues: {
            ...defaultData,
            employee: String(defaultData?.employee?.id),
            leave_type: String(defaultData?.leave_type?.id),
        }
    });
    const [openDrop, setOpenDrop] = useState(false)


    const {data: _data, } = useEmployeeList({queryParams:{page: 1, page_size:50}})
    const _employees  = _data as any
    const employees = _employees?.results?.map((item: any) => ({
        label: `${item?.first_name} ${item?.last_name}`,
        value: String(item?.id),

    }))

    const {data: _dataTypes} = useLeaveTypeList({queryParams:{page: 1, page_size:50}})
    const _leaveTypes = _dataTypes as any
    const leaveTypes = _leaveTypes?.results?.map((item: any) => ({
        label: item?.name,
        value: String(item?.id)
    }))


    const {mutate, isPending} =  useLeaveCreate({
        onSuccess: () =>{
            if(refetch) refetch()
            toast.success("Leave Added Successfully")
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const {mutate: updateMutate, isPending: isUpdating} =  useLeaveUpdate({
        onSuccess: () =>{
            if(refetch) refetch()
            toast.success("Leave Edited Successfully")
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof leaveRequestSchema>) {
        const payload = {
                ...values,
                employee: Number(values?.employee),
                leave_type: Number(values?.leave_type)
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
                                    name="employee"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                        <FormLabel>Employee <div className='text-red-500'>*</div></FormLabel>
                                        <Popover open={openDrop} onOpenChange={setOpenDrop}>
                                            <PopoverTrigger asChild >
                                            <FormControl>
                                                <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                >
                                                {Number(field.value)
                                                    ? employees?.find(
                                                        (employee: any) => employee.value === field.value
                                                    )?.label
                                                    : "Select Employee"}
                                                <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="md:w-[500px] w-full p-0">
                                            <Command>
                                                <CommandInput
                                                placeholder="Search Employee..."
                                                className="h-9"
                                                required
                                                />
                                                <CommandList>
                                                <CommandEmpty>No Employee found.</CommandEmpty>
                                                <CommandGroup>
                                                    {employees?.map((employee: any) => (
                                                    <CommandItem
                                                        value={employee?.label}
                                                        key={`el-${employee?.value}`}
                                                        onSelect={() => {
                                                        form.setValue("employee", employee?.value)
                                                        setOpenDrop(false)
                                                        }}
                                                    >
                                                        {employee?.label}
                                                        <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            employee.value === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                        )}
                                                        />
                                                    </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                                </CommandList>
                                            </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="leave_type"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Leave Type <div className='text-red-500'>*</div></FormLabel>
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
                                            {leaveTypes?.map((item: any, idx: number) =>(
                                                <SelectItem key={`lt-${idx}`} value={item.value}>{item.label}</SelectItem>
                                            ))} 
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="start_date"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Type..." {...field} type="date" required/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="end_date"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Type..." {...field} type="date" min={form.watch("start_date")} required/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 gap-5">
                                <FormField
                                    control={form.control}
                                    name="reason"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reason For Leave</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Type..." {...field} />
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