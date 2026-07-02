"use client"
import {
    DialogPoweredByFooter,
  } from "@/components/ui/dialog"
import {TModal} from "../../utils/types";
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
import { cropSchema } from "../../utils/validations";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label, LoadingLabel } from "@/components/ui/label";
import { yesOrNoTypes } from "../../utils/constants";
import { Loader, XCircle } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { useFarmManagementProductCreate, useFarmManagementProductUpdate } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { cleanJsonData, colorPalate, getErrorMap } from "@/lib/helpers";
import { useAllCustomTypes } from "@/modules/SystemSettings/utils/hooks";
import moment from "moment"
import { Product } from "@/apis/adminApiSchemas";
import { Badge } from "@/components/ui/badge";



  export default function AddCropModal({open, setOpen, defaultData, isEdit, refetch}:TModal){

    const modalTitle = isEdit ? "Edit Crop" : "Add New Crop";
    const submitTitle = isEdit ? "Update Crop" : "Add Crop";

    const {allCustomTypes, isLoading: isLoadingTypes} = useAllCustomTypes("product_crop_category")
    const {allCustomTypes:customTypes} = useAllCustomTypes("weight_metric")
    

    const form = useForm<z.infer<typeof cropSchema>>({
        resolver: zodResolver(cropSchema),
        defaultValues: {...defaultData, 
            color: defaultData?.color ?? "",
            category: String(defaultData?.category?.id),
            season_status: defaultData?.season_status === "in" ? "yes" : "no",
            season_start: defaultData?.season_start ? moment(defaultData?.season_start, "YYYY-MM").format("YYYY-MM") : "",
            season_end: defaultData?.season_end ? moment(defaultData?.season_end, "YYYY-MM").format("YYYY-MM") : "",
            weight: defaultData?.weight ?? "",
            weight_metric: defaultData?.weight_metric ? String(defaultData?.weight_metric?.id) : ""
        },
    });

    const {mutate, isPending} =  useFarmManagementProductCreate({
        onSuccess: () =>{
            if(refetch) refetch()
            toast.success("Product Added Successfully")
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const {mutate: updateMutate, isPending: isUpdating} =  useFarmManagementProductUpdate({
        onSuccess: () =>{
            if(refetch) refetch()
            toast.success("Product Updated Successfully")
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof cropSchema>) {
        const payload = cleanJsonData({
            type: "crop",
            name: values?.name,
            category: Number(values?.category),
            color: values?.color,
            season_status: values?.season_status === "yes" ? "in" : "out",
            season_start: `${values?.season_start}-01`,
            season_end: `${values?.season_end}-01`,
            description:  values?.description || "",
            weight: values?.weight,
            weight_metric: values?.weight_metric
        }) as Product

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
    const colorObj = colorPalate(form.watch("color"));
    

    return(
        <Sheet open={open}>
            <SheetContent className="md:max-w-[550px] md:max-h-[720px] text-[#334155] rounded-lg mt-4">
                <SheetTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">{modalTitle}</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </SheetTitle>
                <hr/>
                <div className="mt-1 px-5 overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid grid-cols-1 gap-5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Crop Name <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Farm Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category {isLoadingTypes && <Loader className="animate-spin"/>}<div className='text-red-500'>*</div></FormLabel>
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
                                                {allCustomTypes.map((item, idx) => (
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
                                    <div className="flex flex-row items-center space-x-5">
                                        
                                        <FormField
                                            control={form.control}
                                            name="color"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Color Tag <div className='text-red-500'>*</div></FormLabel>
                                                <FormControl>
                                                <Input placeholder="Enter Description" {...field} type="color" required/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <Badge className={`mt-5 font-bold`} style={{backgroundColor: colorObj.bgColor, color: colorObj.color}}>
                                            {form.watch("name") || "Crop Name"}
                                        </Badge>
                                    </div>

                                </div>
                                
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description </FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <div className="grid md:grid-cols-2 gap-5 items-center">
                                    <FormField
                                        control={form.control}
                                        name="weight"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Weight </FormLabel>
                                            <FormControl>
                                            <Input placeholder="Enter Crop Weight" {...field} type="number"/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="weight_metric"
                                            render={({ field }) => (
                                                    <FormItem>
                                                    <RadioGroup 
                                                        className="flex flex-row w-full gap-x-6 mt-4"
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        {customTypes?.map((item, idx) =>(
                                                            <div key={idx} className="flex items-center space-x-2">
                                                                <RadioGroupItem value={String(item?.id)} id={item?.name} />
                                                                <Label htmlFor={item?.name} className="cursor-pointer">{item?.name}</Label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup> 
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label  className="capitalize mb-3">Is this crop currently in its growing season?<div className='text-red-500'>*</div></Label>
                                    <FormField
                                        control={form.control}
                                        name="season_status"
                                        render={({ field }) => (
                                            <RadioGroup 
                                                className="flex flex-row w-full gap-x-6"
                                                required
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                {yesOrNoTypes.map((item, idx) =>(
                                                    <div key={idx} className="flex items-center space-x-2">
                                                        <RadioGroupItem value={item} id={item} />
                                                        <Label htmlFor={item} className="capitalize cursor-pointer">{item}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup> 
                                    )}/>
                                </div>
                            
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* First Name */}
                                <FormField
                                    control={form.control}
                                    name="season_start"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Season Start Month
                                            <div className='text-red-500'>*</div>
                                        </FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Farm Location" {...field} type="month"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />

                                {/* Last Name */}
                                <FormField
                                    control={form.control}
                                    name="season_end"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Season End Month <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Farm District" {...field} type="month"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex justify-center">
                                <Button type="submit" variant="default" className="w-full mt-2">
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