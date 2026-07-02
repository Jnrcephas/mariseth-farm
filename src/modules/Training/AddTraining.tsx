"use client"
import { useDepartmentList, useEmployeeList, useTrainingCreate, useTrainingUpdate } from "@/apis/adminApiComponents";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label, LoadingLabel } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cleanJsonData, getErrorMap, mapSelectOptions } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { trainingSchema } from "./utils/validations";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ATTENDEES, TRAINING_MODE, TRAINING_TYPE } from "./utils/constants";
import ReactSelect from 'react-select';
import { useRouter } from "next/navigation";
import { routeTo } from "@/lib/constants";
import moment from "moment";


export function AddTraining({isEdit=false, defaultData}:{isEdit?: boolean; defaultData?: any;}){

    const router = useRouter()

    const submitTitle = isEdit ? "Edit Training" : "Add Training";

    const _defaultEmployees = defaultData?.employees?.map((item: any) => {
        return { id: item?.id, name: `${item?.first_name}  ${item?.last_name}`, color: "" };
    });
    const defaultEmployees = mapSelectOptions(_defaultEmployees)

    
    const form = useForm<z.infer<typeof trainingSchema>>({
        resolver: zodResolver(trainingSchema),
        defaultValues: {
            ...defaultData,
            location: defaultData?.location ?? "",
            description: defaultData?.description ?? "",
            material_url: defaultData?.material_url ?? "",
            start_date: moment(defaultData?.start_date).format("YYYY-MM-DD"),
            end_date: moment(defaultData?.end_date).format("YYYY-MM-DD"),
            employees: defaultEmployees,
        }
    });

    const {data: _usersData} = useEmployeeList({queryParams: {page: 1, page_size: 100}})
    const _employees = _usersData as any

    const users = (_employees?.results as any[] || []).sort((a, b) => {
        return a.first_name.localeCompare(b.first_name, undefined, { sensitivity: 'base' });
    });
    const employees = users?.map((item) => {
        return { id: item?.id, name: `${item?.first_name}  ${item?.last_name}`, color: "" };
    });

    const {data: _data} = useDepartmentList({queryParams: {page: 1, page_size: 50}})
    const departments = _data as any

    const {mutate, isPending} =  useTrainingCreate({
        onSuccess: () =>{
            toast.success("Training Added Successfully")
            router.push(routeTo.training)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const {mutate: updateMutate, isPending: isUpdating} =  useTrainingUpdate({
        onSuccess: () =>{
            toast.success("Training Edited Successfully")
            router.push(routeTo.training)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof trainingSchema>) {
        const selected_employees = values?.selected_employees?.map((item: any) => item?.value) || []
        const departments = values?.departments?.map((item: any) => item?.value) || []

        const payload = {
            ...values,
        } as any

        if(values?.attendees === "all_employees"){
            payload["all_employees"] = true
        }
        if(selected_employees.length){
            payload["selected_employees"] = selected_employees
        }
        if(departments.length){
            payload["departments"] = departments
        }

        if(isEdit){
            updateMutate({
                body: cleanJsonData(payload),
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
        <div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Training Title <div className='text-red-500'>*</div></FormLabel>
                                <FormControl>
                                    <Input placeholder="Type..." {...field} required/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField
                                control={form.control}
                                name="training_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Training Type<div className='text-red-500'>*</div></FormLabel>
                                        <RadioGroup
                                            className="flex flex-row w-full gap-x-6"
                                            required
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                        {TRAINING_TYPE?.map((item, idx) =>(
                                            <div key={idx} className="flex items-center space-x-2">
                                                <RadioGroupItem value={item.value} id={item.value} />
                                                <Label htmlFor={item.value} className="capitalize cursor-pointer">{item.label}</Label>
                                            </div>
                                        ))}
                                        <FormMessage />
                                    </RadioGroup> 
                                </FormItem>
                            )}/>
                            <FormField
                                control={form.control}
                                name="training_mode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Training Mode<div className='text-red-500'>*</div></FormLabel>
                                        <RadioGroup
                                            className="flex flex-row w-full gap-x-6"
                                            required
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                        {TRAINING_MODE?.map((item, idx) =>(
                                            <div key={idx} className="flex items-center space-x-2">
                                                <RadioGroupItem value={item.value} id={item.value} />
                                                <Label htmlFor={item.value} className="capitalize cursor-pointer">{item.label}</Label>
                                            </div>
                                        ))}
                                        <FormMessage />
                                    </RadioGroup> 
                                </FormItem>
                            )}/>
                            
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Type..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location/Meeting Link </FormLabel>
                                <FormControl>
                                    <Input placeholder="Type..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
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
                        <FormField
                            control={form.control}
                            name="attendees"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Attendees <div className='text-red-500'>*</div></FormLabel>
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
                                    {ATTENDEES?.map((item: any, idx: number) =>(
                                        <SelectItem key={`lt-${idx}`} value={item.value}>{item.label}</SelectItem>
                                    ))} 
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        
                        {form.watch("attendees") === "employees" && 
                            <FormField
                                control={form.control}
                                name="selected_employees"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                    <FormLabel>Select Employees
                                        <div className='text-red-500'>*</div>
                                    </FormLabel>
                                    <ReactSelect
                                        {...field}
                                        closeMenuOnSelect={false}
                                        isMulti
                                        // defaultValue={assignColorsToOptions(defaultCrops)}
                                        options={mapSelectOptions(employees)}
                                        required
                                    />
                                    <FormMessage />
                                    </FormItem>
                                )} 
                            />
                        }
                        {form.watch("attendees") === "departments" && 
                            <FormField
                                control={form.control}
                                name="departments"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                    <FormLabel>Select Departments
                                        <div className='text-red-500'>*</div>
                                    </FormLabel>
                                    <ReactSelect
                                        {...field}
                                        closeMenuOnSelect={false}
                                        isMulti
                                        // defaultValue={assignColorsToOptions(defaultCrops)}
                                        options={mapSelectOptions(departments?.results || [])}
                                        required
                                    />
                                    <FormMessage />
                                    </FormItem>
                                )} 
                            />
                        }
                        <FormField
                            control={form.control}
                            name="material_url"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Training Material Url </FormLabel>
                                <FormControl>
                                    <Input placeholder="Type..." {...field} type="url"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    
                    <div className="flex justify-end">
                        <Button type="submit" variant="default" className="w-fulls mt-5">
                            <LoadingLabel isLoading={isPending || isUpdating}>
                                {submitTitle}
                            </LoadingLabel>
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}