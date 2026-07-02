"use client"
import {
    Dialog,
    DialogContent,
    DialogPoweredByFooter,
    DialogTitle,
  } from "@/components/ui/dialog"
import { TAddFarmModal} from "../../utils/types";
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
import { externalFarmSchema } from "../../utils/validations";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label, LoadingLabel } from "@/components/ui/label";
import { farmingMethods, fertilizerTypes, landOwnershipTypes, selectColorStyles, yesOrNoTypes } from "../../utils/constants";
import ReactSelect from 'react-select';
import { Check, ChevronsUpDown, Loader, XCircle } from "lucide-react";
import { useCustomTypeList, useFarmManagementFarmCreate, useFarmManagementFarmUpdate, useFarmManagementProductList, useRegionsList } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { getErrorMap, mapSelectOptions } from "@/lib/helpers";
import { Region } from "@/apis/adminApiSchemas";
import useGetRegionDistricts, { useAllFarmers } from "../../utils/hooks";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { cn } from "@/lib/utils";



export default function AddExternalFarmModal({open, setOpen, defaultData, isEdit, refetch}:TAddFarmModal){

    const modalTitle = isEdit ? "Edit External Farm" : "Register New External Farm";
    const submitTitle = isEdit ? "Update Farm" : "Register Farm";

    const [openDrop, setOpenDrop] = useState(false)
    
    
    const defaultCrops = mapSelectOptions(defaultData?.crops || [], "product")
    const defaultLivestock = mapSelectOptions(defaultData?.livestock || [], "product")

    const {allFarmers, isLoading: isLoadingFarmers} = useAllFarmers("")

    const form = useForm<z.infer<typeof externalFarmSchema>>({
        resolver: zodResolver(externalFarmSchema),
        defaultValues: {
            ...defaultData, 
            farmer: String(defaultData?.farmer?.id),
            use_of_fertilizers: defaultData?.use_of_fertilizers?.[0],
            farming_methods: defaultData?.farming_methods?.[0],
            crops: defaultCrops, 
            livestock: defaultLivestock,
            region: String(defaultData?.region?.id),
            district: String(defaultData?.district?.id),
            irrigation: defaultData?.irrigation ? "yes" : "no",
            has_access_to_market: defaultData?.has_access_to_market ? "yes" : "no",
            size: String(defaultData?.size),
            size_metric: String(defaultData?.size_metric?.id)
        }
    });

    const {data:_customTypesData} = useCustomTypeList({queryParams:{query: "size_metric"}})
    const customTypes = _customTypesData?.results || []

    const {data: _productsData} = useFarmManagementProductList({queryParams:{type: "crop", page: 1, page_size: 50}})
    const crops = _productsData?.results || []

    const {data: _productsData2} = useFarmManagementProductList({queryParams:{type: "other", page: 1, page_size: 50}})
    const livestock = _productsData2?.results || []

    const {data:_regionsData, isLoading: isLoadingRegions} = useRegionsList({})
    const _regions = _regionsData as any
    const regions = _regions?.results as Region[] || []

    const {districts} = useGetRegionDistricts(regions, Number(form.watch("region")))

    function farmerFullName(farmer: any){
        return `${farmer?.first_name} ${farmer?.last_name}`
    }

    const {mutate, isPending} = useFarmManagementFarmCreate({
        onSuccess: () =>{
            if(refetch) refetch()
            setOpen(false)
            toast.success("Farm Added Successfully")
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const {mutate: updateMutate, isPending: isUpdating} = useFarmManagementFarmUpdate({
        onSuccess: () =>{
            if(refetch) refetch()
            setOpen(false)
            toast.success("Farm Updated Successfully")
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof externalFarmSchema>) {
        const crops = values?.crops?.map((item) => item?.value) as number[]
        const livestock = values?.livestock?.map((item) => item?.value) as number[]
        const payload = {
            farm_type: "external",
            name: values?.name,
            farmer: values?.farmer,
            location: values?.location,
            region: values?.region,
            district: values?.district,
            size: Number(values?.size),
            size_metric: Number(values?.size_metric),
            land_ownership: values?.land_ownership,
            other_specification: values?.other_land_ownership,
            crops: crops,
            livestock: livestock,
            use_of_fertilizers: [values?.use_of_fertilizers],
            farming_methods: [values?.farming_methods],
            irrigation: values?.irrigation === "yes" ? true : false,
            has_access_to_market: values?.has_access_to_market === "yes" ? true : false
        } as any

        if(isEdit){
            updateMutate({
                body: payload,
                pathParams: {
                    id: defaultData?.id
                }
            })
        }else{
            mutate({
                body: payload
            })
        }
        
    }

    

    return(
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[850px] p-0 text-[#334155]">
                <DialogTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">{modalTitle}</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
                <div className="p-5 h-[500px] overflow-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Farm Name <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Farm Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="farmer"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                        <FormLabel>Select Lead Farmer
                                            <div className='text-red-500'>*</div>
                                            {isLoadingFarmers && <Loader  className="animate-spin"/>}
                                        </FormLabel>
                                        <Popover open={openDrop} onOpenChange={setOpenDrop}>
                                            <PopoverTrigger asChild >
                                            <FormControl>
                                                <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                >
                                                {
                                                Number(field.value)
                                                    ? farmerFullName(allFarmers?.find(
                                                        (farmer: any) => String(farmer?.id) === field.value
                                                    ))
                                                    : "Select Farmer"}
                                                <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="md:w-[350px] w-full p-0">
                                            <Command>
                                                <CommandInput
                                                placeholder="Search Farmer..."
                                                className="h-9"
                                                required
                                                />
                                                <CommandList>
                                                <CommandEmpty>No Farmer found.</CommandEmpty>
                                                <CommandGroup>
                                                    {allFarmers?.map((farmer: any) => (
                                                    <CommandItem
                                                        value={farmerFullName(farmer)}
                                                        key={`els-${farmer?.id}`}
                                                        onSelect={() => {
                                                        form.setValue("farmer", String(farmer?.id))
                                                        setOpenDrop(false)
                                                        }}
                                                    >
                                                        {farmerFullName(farmer)}
                                                        <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            String(farmer?.id) === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                        )}
                                                        />
                                                    </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                                </CommandList>
                                            </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* <FormField
                                    control={form.control}
                                    name="farmer"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Lead Farmer
                                            <div className='text-red-500'>*</div>
                                            {isLoadingFarmers && <Loader  className="animate-spin"/>}
                                        </FormLabel>
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
                                            {allFarmers?.map((item, idx) =>(
                                                <SelectItem key={`ty-${idx}`} value={String(item?.id)}>{item?.first_name} {item?.last_name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                /> */}
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Farm Location(GPS Coordinates if available) <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter First Location" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
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
                                            {regions?.map((item, idx) => (
                                                <SelectItem key={`rg-${idx}`} value={String(item.id)}>
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
                                            {districts?.map((item, idx) => (
                                                <SelectItem key={`ds-${idx}`} value={String(item.id)}>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div className="grid md:grid-cols-2 gap-5 items-center">
                                    <FormField
                                        control={form.control}
                                        name="size"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Land Size <div className='text-red-500'>*</div></FormLabel>
                                            <FormControl>
                                            <Input placeholder="Enter Farm Size" {...field} type="number"/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="size_metric"
                                            render={({ field }) => (
                                                 <FormItem>
                                                    <RadioGroup 
                                                        className="flex flex-col w-full gap-x-6 mt-4"
                                                        required
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        {customTypes?.map((item, idx) =>(
                                                            <div key={`sm-${idx}`} className="flex items-center space-x-2">
                                                                <RadioGroupItem value={String(item?.id)} id={item?.name} />
                                                                <Label htmlFor={item?.name} className="capitalize cursor-pointer">{item?.name}</Label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup> 
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <div>
                                        <Label  className="capitalise mb-3">Land Ownership<div className='text-red-500'>*</div></Label>
                                        <FormField
                                            control={form.control}
                                            name="land_ownership"
                                            render={({ field }) => (
                                                <RadioGroup 
                                                    className="flex flex-row w-full gap-x-6"
                                                    required
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    {landOwnershipTypes.map((item, idx) =>(
                                                        <div key={`lo-${idx}`} className="flex items-center space-x-2">
                                                            <RadioGroupItem value={item} id={item} />
                                                            <Label htmlFor={item} className="capitalize cursor-pointer">{item}</Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup> 
                                            )}/>
                                    </div>
                                    {form.watch("land_ownership") === "other" &&
                                        <div className="mt-4 absolute w-full">
                                            <FormField
                                                control={form.control}
                                                name="other_land_ownership"
                                                render={({ field }) => (
                                                <FormItem className="w-full">
                                                    {/* <FormLabel>Type Other Option Here <div className='text-red-500'>*</div></FormLabel> */}
                                                    <FormControl>
                                                    <Input className="w-full" placeholder="Type Other Option Here..." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}/>
                                        </div>
                                    }
                                </div>
                            </div>
                            
                            <div>
                                <Label  className="capitalize mb-3">Main Crops Grown<div className='text-red-500'>*</div></Label>
                                <FormField
                                    control={form.control}
                                    name="crops"
                                    render={({ field }) => (
                                         <FormItem className="w-full">
                                        <ReactSelect
                                            {...field}
                                            closeMenuOnSelect={false}
                                            isMulti
                                            // defaultValue={assignColorsToOptions(defaultCrops)}
                                            options={mapSelectOptions(crops)}
                                            styles={selectColorStyles}
                                            required
                                        />
                                        <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
                            <div>
                                <Label  className="capitalize mb-3">Other Product</Label>
                                <FormField
                                    control={form.control}
                                    name="livestock"
                                    render={({ field }) => (
                                         <FormItem className="w-full">
                                        <ReactSelect
                                            {...field}
                                            closeMenuOnSelect={false}
                                            isMulti
                                            // defaultValue={assignColorsToOptions(defaultLivestock)}
                                            options={mapSelectOptions(livestock)}
                                            styles={selectColorStyles}
                                        />
                                        <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-[#0F172A] mb-5">AGRICULTURE PRACTICES</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="use_of_fertilizers"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Use of Fertilizers<div className='text-red-500'>*</div></FormLabel>
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
                                                {fertilizerTypes?.map((item, idx) => (
                                                    <SelectItem key={idx} value={item} className="capitalize">
                                                        {item}
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
                                        name="farming_methods"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Farming Methods<div className='text-red-500'>*</div></FormLabel>
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
                                                {farmingMethods?.map((item, idx) => (
                                                    <SelectItem key={`fm-${idx}`} value={item} className="capitalize">
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <div>
                                        <Label  className="capitalize mb-3">Irrigation<div className='text-red-500'>*</div></Label>
                                        <FormField
                                            control={form.control}
                                            name="irrigation"
                                            render={({ field }) => (
                                                <RadioGroup 
                                                    className="flex flex-row w-full gap-x-6"
                                                    required
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    {yesOrNoTypes.map((item, idx) =>(
                                                        <div key={`yn-${idx}`} className="flex items-center space-x-2">
                                                            <RadioGroupItem value={item} id={item} />
                                                            <Label htmlFor={item} className="capitalize cursor-pointer">{item}</Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup> 
                                            )}/>
                                    </div>
                                    <div>
                                        <Label  className="capitalize mb-3">Access To Market<div className='text-red-500'>*</div></Label>
                                        <FormField
                                            control={form.control}
                                            name="has_access_to_market"
                                            render={({ field }) => (
                                                <RadioGroup 
                                                    className="flex flex-row w-full gap-x-6"
                                                    required
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    {yesOrNoTypes.map((item, idx) =>(
                                                        <div key={`yn-2-${idx}`} className="flex items-center space-x-2">
                                                            <RadioGroupItem value={item} id={item} />
                                                            <Label htmlFor={item} className="capitalize cursor-pointer">{item}</Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup> 
                                            )}/>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <Button type="submit" variant="default" className="w-[544px] cursor-pointer">
                                   <LoadingLabel isLoading={isPending || isUpdating}>{submitTitle}</LoadingLabel>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
                <DialogPoweredByFooter/>
            </DialogContent>
            
        </Dialog>
    )
  }