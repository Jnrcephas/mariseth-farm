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
import {  Search } from "lucide-react";
import { trainingSearchSchema } from "./utils/validations";
import { TRAINING_MODE, TRAINING_TYPE } from "./utils/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TrainingSearch({setFilters, isLoading, refetch}:TSearchProps){

    const form = useForm<z.infer<typeof trainingSearchSchema>>({
        resolver: zodResolver(trainingSearchSchema),
    });
    function onSubmit(values: z.infer<typeof trainingSearchSchema>) {
        const queryParams = cleanJsonData(values)
        setFilters((prev: any) => ({ ...prev, ...queryParams }))
    }

    function handleRest(){
        form.reset({
            query: "",
            training_type:"",
            training_mode: "",
            training_date_from: "",
            training_date_to: ""
        })
        setFilters({
            page: 1, page_size: PAGE_SIZE
        })
        debounce(refetch, 1)
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
                                        <Input className="px-10" placeholder="Search with training ID, title" {...field} />
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
                                name="training_type"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Training Type</FormLabel>
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
                                        {TRAINING_TYPE?.map((item: any, idx: number) => (
                                            <SelectItem key={`d-${idx}`} value={String(item?.value)}>{item?.label}</SelectItem>
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
                                name="training_mode"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Training Mode</FormLabel>
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
                                        {TRAINING_MODE?.map((item: any, idx: number) => (
                                            <SelectItem key={`d-${idx}`} value={String(item?.value)}>{item?.label}</SelectItem>
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
                                name="training_date_from"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Training Date From</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="date"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-2">
                            <FormField
                                control={form.control}
                                name="training_date_to"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Training Date To</FormLabel>
                                    <FormControl>
                                        <Input  {...field} type="date"/>
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