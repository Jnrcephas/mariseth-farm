import {
    DialogPoweredByFooter,
  } from "@/components/ui/dialog"
import { TModal} from "../../utils/types";
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
import { productsSchema } from "../../utils/validations";
import { Loader, XCircle } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { useAllCustomTypes } from "@/modules/SystemSettings/utils/hooks";
import { useFarmManagementProductCreate, useFarmManagementProductUpdate } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { cleanJsonData, colorPalate, getErrorMap } from "@/lib/helpers";
import { Product } from "@/apis/adminApiSchemas";
import { Label, LoadingLabel } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


  export default function AddOtherProductsModal({open, setOpen, defaultData, isEdit, refetch}:TModal){

    const modalTitle = isEdit ? "Edit Other Product" : "Add Other Product";
    const submitTitle = isEdit ? "Update Other Product" : "Add Other Product";

    const {allCustomTypes, isLoading: isLoadingTypes} = useAllCustomTypes("other_product_category")
    const {allCustomTypes:customTypes} = useAllCustomTypes("weight_metric")
   

    const form = useForm<z.infer<typeof productsSchema>>({
        resolver: zodResolver(productsSchema),
        defaultValues: {
            ...defaultData, 
            category: String(defaultData?.category?.id),
            breed: defaultData?.breed ?? "",
            description: defaultData?.description ?? "",
            weight: defaultData?.weight ?? "",
            weight_metric: defaultData?.weight_metric ? String(defaultData?.weight_metric?.id) : ""
        },
    });

    const colorObj = colorPalate(form.watch("color"));

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

    function onSubmit(values: z.infer<typeof productsSchema>) {
        const payload = cleanJsonData({
            type: "other",
            name: values?.name,
            category: Number(values?.category),
            breed: values?.breed,
            description:  values?.description,
            color: values?.color,
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
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 gap-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                            {form.watch("name") || "Product Name"}
                                        </Badge>
                                    </div>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="breed"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Breed </FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Breed" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
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
                                            <Input placeholder="Enter Product Weight" {...field} type="number"/>
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
                            </div>
                            
                            <div className="flex justify-center">
                                <Button variant="default" type="submit" className="w-full mt-5">
                                    <LoadingLabel isLoading={isUpdating || isPending}>{submitTitle}</LoadingLabel>
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