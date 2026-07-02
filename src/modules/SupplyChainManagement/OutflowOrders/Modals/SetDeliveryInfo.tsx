"use client"
import { useOutflowAssignDeliveryInfo} from "@/apis/adminApiComponents";
import { Form} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { YES_NO_OPTIONS } from "@/lib/constants";
import { getErrorMap } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { inflowInspectionSchema} from "../../utils/validations";
import {  Plus, X, XCircle } from "lucide-react";
import { Label, LoadingLabel } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import PhoneNumberInput from "react-phone-number-input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import UploadImagesCardCol1 from "@/components/UploadImagesCardCol1";
import MultiSelect from 'react-select'
import { TProductDelivery } from "../../utils/types";



export default function SetDeliveryInfo({
    open, 
    setOpen, 
    data,
    refetch,
    isEdit
}:{
        open: boolean;
        setOpen: (open: boolean) => void;
        data: any;
        refetch: () => void;
        isEdit?: boolean;
    }){

    const form = useForm<z.infer<typeof inflowInspectionSchema>>({
        resolver: zodResolver(inflowInspectionSchema),
        defaultValues: {}
    });

    const warehousesOptions = data?.warehouses?.map((item: any) => ({label: item?.warehouse?.name, value: item?.warehouse?.id}))
    const defaultWarehouseIds = data?.warehouses?.map((item: any) => item?.warehouse?.id)

    const [products, setProducts] = useState<TProductDelivery[]>(isEdit ? data?.delivery_information :[
        {
            id: Date.now(),
            driver_name: '',
            driver_phone_number: '',
            driver_license_number: '',
            truck_license_number: '',
            destination: '',
            company: '',
            escort_required: true,
            escort_details: '',
            warehouse_ids: defaultWarehouseIds,
            images: []
        }
    ]);

    const addNewProductField = () => {
        const newProduct = {
        id: Date.now(),
        driver_name: '',
        driver_phone_number: '',
        driver_license_number: '',
        truck_license_number: '',
        destination: '',
        company: '',
        escort_required: true,
        escort_details: '',
        warehouse_ids: defaultWarehouseIds,
        images: []
        };
        setProducts([...products, newProduct]);
    };
    
    const removeProductField = (id: string) => {
        if (products.length > 1) {
        setProducts(products.filter(product => product.id !== Number(id)));
        }
    };

    const updateProduct = (id: number, field: string, value: any) => {
        let inputValue = value
        switch (field) {
            case "warehouse_ids":
                console.log("value",value)
                const warehouse_ids = value?.map((item: any) => item?.value)
                inputValue = warehouse_ids
                break;
            case "escort_required":
                inputValue = value === "true" ? true : false 
                break;
            default:
                break;
        }
        setProducts(products.map(product => 
            product.id === id ? { ...product, [field]: inputValue } : product
        ));
        
    };

    const handleImageSelect = (id: number, images: any[]) => {
        setProducts(products.map(product => 
            product.id === id ? { ...product, "images": images } : product
        ));
    }



    const {mutate, isPending} = useOutflowAssignDeliveryInfo({
            onSuccess: () =>{
                refetch()
                toast.success("Approved successfully");
                setOpen(false)
            },
            onError: (errors: any) =>{
                toast.error(getErrorMap(errors));
            }
        })
    
     function onSubmit() {
            
            mutate({
                body: products,
                pathParams: { id: data?.id }
            }as any)
        }
    return(
        <Dialog open={open}>
            <DialogContent className="md:max-w-[1000px] p-0 text-[#334155] !rounded-b-lg">
                <DialogTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">Set Delivery Details</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
            <div className="bg-white px-5 rounded-lg shadow-md pb-5 ">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 container md:w-2/3s mx-auto px-1">
                        <div className="">
                            <div className="text-[#4A8D34] font-medium text-sm flex justify-between">
                                Truck Details ({products.length})
                                <Button type="button" onClick={addNewProductField} className="h-7"><Plus/> Add Truck</Button>
                            </div>
                            <hr className="my-2"/>
                            <div className="mt-5 h-[500px] overflow-y-auto relative ">
                                {products.map((item, idx) => (
                                    <div key={idx} className="">
                                        {idx > 0 && (
                                            <div >
                                            <button
                                                type="button"
                                                onClick={() => removeProductField(String(item.id))}
                                                className="absolute text-xs flex -mt-5 right-0 p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                            >
                                                <X size={16} className="text-red-500" /> Remove
                                            </button>
                                            </div>
                                        )}
                                        
                                        <div  className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
                                        
                                            <div  className=" rounded-lg border p-4 relative">
                                                
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div className="w-full space-y-3">
                                                        <Label className="text-sm">Driver Name <div className='text-red-500'>*</div></Label>
                                                        <div>
                                                            <Input  
                                                                className="" 
                                                                value={item.driver_name}
                                                                onChange={(e) => updateProduct(item.id, 'driver_name', e.target.value)}
                                                                required/>
                                                        </div>
                                                    </div>
                                                    <div className="w-full space-y-3">
                                                        <Label className="text-sm">Driver License <div className='text-red-500'>*</div></Label>
                                                        <div>
                                                            <Input  
                                                                className="" 
                                                                value={item.driver_license_number}
                                                                onChange={(e) => updateProduct(item.id, 'driver_license_number', e.target.value)}
                                                                required/>
                                                        </div>
                                                    </div>
                                                    <div className="w-full space-y-3">
                                                        <Label className="text-sm">Driver Phone Number <div className='text-red-500'>*</div></Label>
                                                        <div>
                                                            <PhoneNumberInput
                                                                onChange={(e) => updateProduct(item.id, 'driver_phone_number', e as string)}
                                                                maxLength={12}
                                                                value={item.driver_phone_number}
                                                                placeholder={"eg. 024 123 4567"}
                                                                defaultCountry="GH"
                                                                className="phone-input"
                                                                international={false}
                                                                countryCallingCodeEditable={true}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="w-full space-y-3">
                                                        <Label className="text-sm">Truck License Plate Number <div className='text-red-500'>*</div></Label>
                                                        <div>
                                                            <Input  
                                                                className="" 
                                                                value={item.truck_license_number}
                                                                onChange={(e) => updateProduct(item.id, 'truck_license_number', e.target.value)}
                                                                required/>
                                                        </div>
                                                    </div>
                                                    <div className="w-full space-y-3">
                                                        <Label className="text-sm">Destination <div className='text-red-500'>*</div></Label>
                                                        <div>
                                                            <Input  
                                                                className="" 
                                                                value={item.destination}
                                                                onChange={(e) => updateProduct(item.id, 'destination', e.target.value)}
                                                                required/>
                                                        </div>
                                                    </div>
                                                    <div className="w-full space-y-3">
                                                        <Label className="text-sm">Transport Company </Label>
                                                        <div>
                                                            <Input  
                                                                className="" 
                                                                value={item.company}
                                                                onChange={(e) => updateProduct(item.id, 'company', e.target.value)}
                                                               />
                                                        </div>
                                                    </div>
                                                    
                                                    
                                                    
                                                </div>
                                                <div className="grid grid-cols-1 w-full space-y-3 mt-5">
                                                    <Label className="text-sm">Assigned Warehouse for Pickup <div className='text-red-500'>*</div></Label>
                                                    <MultiSelect
                                                        onChange={(e: any) => updateProduct(item.id, 'warehouse_ids', e)}
                                                        isMulti
                                                        options={warehousesOptions}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        defaultValue={warehousesOptions}
                                                        required
                                                    />
                                                    
                                                </div>
                                                <div className="w-[1/2] space-y-3 mt-3">
                                                    <Label className="text-sm">Escort Required? <div className='text-red-500'>*</div></Label>
                                                    <RadioGroup
                                                            className="flex flex-row w-full gap-x-6"
                                                            required
                                                            onValueChange={(value) => updateProduct(item.id, 'escort_required', value)}
                                                            defaultValue={item.escort_required ? "true": "false"}
                                                        >
                                                        {YES_NO_OPTIONS.map((item, idx) =>(
                                                            <div key={idx} className="flex items-center space-x-2">
                                                                <RadioGroupItem value={item.value} id={item.value} />
                                                                <Label htmlFor={item.value} className="capitalize cursor-pointer">{item.label}</Label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                </div>
                                                {item.escort_required && 
                                                    <div className="grid grid-cols-1 w-full space-y-3 mt-3">
                                                        <Label className="text-sm">Escort Details</Label>
                                                        <div>
                                                            <Textarea  
                                                                className="" 
                                                                placeholder="Type Comments" 
                                                                value={item.escort_details}
                                                                onChange={(e) => updateProduct(item.id, 'escort_details', e.target.value)}
                                                                required/>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            <div className="w-full">
                                                <UploadImagesCardCol1
                                                    handleImageSelect={handleImageSelect}
                                                    id={item.id}
                                                    title={"Upload Delivery Truck Image"}
                                                />
                                            </div>
                                        </div>
                                        <hr className="my-5 border border-1 border-dashed"/>
                                    </div>
                                ))}
                                
                            </div>
                        </div>
                        
                        <div className="flex justify-center">
                            <Button type="submit" className="bg-[#16A34A] text-white w-fulls rounded-md cursor-pointer"> 
                                <LoadingLabel isLoading={isPending}>{isEdit ? "Edit" : "Submit"}</LoadingLabel>
                            </Button>
                        </div>

                    </form>
                </Form>
            </div>
            </DialogContent>
        </Dialog>
    )
}