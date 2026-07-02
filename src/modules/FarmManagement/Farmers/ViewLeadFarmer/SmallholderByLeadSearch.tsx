import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cleanJsonData } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { TSearchProps } from "@/lib/types";
import { LoadingLabel } from "@/components/ui/label";
import { PAGE_SIZE } from "@/lib/constants";

import { Search } from "lucide-react";
// import { toast } from "sonner";
import { searchFarmerSchema } from "../../utils/validations";

export default function SmallholderByLeadSearch({setFilters, isLoading}:TSearchProps){

    const form = useForm<z.infer<typeof searchFarmerSchema>>({
        resolver: zodResolver(searchFarmerSchema),
        defaultValues: {}
    });

    // const {data:_regionsData, isLoading: isLoadingRegions} = useRegionsList({})
    // const _regions = _regionsData as any
    // const regions = _regions?.results as Region[] || []
    

    function onSubmit(values: z.infer<typeof searchFarmerSchema>) {
        const queryParams = cleanJsonData(values)
        setFilters((prev: any) => ({ ...prev, ...queryParams }))
    }

    function handleRest(){
        form.reset({
            query: "",
            region: "",
            district: "",
        })
        setFilters({
            page: 1, page_size: PAGE_SIZE, farmer_type: "smallholder"
        })
    }
    // function handleExport(){
    //     setFilters((prev: any) => ({ ...prev, export: true }))
    //     toast.info("Exporting data, you will be notified once the export is ready.",{position: "top-center"})
    //     debounce(() => setFilters((prev: any) => ({ ...prev, export: false })), 1000)()
    // }

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
                                        <Input className="px-10" placeholder="Search with farmer ID, farmer name, farm name" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-12 gap-3">
                       
                        <div className="col-span-10"/>
                        <div className="col-span-2 mt-5">
                            <div className="flex justify-end gap-2">
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
                    </div>
                </form>
            </Form>
        </div>
    )
}