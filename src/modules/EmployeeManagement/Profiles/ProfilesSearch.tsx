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
import { Download, Search } from "lucide-react";
import { searchEmployeeSchema } from "../utils/validations";
import { useDepartmentList } from "@/apis/adminApiComponents";
import { toast } from "sonner";

export default function ProfilesSearch({setFilters, filters, isLoading}:TSearchProps){

    const form = useForm<z.infer<typeof searchEmployeeSchema>>({
        resolver: zodResolver(searchEmployeeSchema),
        defaultValues: {}
    });

    const {data: _departments} = useDepartmentList({queryParams:{page: 1, page_size: 50}})
    const departments = _departments as any


    function onSubmit(values: z.infer<typeof searchEmployeeSchema>) {
        const queryParams = cleanJsonData(values)
        setFilters((prev: any) => ({ ...prev, ...queryParams }))
    }

    function handleRest(){
        form.reset({
            query: "",
            department: "",
            status: "",
        })
        setFilters({
            page: 1, page_size: PAGE_SIZE
        })
    }

    function handleExport(){
        setFilters((prev: any) => ({ ...prev, export: true }))
        toast.info("Exporting data, you will be notified once the export is ready.",{position: "top-center"})
        debounce(() => setFilters((prev: any) => ({ ...prev, export: false })), 1000)()
    }

    return (
        <div className="px-5 pt-5 py-2">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 border rounded-xl p-5">
                    <div className="grid grid-cols-1">
                        <FormField
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <Search className="absolute mt-2 mx-2 text-[#4A8D34]"/>
                                        <Input className="px-10" placeholder="Search with employee ID, name, email, phone number" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-12 gap-3">
                        
                        <div className="col-span-2">
                            <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department</FormLabel>
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
                                            {departments?.results?.map((item: any, idx: number) => (
                                                <SelectItem key={`d-${idx}`} value={String(item?.id)}>{item?.name}</SelectItem>
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
                                        <SelectItem  value={"active"}>
                                            Active
                                        </SelectItem>
                                        <SelectItem  value={"inactive"}>
                                            Inactive
                                        </SelectItem>
                                        <SelectItem  value={"suspended"}>
                                            Suspended
                                        </SelectItem>
                                         <SelectItem  value={"dismissed"}>
                                            Dismissed
                                        </SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-6"></div>
                        <div className="col-span-2 mt-5">
                            <div className="flex justify-end gap-2">
                                <Button type="button" className="border" variant="ghost" onClick={() => handleRest()}>
                                    Reset
                                </Button>
                                <Button type="button" className="border border-green-700 text-green-700" variant="outline" onClick={() => handleExport()}>
                                    <LoadingLabel isLoading={isLoading && Boolean(filters?.export)}>
                                        <Download className="me-1"/>Download Report
                                    </LoadingLabel>
                                </Button>
                                <Button type="submit">
                                    <LoadingLabel isLoading={isLoading}>
                                        <Search className="me-1"/> Search
                                    </LoadingLabel>
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}