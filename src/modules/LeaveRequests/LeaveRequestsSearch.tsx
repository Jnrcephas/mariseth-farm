import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cleanJsonData, debounce } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { TSearchProps } from "@/lib/types";
import { LoadingLabel } from "@/components/ui/label";
import { PAGE_SIZE } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { searchLeaveRequestsSchema } from "./utils/validations";
import { useLeaveTypeList } from "@/apis/adminApiComponents";

export default function LeaveRequestsSearch({setFilters, isLoading, refetch, pending}:TSearchProps){

    const form = useForm<z.infer<typeof searchLeaveRequestsSchema>>({
        resolver: zodResolver(searchLeaveRequestsSchema),
        defaultValues: {}
    });

    const {data: _dataTypes} = useLeaveTypeList({queryParams:{page: 1, page_size:50}})
    const _leaveTypes = _dataTypes as any
    const leaveTypes = _leaveTypes?.results?.map((item: any) => ({
        label: item?.name,
        value: String(item?.id)
    }))

    function onSubmit(values: z.infer<typeof searchLeaveRequestsSchema>) {
        const queryParams = cleanJsonData(values)
        setFilters((prev: any) => ({ ...prev, ...queryParams }))
    }

    function handleRest(){
        form.reset({
            query: "",
            status: "",
            leave_type: "",
            request_date_from: "",
            request_date_to: ""
        })
        setFilters({
            page: 1, page_size: PAGE_SIZE, pending: pending
        })
        debounce(refetch, 1)
    }

    return (
        <div className="px-5 pt-5 py-2">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 space-y-5 border rounded-xl p-5">
                    <div className="grid grid-cols-1">
                            <FormField
                                control={form.control}
                                name="query"
                                render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Search className="absolute mt-2 mx-2 text-[#4A8D34]"/>
                                            <Input className="px-10" placeholder="Search request ID, employee name" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                    <div className="grid grid-cols-12 gap-3">
                         <div className="col-span-2">
                            {pending ?
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>

                                            <SelectItem  value={"pending"}>
                                                Pending
                                            </SelectItem>
                                            <SelectItem  value={"declined"}>
                                                Declined
                                            </SelectItem>
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />:
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>

                                            <SelectItem  value={"approved"}>
                                                Approved
                                            </SelectItem>
                                            <SelectItem  value={"completed"}>
                                                Completed
                                            </SelectItem>
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            }
                        </div>
                        <div className="col-span-2">
                            <FormField
                                control={form.control}
                                name="leave_type"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Leave Type <div className='text-red-500'>*</div></FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
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
                        <div className="col-span-2">
                            <FormField
                                control={form.control}
                                name="request_date_from"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Request Date From</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Date From" {...field} type="date" max={new Date().toISOString().split("T")[0]}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-2">
                            <FormField
                                control={form.control}
                                name="request_date_to"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Request Date To</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Date To" {...field} type="date" min={form.watch("request_date_from")} max={new Date().toISOString().split("T")[0]}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                       
                        <div className="col-span-2"/>
                        <div className="col-span-2 flex justify-end gap-2 mt-5">
                            <Button type="button" className="border" variant="ghost" onClick={() => handleRest()}>
                                Reset
                            </Button>
                            <Button type="submit">
                                <LoadingLabel isLoading={isLoading}>
                                    <Search className="me-1"/> Search
                                </LoadingLabel>
                            </Button>
                            
                        </div>
                    </div>
                    
                </form>
            </Form>
        </div>
    )
}