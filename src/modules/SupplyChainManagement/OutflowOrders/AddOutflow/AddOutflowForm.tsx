"use client"
import { useAccountsUsersAdminList, useCustomerList, useOutflowCreate, useOutflowUpdate, useWarehouseList } from "@/apis/adminApiComponents";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { routeTo } from "@/lib/constants";
import { cleanJsonData, getErrorMap } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { outflowSchema } from "../../utils/validations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader, PlusSquare, X } from "lucide-react";
import { Label, LoadingLabel } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import moment from "moment";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";

export default function AddOutflowForm({defaultData = {}, isEdit}:{defaultData?: any, isEdit?: boolean}){

    const submitTitle = isEdit ? "Edit Outbound Order" : "Add Outbound Order";

    const router = useRouter()

    const form = useForm<z.infer<typeof outflowSchema>>({
        resolver: zodResolver(outflowSchema),
        defaultValues: defaultData
    });

    const {data: _usersData, isLoading: isLoadingUsers} = useAccountsUsersAdminList({queryParams: {page: 1, page_size: 100, user_type:"admin"} as any})
    const users = _usersData?.results as any[] || []

    const procurementOfficers = users.filter((item) => item?.groups?.some((group: any) => group?.name?.toLowerCase().includes("procurement")))


    const {data: _customersData, isLoading: isLoadingCustomers} = useCustomerList({queryParams: {page: 1, page_size: 100}})
    const customers = _customersData?.results as any[] || []
    
    const {data: _warehouseData} = useWarehouseList({queryParams: {page: 1, page_size: 100} as any})
    const warehouses = _warehouseData?.results as any[] || []

    const [products, setProducts] = useState([
        {
            id: Date.now(),
            warehouse_id: '',
            product_id: '',
            expected_quantity: '',
            price_per_unit: ''
        }
    ]);

    const getWarehouseCrops = (id: number) => {
        const selected_warehouse_id = products?.find((item) => item.id === id)?.warehouse_id
        const warehouse = warehouses?.find((item: any) => Number(item?.id) === Number(selected_warehouse_id))
        return warehouse?.products || []
    }

    const addNewProductField = () => {
        const newProduct = {
        id: Date.now(),
        warehouse_id: '',
        product_id: '',
        expected_quantity: '',
        price_per_unit: ''
        };
        setProducts([...products, newProduct]);
    };

    const removeProductField = (id: string) => {
        if (products.length > 1) {
        setProducts(products.filter(product => product.id !== Number(id)));
        }
    };

    const updateProduct = (id: number, field: string, value: string | number) => {
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
        
        return sum + parseFloat(calculateTotal(product.expected_quantity, product.price_per_unit));
        }, 0).toFixed(2);
    };

    const getTotalBags = () => {
        return products.reduce((sum, product) => {
        return sum + (parseInt(product.expected_quantity) || 0);
        }, 0);
    };

    const additionalCost = Number(form.watch('additional_cost_amount')) || 0;


    const {mutate, isPending} = useOutflowCreate({
            onSuccess: () =>{
                toast.success("Outbound added successfully");
                router.push(routeTo.outflowOrders)
            },
            onError: (errors: any) =>{
                toast.error(getErrorMap(errors));
            }
        })
    const {mutate: updateMutate, isPending: isUpdating} = useOutflowUpdate({
        onSuccess: () =>{
            toast.success("Outbound updated successfully");
            router.push(routeTo.inflowOrders)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })


     function onSubmit(values: z.infer<typeof outflowSchema>) {
            const payload = cleanJsonData({
                customer: values?.customer,
                procurement_officer: values?.procurement_officer,
                destination: values?.destination,
                expected_delivery_date: values?.expected_delivery_date,
                extra_comments: values?.extra_comments,
                additional_cost_amount: values?.additional_cost_amount,
                additional_costs: values?.additional_costs,
                products: products
            })
            
            if(isEdit){
                updateMutate({
                    body: payload,
                    pathParams: {
                        id: defaultData?.id
                    }
                } as any)
            }else{
                mutate({
                    body: payload
                } as any)
            }
            
        }
    return(
        <AuthorizeAndRenderPage permission={"outflow_orders|create_outflow_order"}>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 container md:w-2/3s mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="customer"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Buyer {isLoadingCustomers && <Loader className="animate-spin"/>}<div className='text-red-500'>*</div></FormLabel>
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
                                        {customers?.map((item, idx) => (
                                            <SelectItem key={idx} value={String(item?.id)}>{item?.name} {item?.last_name}</SelectItem>
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
                                name="destination"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Destination <div className='text-red-500'>*</div></FormLabel>
                                    <FormControl>
                                    <Input placeholder="" {...field} required/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="expected_delivery_date"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expected Delivery <div className='text-red-500'>*</div></FormLabel>
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
                                name="extra_comments"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Extra Comments</FormLabel>
                                    <FormControl>
                                    <Input placeholder="" {...field} required/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <div className="text-[#4A8D34] font-medium text-sm">Products</div>
                            <div className=" gap-8 ">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
                                    {products.map((item, idx) => (
                                        <div key={idx} className="rounded-lg border p-4 bg-[#F8FAFC] relative">
                                            <div  className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
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
                                                    <Label className="text-sm">Warehouse <div className='text-red-500'>*</div></Label>
                                                    <Select
                                                        required
                                                        value={item.warehouse_id}
                                                        onValueChange={(value) => updateProduct(item.id, 'warehouse_id', value)}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select" />
                                                        </SelectTrigger> 
                                                        <SelectContent>
                                                            {warehouses?.map((item, idx) => (
                                                                <SelectItem key={idx} value={String(item?.id)}>{item?.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="w-full space-y-3">
                                                    <Label className="text-sm">Product <div className='text-red-500'>*</div></Label>
                                                    <Select
                                                        required
                                                        value={item.product_id}
                                                        onValueChange={(value) => updateProduct(item.id, 'product_id', value)}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select" />
                                                        </SelectTrigger> 
                                                        <SelectContent>
                                                            {getWarehouseCrops(item?.id)?.map((item: any, idx:number) => (
                                                                <SelectItem key={idx} value={String(item?.product?.id)}>{item?.product?.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="w-full space-y-3">
                                                    <Label className="text-sm">Quantity (weight) <div className='text-red-500'>*</div></Label>
                                                    <Input 
                                                        placeholder="Enter Quantity" 
                                                        type="number" 
                                                        value={item.expected_quantity}
                                                        onChange={(e) => updateProduct(item.id, 'expected_quantity', Number(e.target.value))}
                                                        required/>
                                                </div>
                                                <div className="w-full space-y-3">
                                                    <Label className="text-sm">Amount per weight <div className='text-red-500'>*</div></Label>
                                                    <div>
                                                        <span className="absolute mt-[10px] ms-3 text-[#4A8D34] font-medium text-sm">GH₵</span>
                                                        <Input  
                                                            className="px-13" 
                                                            placeholder="0.00" 
                                                            type="number" 
                                                            value={item.price_per_unit}
                                                            onChange={(e) => updateProduct(item.id, 'price_per_unit', Number(e.target.value))}
                                                            required/>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            <div className="grid grid-cols-2 gap-5 mt-5">
                                                {/* <div className=" font-medium text-sm">
                                                    <span className="text-[#4A8D34] text-xs">Number of Bags in Warehouse: </span> 0
                                                </div> */}
                                                <div className=" font-medium text-sm">
                                                    <span className="text-[#4A8D34] text-xs">Total Order Amount: </span> GH₵ {calculateTotal(item.expected_quantity, item.price_per_unit)}
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