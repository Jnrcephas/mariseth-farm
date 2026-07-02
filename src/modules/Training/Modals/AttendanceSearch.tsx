import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cleanJsonData } from "@/lib/helpers";
import { TSearchProps } from "@/lib/types";
import { PAGE_SIZE } from "@/lib/constants";
import {  Loader, Search, XCircle } from "lucide-react";
import { attendanceSearchSchema } from "../utils/validations";

export default function AttendanceSearch({setFilters, isLoading}:TSearchProps){

    const form = useForm<z.infer<typeof attendanceSearchSchema>>({
        resolver: zodResolver(attendanceSearchSchema),
    });

    function onSubmit(values: z.infer<typeof attendanceSearchSchema>) {
        const queryParams = cleanJsonData(values)
        setFilters((prev: any) => ({ ...prev, ...queryParams }))
    }
    function handleRest(){
        form.reset({
            query: "",
        })
        setFilters({
            page: 1, page_size: PAGE_SIZE
        })
    }

    return (
        <div className="pt-5 py-5">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1">
                        <FormField
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="relative flex gap-2 items-center">
                                        <Input className="" placeholder="Search Employee " {...field} required/>
                                        <div className="flex absolute right-0 divide-x-1 divide-gray-300">
                                            <div className="pe-2">
                                                {isLoading ? <Loader className="animate-spin text-green-600" />:
                                                <Search  className="cursor-pointer text-green-600" onClick={form.handleSubmit(onSubmit)}/>}
                                            </div>
                                            <XCircle className="cursor-pointer mx-2 text-red-600" onClick={handleRest}/>
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
            {/* <div className="grid grid-cols-1">
                <div className="relative">
                    {filters?.query?.length ? <XCircle className="cursor-pointer absolute mt-2 mx-2 text-[#4A8D34] right-0" onClick={handleRest}/>
                    :<Search className="absolute mt-2 mx-2 text-[#4A8D34] right-0"/>}
                    <Input className="" placeholder="Search for employee "   onChange={(e) => handleSearch(e.target.value)} />
                </div>
            </div>  */}
        </div>
    )
}