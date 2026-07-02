import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cleanJsonData, debounce } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { TSearchProps } from "@/lib/types";
import { LoadingLabel } from "@/components/ui/label";
import { PAGE_SIZE } from "@/lib/constants";
import { Search } from "lucide-react";
import { customerSearchSchema } from "../utils/validations";

export default function InboundSearch({setFilters, isLoading, refetch}:TSearchProps){

    const form = useForm<z.infer<typeof customerSearchSchema>>({
        resolver: zodResolver(customerSearchSchema),
        defaultValues: {}
    });

    function onSubmit(values: z.infer<typeof customerSearchSchema>) {
        const queryParams = cleanJsonData(values)
        setFilters((prev: any) => ({ ...prev, ...queryParams }))
    }

    function handleRest(){
        form.reset({
            query: "",           
        })
        setFilters({
            page: 1, page_size: PAGE_SIZE, order_type: "inflow"
        })
        debounce(refetch, 1)
    }

    return (
        <div className="px-3 pt-5 py-2">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 border rounded-xl p-5">
                    <div className="grid grid-cols-1 gap-3">
                        <div className="">
                            <FormField
                                control={form.control}
                                name="query"
                                render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Query</FormLabel> */}
                                    <FormControl>
                                        <div className="relative">
                                            <Search className="absolute mt-2 mx-2 text-[#4A8D34]"/>
                                            <Input placeholder="Search Order ID" className="px-10" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" className="border" onClick={() => handleRest()}>
                             Reset
                        </Button>
                        <Button type="submit">
                            <LoadingLabel isLoading={isLoading}>
                                <Search className="me-1"/> Search
                            </LoadingLabel>
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}