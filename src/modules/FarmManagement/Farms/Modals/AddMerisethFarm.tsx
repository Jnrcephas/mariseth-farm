import {
    DialogPoweredByFooter,
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
import { internalFarmSchema } from "../../utils/validations";
import { Label, LoadingLabel } from "@/components/ui/label";
import { Loader, XCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useCustomTypeList, useFarmManagementFarmCreate, useFarmManagementFarmUpdate, useFarmManagementProductList, useRegionsList } from "@/apis/adminApiComponents";
import { Region } from "@/apis/adminApiSchemas";
import useGetRegionDistricts from "../../utils/hooks";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { getErrorMap, mapSelectOptions } from "@/lib/helpers";
import ReactSelect from 'react-select';
import { selectColorStyles } from "../../utils/constants";



  export default function AddMerisethFarmModal({open, setOpen, defaultData, isEdit, refetch}:TAddFarmModal){

    const modalTitle = isEdit ? "Edit Meriseth Farm" : "Register New Meriseth Farm";
    const submitTitle = isEdit ? "Update Farm" : "Register Farm";

    const defaultCrops = mapSelectOptions(defaultData?.crops || [], "product")
    const defaultLivestock = mapSelectOptions(defaultData?.livestock || [], "product")

    const form = useForm<z.infer<typeof internalFarmSchema>>({
        resolver: zodResolver(internalFarmSchema),
        defaultValues: {...defaultData, 
            crops: defaultCrops, 
            livestock: defaultLivestock,
            region: String(defaultData?.region?.id),
            district: String(defaultData?.district?.id),
            size: String(defaultData?.size),
            size_metric: String(defaultData?.size_metric?.id)}
    });

    const {data:_customTypesData, isLoading: isLoadingTypes} = useCustomTypeList({queryParams:{page: 1, page_size: 50}})
    const customTypes = _customTypesData?.results || []

    const size_metrics = customTypes?.filter((item) => item?.category_name === "size_metric")
    const farm_types = customTypes?.filter((item) => item?.category_name === "farm_types")

    const {data: _productsData} = useFarmManagementProductList({queryParams:{type: "crop", page: 1, page_size: 50}})
    const crops = _productsData?.results || []
    
    const {data: _productsData2} = useFarmManagementProductList({queryParams:{type: "other", page: 1, page_size: 50}})
    const livestock = _productsData2?.results || []

    

    const {data:_regionsData, isLoading: isLoadingRegions} = useRegionsList({})
    const _regions = _regionsData as any
    const regions = _regions?.results as Region[] || []
    
    const {districts} = useGetRegionDistricts(regions, Number(form.watch("region")))

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

    function onSubmit(values: z.infer<typeof internalFarmSchema>) {
        const crops = values?.crops?.map((item) => item?.value) as number[]
        const livestock = values?.livestock?.map((item) => item?.value) as number[]

        const payload = {
            farm_type: "internal",
            name: values?.name,
            type: values?.type,
            location: values?.location,
            region: values?.region,
            district: values?.district,
            size: Number(values?.size),
            size_metric: Number(values?.size_metric),
            crops: crops,
            livestock: livestock
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
        <Sheet open={open}>
            <SheetContent className="md:max-w-[600px] md:max-h-[690px] text-[#334155] rounded-lg mt-4">
                <SheetTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">{modalTitle}</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </SheetTitle>
                <hr/>
                <div className="px-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                    name="type"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type of Farm {isLoadingTypes && <Loader className="animate-spin"/>}<div className='text-red-500'>*</div></FormLabel>
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
                                            {farm_types?.map((item, idx) =>(
                                                <SelectItem key={`ty-${idx}`} value={item?.name}>{item.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-5">
                                
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Location(GPS Coordinates if available) <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter First Location" {...field} />
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
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                    <div className="mt-4">
                                        <FormField
                                            control={form.control}
                                            name="size_metric"
                                            render={({ field }) => (
                                                    <FormItem>
                                                    <RadioGroup 
                                                        className="flex flex-row w-full gap-x-6 mt-4"
                                                        required
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        {size_metrics?.map((item, idx) =>(
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
                            <div className="grid grid-cols-1">
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
                            <div className="grid grid-cols-1">
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
                            <div className="flex justify-center pt-4 w-full">
                                <Button variant="default" type="submit" className="w-full">
                                    <LoadingLabel isLoading={isPending || isUpdating}>{submitTitle}</LoadingLabel>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
                <DialogPoweredByFooter/>
            </SheetContent>
            
        </Sheet>
    )
  }