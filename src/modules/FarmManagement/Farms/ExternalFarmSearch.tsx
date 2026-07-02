import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { searchFarmSchema } from "../utils/validations";
import { cleanJsonData, debounce } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { TSearchProps } from "@/lib/types";
import { LoadingLabel } from "@/components/ui/label";
import { PAGE_SIZE } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useGetRegionDistricts from "../utils/hooks";
import { useFarmManagementProductList, useRegionsList } from "@/apis/adminApiComponents";
import { Region } from "@/apis/adminApiSchemas";
import { Download, Search } from "lucide-react";
import { landOwnershipTypes } from "../utils/constants";
import { toast } from "sonner";

export default function ExternalFarmSearch({setFilters, filters, isLoading}:TSearchProps){

    const form = useForm<z.infer<typeof searchFarmSchema>>({
        resolver: zodResolver(searchFarmSchema),
        defaultValues: {}
    });

    const {data:_regionsData} = useRegionsList({})
    const _regions = _regionsData as any
    const regions = _regions?.results as Region[] || []
        
    const {districts} = useGetRegionDistricts(regions, Number(form.watch("region")))

    const {data: _productsData} = useFarmManagementProductList({queryParams:{type: "crop", page: 1, page_size: 50}})
    const crops = _productsData?.results || []

    function onSubmit(values: z.infer<typeof searchFarmSchema>) {
        const queryParams = cleanJsonData(values)
        setFilters((prev: any) => ({ ...prev, ...queryParams, export: false }))
    }

    function handleRest(){
        form.reset({
            query: "",
            crop_type: "",
            land_ownership: "",            
            region: "",
            district: "",
        })
        setFilters({
            page: 1, page_size: PAGE_SIZE, farm_type: "external"
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
                                            <Input className="px-10" placeholder="Search with farm name or ID" {...field} />
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
                                name="crop_type"
                                render={({ field }) => (
                                <FormItem className="relative">
                                    <FormLabel className="text-green-700">Crop Type </FormLabel>
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
                                        {crops?.map((item, idx) => (
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
                                name="land_ownership"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green-700">Land Ownership</FormLabel>
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
                                        {landOwnershipTypes?.map((item, idx) => (
                                            <SelectItem key={idx} className="capitalize" value={item}>
                                                {item}
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
                                name="region"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-green-700">Region </FormLabel>
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
                                    <FormLabel className="text-green-700">District</FormLabel>
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
                        <div className="col-span-2"/>
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
                                    <LoadingLabel isLoading={isLoading && !Boolean(filters?.export)}>
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