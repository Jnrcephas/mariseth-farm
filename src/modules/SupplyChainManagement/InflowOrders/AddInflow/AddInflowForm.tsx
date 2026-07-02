"use client"
import { useAccountsUsersAdminList, useInflowCreate, useInflowUpdate, useWarehouseList } from "@/apis/adminApiComponents";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { routeTo } from "@/lib/constants";
import { cleanJsonData, getErrorMap } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { inflowSchema } from "../../utils/validations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader, PlusSquare, X } from "lucide-react";
import { Label, LoadingLabel } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import moment from "moment";
import { useAllFarms } from "@/modules/FarmManagement/utils/hooks";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";

export default function AddInflowForm({defaultData = {}, isEdit}:{defaultData?: any, isEdit?: boolean}){

    const submitTitle = isEdit ? "Edit Inbound Order" : "Add Inbound Order";

    const router = useRouter()

    const form = useForm<z.infer<typeof inflowSchema>>({
        resolver: zodResolver(inflowSchema),
        defaultValues: defaultData
    });

    const {data: _usersData, isLoading: isLoadingUsers} = useAccountsUsersAdminList({queryParams: {page: 1, page_size: 100, user_type:"admin"} as any})
    const users = _usersData?.results as any[] || []

    const aggregators = users.filter((item) => item?.groups?.some((group: any) => group?.name?.toLowerCase().includes("aggregator")))
    const procurementOfficers = users.filter((item) => item?.groups?.some((group: any) => group?.name?.toLowerCase().includes("procurement")))

    const {data: _warehouseData, isLoading: isLoadingWarehouse} = useWarehouseList({queryParams: {page: 1, page_size: 100} as any})
    const warehouses = _warehouseData?.results as any[] || []

    const {farms: farms} = useAllFarms()  

    const [products, setProducts] = useState([
        {
            id: Date.now(),
            farm: '',
            product: '',
            quantity: '',
            unit_price: ''
        }
    ]);

    const farmsCrops = (id: number) => {
        const farm_id = products.find((item: any) => item.id === id)?.farm 
        return farms.find((item: any) => item.id === Number(farm_id))?.crops || [];
    }


    const addNewProductField = () => {
        const newProduct = {
        id: Date.now(),
        farm: '',
        product: '',
        quantity: '',
        unit_price: ''
        };
        setProducts([...products, newProduct]);
    };

    const removeProductField = (id: string) => {
        if (products.length > 1) {
        setProducts(products.filter(product => product.id !== Number(id)));
        }
    };

    const updateProduct = (id: number, field: string, value: string) => {
        setProducts(products.map(product => 
        product.id === id ? { ...product, [field]: value } : product
        ));
    };

    const calculateTotal = (quantity: string | number, amountPerBag: string | number): string => {
        const qty = parseFloat(quantity as string) || 0;
        const amount = parseFloat(amountPerBag as string) || 0;
        return (qty * amount).toFixed(2);
    };

    const getGrandTotal = () => {
        return products.reduce((sum, product) => {
        
        return sum + parseFloat(calculateTotal(product.quantity, product.unit_price))
        }, 0).toFixed(2);
    };

    const getTotalBags = () => {
        return products.reduce((sum, product) => {
        return sum + (parseInt(product.quantity) || 0);
        }, 0);
    };

    const additionalCost = Number(form.watch('additional_cost_amount')) || 0;


    const {mutate, isPending} = useInflowCreate({
            onSuccess: () =>{
                toast.success("Inbound added successfully");
                router.push(routeTo.inflowOrders)
            },
            onError: (errors: any) =>{
                toast.error(getErrorMap(errors));
            }
        })
    const {mutate: updateMutate, isPending: isUpdating} = useInflowUpdate({
        onSuccess: () =>{
            toast.success("Inbound updated successfully");
            router.push(routeTo.inflowOrders)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })


     function onSubmit(values: z.infer<typeof inflowSchema>) {
            const payload = cleanJsonData({
                ...values,
                order_creation_date: moment().format("YYYY-MM-DD"),
                products: products
                
            })
            
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
        <AuthorizeAndRenderPage permission={"inflow_orders|create_inflow_order"}>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 container md:w-2/3s mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="aggregator"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Aggregator {isLoadingUsers && <Loader className="animate-spin"/>}<div className='text-red-500'>*</div></FormLabel>
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
                                        {aggregators?.map((item, idx) => (
                                            <SelectItem key={idx} value={String(item?.id)}>{item?.first_name} {item?.last_name} - ({item?.groups?.[0]?.name})</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="procurement_officer"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Procurement Officer {isLoadingUsers && <Loader className="animate-spin"/>}<div className='text-red-500'>*</div></FormLabel>
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
                                        {procurementOfficers?.map((item, idx) => (
                                            <SelectItem key={idx} value={String(item?.id)}>{item?.first_name} {item?.last_name} - ({item?.groups?.[0]?.name})</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="destination_warehouse"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Destination {isLoadingWarehouse && <Loader className="animate-spin"/>}<div className='text-red-500'>*</div></FormLabel>
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
                                        {warehouses?.map((item, idx) => (
                                            <SelectItem key={idx} value={String(item?.id)}>{item?.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="expected_delivery_date"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expected Delivery<div className='text-red-500'>*</div></FormLabel>
                                    <FormControl>
                                    <Input placeholder="" {...field} type={"date"} min={moment().format("YYYY-MM-DD")} required/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            
                        </div>
                        <div className="grid grid-cols-1"> 
                            <FormField
                                control={form.control}
                                name="comments"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Extra Comments</FormLabel>
                                    <FormControl>
                                    <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                        </div>
                        <div>
                            <div className="text-[#4A8D34] font-medium text-sm">Add Farms Of Aggregated Products</div>
                            <div className=" gap-8 ">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
                                    {products.map((item, idx) => (
                                        <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-lg border p-4 bg-[#F8FAFC] relative">
                                            {idx > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeProductField(String(item.id))}
                                                    className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                                >
                                                    <X size={16} className="text-red-500" />
                                                </button>
                                            )}
                                            <div className="w-full space-y-3">
                                                <Label className="text-sm">Farm Name <div className='text-red-500'>*</div></Label>
                                                <Select
                                                    required
                                                    value={item.farm}
                                                    onValueChange={(value) => updateProduct(item.id, 'farm', value)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select" />
                                                    </SelectTrigger> 
                                                    <SelectContent>
                                                        {farms?.map((item, idx) => (
                                                            <SelectItem key={idx} value={String(item?.id)}>{item?.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="w-full space-y-3">
                                                <Label className="text-sm">Product <div className='text-red-500'>*</div></Label>
                                                <Select
                                                    required
                                                    value={item.product}
                                                    onValueChange={(value) => updateProduct(item.id, 'product', value)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select" />
                                                    </SelectTrigger> 
                                                    <SelectContent>
                                                        {farmsCrops(item?.id)?.map((item: any, idx: number) => (
                                                            <SelectItem key={idx} value={String(item?.product?.id)}>{item?.product?.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="w-full space-y-3">
                                                <Label className="text-sm">Quantity (weight)<div className='text-red-500'>*</div></Label>
                                                <Input 
                                                    placeholder="Enter Quantity" 
                                                    type="number" 
                                                    value={item.quantity}
                                                    onChange={(e) => updateProduct(item.id, 'quantity', e.target.value)}
                                                    required/>
                                            </div>
                                            <div className="w-full space-y-3">
                                                <Label className="text-sm">Amount per Weight <div className='text-red-500'>*</div></Label>
                                                <div>
                                                    <span className="absolute mt-[10px] ms-3 text-[#4A8D34] font-medium text-sm">GH₵</span>
                                                    <Input  
                                                        className="px-13" 
                                                        placeholder="0.00" 
                                                        type="number" 
                                                        value={item.unit_price}
                                                        onChange={(e) => updateProduct(item.id, 'unit_price', e.target.value)}
                                                        required/>
                                                </div>
                                            </div>
                                            <div className=" font-medium text-sm">
                                                <span className="text-[#4A8D34] text-xs">Total: </span> GH₵ {calculateTotal(item.quantity, item.unit_price)}
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
                            </div>
                        </div>
                        <div>
                            <div className="text-[#4A8D34] font-medium text-sm">Additional Cost and Order Total</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-lg border p-4 bg-[#F8FAFC]">
                                <div className="w-full space-y-3">   
                                    <FormField
                                        control={form.control}
                                        name="additional_costs"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Additional Cost Description</FormLabel>
                                            <FormControl>
                                            <Input placeholder="" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full space-y-3">
                                    <FormField
                                        control={form.control}
                                        name="additional_cost_amount"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Amount</FormLabel>
                                            <FormControl>
                                                <div>
                                                <span className="absolute mt-[10px] ms-3 text-[#4A8D34] font-medium text-sm">GH₵</span>
                                                <Input className="px-13" placeholder="0.00" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full space-y-1">
                                    <div className="text-[#4A8D34] text-xs">Total Number of Bags: </div>
                                    <div className=" font-medium text-sm">
                                        {getTotalBags()}
                                    </div>
                                </div>
                                <div className="w-full space-y-1">
                                    <div className="text-[#4A8D34] text-xs">Order Total: </div>
                                    <div className=" font-medium text-sm">
                                        GH₵ {Number(getGrandTotal()) + additionalCost}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button type="submit" className="bg-[#16A34A] text-white w-fulls rounded-md cursor-pointer"> 
                                <LoadingLabel isLoading={isPending || isUpdating}>{submitTitle}</LoadingLabel>
                            </Button>
                        </div>

                    </form>
                </Form>
            </div>
        </AuthorizeAndRenderPage>
    )
}