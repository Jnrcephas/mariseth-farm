"use client"
import {useCustomTypeList, useOutflowApprovalVerifyWarehouseStock} from "@/apis/adminApiComponents";
import { Form} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cleanJsonData, getErrorMap } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {  PlusSquare, X, XCircle } from "lucide-react";
import { Label, LoadingLabel } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import UploadImagesCard, { UploadedImage } from "@/components/UploadImagesCard";
import { inflowInspectionSchema } from "@/modules/SupplyChainManagement/utils/validations";

export default function ApproveInspectionCommentModal({
    open, 
    setOpen, 
    data,
    refetch}:{
        open: boolean, 
        setOpen: (open: boolean) => void, 
        data: any
        refetch: () => void
    }){

    const {data: _customTypesData} = useCustomTypeList({queryParams:{query: "order_comment_reason"}})
    const customTypes = _customTypesData?.results || []

    const form = useForm<z.infer<typeof inflowInspectionSchema>>({
        resolver: zodResolver(inflowInspectionSchema),
        defaultValues: {}
    });

    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])


    const [products, setProducts] = useState([
        {
            _id: Date.now(),
            id: '',
            available_quantity: '',
            reason: '',
            comments: ''
        }
    ]);

    const addNewProductField = () => {
        const newProduct = {
        _id: Date.now(),
        id: '',
        available_quantity: '',
        reason: '',
        comments: ''
        };
        setProducts([...products, newProduct]);
    };

    const getExpectedQuantity = (id: number) => {
        const selected_product_id = products?.find((item) => item._id === id)?.id
        const qty = data?.warehouse?.products?.find((item: any) => Number(item?.id) === Number(selected_product_id))
        return Number(qty?.expected_quantity || 0).toFixed(0)
    }

    const removeProductField = (id: string) => {
        if (products.length > 1) {
        setProducts(products.filter(product => product._id !== Number(id)));
        }
    };

    const updateProduct = (id: number, field: string, value: string) => {
        setProducts(products.map(product => 
        product._id === id ? { ...product, [field]: value } : product
        ));
    };


    const {mutate, isPending} = useOutflowApprovalVerifyWarehouseStock({
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
        const warehouse_id = data?.warehouse?.id
        const images = uploadedImages?.map((item) => item?.base64)
            const payload = cleanJsonData({
                images: images,
                complaints: products
            })
            mutate({
                body: payload,
                pathParams: {
                    id: data?.id,
                    warehouseId: warehouse_id
                }
            })
        }
    return(
        <Dialog open={open}>
            <DialogContent className="md:max-w-[980px] p-0 text-[#334155] !rounded-b-lg">
                <DialogTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">Approve Outbound Stock?</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
            <div className="bg-white px-5 rounded-lg shadow-md pb-5 ">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 container md:w-2/3s mx-auto ">
                        <div className="h-[500px] overflow-y-auto">
                            <div className="text-[#4A8D34] font-medium text-sm">Select Products</div>
                            <div className="gap-5s">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
                                    {products.map((item, idx) => (
                                        <div key={idx} className=" rounded-lg border p-4 bg-[#F8FAFC] relative">
                                            {idx > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeProductField(String(item._id))}
                                                    className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                                >
                                                    <X size={16} className="text-red-500" />
                                                </button>
                                            )}
                                           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="w-full space-y-3">
                                                    <Label className="text-sm">Product <div className='text-red-500'>*</div></Label>
                                                    <Select
                                                        required
                                                        value={item.id}
                                                        onValueChange={(value) => updateProduct(item._id, 'id', value)}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select" />
                                                        </SelectTrigger> 
                                                        <SelectContent>
                                                            {data?.warehouse?.products?.map((item:any, idx:number) => (
                                                                <SelectItem key={idx} value={String(item?.id)}>{item?.product?.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="w-full space-y-3">
                                                    <Label className="text-sm text-[#4A8D34]">Expected Quantity</Label>
                                                    <div className="text-xl">{getExpectedQuantity(item._id)} Bags</div>
                                                </div>
                                                <div className="w-full space-y-3">
                                                    <Label className="text-sm">Available Quantity <div className='text-red-500'>*</div></Label>
                                                    <div>
                                                        <Input  
                                                            className="" 
                                                            placeholder="0" 
                                                            type="number" 
                                                            max={getExpectedQuantity(item._id)}
                                                            value={item.available_quantity}
                                                            onChange={(e) => updateProduct(item._id, 'available_quantity', e.target.value)}
                                                            required/>
                                                    </div>
                                                </div>
                                                <div className="w-full space-y-3">
                                                    <Label className="text-sm">Reason <div className='text-red-500'>*</div></Label>
                                                    <Select
                                                        required
                                                        value={item.reason}
                                                        onValueChange={(value) => updateProduct(item._id, 'reason', value)}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select" />
                                                        </SelectTrigger> 
                                                        <SelectContent>
                                                            {customTypes.map((item, idx) => (
                                                                <SelectItem key={idx} value={String(item?.name)}>{item?.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 w-full space-y-3">
                                                <Label className="text-sm">Comments</Label>
                                                <div>
                                                    <Input  
                                                        className="" 
                                                        placeholder="Type Comments" 
                                                        value={item.comments}
                                                        onChange={(e) => updateProduct(item._id, 'comments', e.target.value)}
                                                        />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div onClick={addNewProductField} className="bg-[#cbd5e133]  h-full p-4 rounded-lg outline-2 outline-offset-2 outline-dashed outline-[#CBD5E1] flex items-center justify-center cursor-pointer hover:bg-[#cbd5e163] transition-all duration-200 ease-in-out">
                                        <div className="w-full h-full flex flex-col items-center justify-center">
                                            <div className="mb-2 w-10 h-10 p-2 flex items-center justify-center rounded-full bg-[#E2E8F0]">
                                                <PlusSquare className="text-[#64748B] text-xs" size={15}/>
                                            </div>
                                            
                                            <Label className="text-sm font-medium">Click to add new products field</Label>
                                            <small className="text-[#64748B]">Add a new product field to make a new comment on another product</small>
                                        </div>

                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-5 mt-5">
                                    <UploadImagesCard 
                                        uploadedImages={uploadedImages} 
                                        setUploadedImages={setUploadedImages}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-center">
                            <Button type="submit" className="bg-[#16A34A] text-white w-fulls rounded-md cursor-pointer"> 
                                <LoadingLabel isLoading={isPending}>Approve Outbound Stock</LoadingLabel>
                            </Button>
                        </div>

                    </form>
                </Form>
            </div>
            </DialogContent>
        </Dialog>
    )
}