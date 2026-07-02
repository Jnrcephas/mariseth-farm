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
import { useRegionsList } from "@/apis/adminApiComponents";
import { Region } from "@/apis/adminApiSchemas";
import { Download, Loader, Search } from "lucide-react";
import useGetRegionDistricts from "@/modules/FarmManagement/utils/hooks";
import { warehouseSearchSchema } from "../utils/validations";
import { toast } from "sonner";

export default function WarehouseSearch({setFilters, filters, isLoading}:TSearchProps){

    const form = useForm<z.infer<typeof warehouseSearchSchema>>({
        resolver: zodResolver(warehouseSearchSchema),
        defaultValues: {}
    });

    const {data:_regionsData, isLoading: isLoadingRegions} = useRegionsList({})
    const _regions = _regionsData as any
    const regions = _regions?.results as Region[] || []
        
    const {districts} = useGetRegionDistricts(regions, Number(form.watch("region")))


    function onSubmit(values: z.infer<typeof warehouseSearchSchema>) {
        const queryParams = cleanJsonData(values)
        setFilters((prev: any) => ({ ...prev, ...queryParams }))
    }

    function handleRest(){
        form.reset({
            query: "",           
            region: "",
            district: ""
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
                                        <Input className="px-10" placeholder="Search with warehouse ID, warehouse name" {...field} />
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
                                name="region"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Region {isLoadingRegions && <Loader className="animate-spin"/>}</FormLabel>
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
                                        {regions?.map((item, idx) => (
                                            <SelectItem key={idx} value={String(item.id)}>
                                                {item.name}
                                            </SelectItem>
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
                                name="district"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>District</FormLabel>
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
                                        {districts?.map((item, idx) => (
                                            <SelectItem key={idx} value={String(item.id)}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-6"/>
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