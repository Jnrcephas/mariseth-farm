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

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, XCircle } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { TModal } from "@/modules/FarmManagement/utils/types";
import { warehouseSchema } from "../../utils/validations";
import { useAccountsUsersAdminList, useRegionsList, useWarehouseCreate, useWarehouseUpdate } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { getErrorMap, mapSelectOptions } from "@/lib/helpers";
import { LoadingLabel } from "@/components/ui/label";
import { Region } from "@/apis/adminApiSchemas";
import useGetRegionDistricts from "@/modules/FarmManagement/utils/hooks";
import ReactSelect from 'react-select';



export default function AddWarehouseModal({open, setOpen, defaultData, isEdit, refetch}:TModal){

    const modalTitle = isEdit ? "Edit Warehouse" : "Add New Warehouse";
    const submitTitle = isEdit ? "Update Warehouse" : "Add Warehouse";


    const defaultWhManagers = defaultData?.managers?.map((item: any) => {
        return { id: item?.id, name: `${item?.first_name}  ${item?.last_name} - (${item?.groups?.[0]?.name})`, color: "" };
    });
    const defaultManagers = mapSelectOptions(defaultWhManagers)

    const form = useForm<z.infer<typeof warehouseSchema>>({
        resolver: zodResolver(warehouseSchema),
        defaultValues: {
            ...defaultData,
            region: String(defaultData?.region?.id),
            district: String(defaultData?.district?.id),
            managers: defaultManagers
        }
    });

    const {data:_regionsData, isLoading: isLoadingRegions} = useRegionsList({})
    const _regions = _regionsData as any
    const regions = _regions?.results as Region[] || []
    const {districts} = useGetRegionDistricts(regions, Number(form.watch("region")))

    const {data: _usersData, isLoading: isLoadingUsers} = useAccountsUsersAdminList({queryParams: {page: 1, page_size: 100, user_type:"admin"} as any})
    const users = (_usersData?.results as any[] || []).sort((a, b) => {
        return a.first_name.localeCompare(b.first_name, undefined, { sensitivity: 'base' });
    });
    const whManagers = users?.map((item) => {
        return { id: item?.id, name: `${item?.first_name}  ${item?.last_name} - (${item?.groups?.[0]?.name})`, color: "" };
    });

    const {mutate, isPending} =  useWarehouseCreate({
        onSuccess: () =>{
            if(refetch) refetch()
            toast.success("Warehouse Added Successfully")
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const {mutate: updateMutate, isPending: isUpdating} =  useWarehouseUpdate({
        onSuccess: () =>{
            if(refetch) refetch()
            toast.success("Warehouse Updated Successfully")
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof warehouseSchema>) {
        const managers = values?.managers?.map((item) => item?.value) as number[]
        const payload = {
            name: values?.name,
            region: Number(values?.region),
            district: Number(values?.district),
            capacity: values?.capacity,
            managers: managers
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
            <SheetContent className="md:max-w-[550px] md:max-h-[700px] text-[#334155] rounded-lg mt-4">
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
                                    name="name"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Warehouse Name <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Warehouse Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="region"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Region {isLoadingRegions && <Loader className="animate-spin"/>}<div className='text-red-500'>*</div></FormLabel>
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
                                                {regions.map((item, idx) => (
                                                    <SelectItem key={`r-${idx}`} value={String(item.id)}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="district"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>District<div className='text-red-500'>*</div></FormLabel>
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
                                                {districts.map((item, idx) => (
                                                    <SelectItem key={`d-${idx}`} value={String(item.id)}>
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
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="capacity"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Capacity (tons)<div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Capacity" {...field} type="number"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                
                               
                            </div>
                            <div className="grid grid-cols-1">
                                
                                <FormField
                                    control={form.control}
                                    name="managers"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                        <FormLabel>Warehouse Manager {isLoadingUsers && <Loader className="animate-spin"/>} 
                                            <div className='text-red-500'>*</div>
                                        </FormLabel>
                                        <ReactSelect
                                            {...field}
                                            closeMenuOnSelect={false}
                                            isMulti
                                            // defaultValue={assignColorsToOptions(defaultCrops)}
                                            options={mapSelectOptions(whManagers)}
                                            required
                                        />
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