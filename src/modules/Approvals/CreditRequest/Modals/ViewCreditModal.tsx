"use client"
import {
    DialogPoweredByFooter,
  } from "@/components/ui/dialog"
import { Label, LoadingLabel, TextLabel } from "@/components/ui/label";
import { PlusCircle, X, XCircle } from "lucide-react";
import { TModal } from "@/lib/types";
import { formatDateReadable, getErrorMap } from "@/lib/helpers";
import { CEDI } from "@/lib/constants";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCreditApproveDenyCredit, useWarehouseList } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { approveCreditSchema } from "../../utils/validations";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";


  export default function ViewCreditModal({open, setOpen, defaultData, refetch}:TModal){

    const [action, setAction] = useState<"approve"|"deny">("approve")
    const actionText = action === "approve" ? "Approved" : "Denied"

    const form = useForm<z.infer<typeof approveCreditSchema>>({
        resolver: zodResolver(approveCreditSchema),
        defaultValues: {},
    });

    const {data: _data} = useWarehouseList({queryParams: {page:1, page_size: 200}})
    const warehouses = _data?.results ?? []

     const [products, setProducts] = useState([
        {
            _id: Date.now(),
            warehouse: '',
            quantity: '',
        }
    ]);

    const addNewProductField = () => {
        const newProduct = {
        _id: Date.now(),
        warehouse: '',
        quantity: ''
        };
        setProducts([...products, newProduct]);
    };

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


    const {mutate, isPending} = useCreditApproveDenyCredit({
        onSuccess: () =>{
            refetch?.()
            toast.success(`Credit ${actionText} Successfully`);
            setOpen(false);
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    // const validator = defaultData?.action === "approve" ? approveCreditSchema : denyCreditSchema

    function handleApproveDeny(values: any){
        const payload = {
            ...values
        } as any

        if(defaultData?.action === "approve"){
            payload.action = "approve"
            setAction("approve")
            payload.warehouses = products
        }
        if(defaultData?.action === "deny"){
            payload.action = "deny"
            payload.denial_notes = form.getValues("denial_notes")
            setAction("deny")
        }

        mutate({
            body: payload,
            pathParams: {
                id: defaultData.id
            }
        })
    }

    return(
        <Sheet open={open}>
            <SheetContent className="md:max-w-[550px] md:max-h-[750px] text-[#334155] rounded-lg mt-1">
                <SheetTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">Credit Request Approval - {defaultData?.credit_id}</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </SheetTitle>
                <hr/>
                <div className="overflow-y-auto ">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleApproveDeny)} className="space-y-5">
                        <div className="mt-1 px-5 mb-10 ">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <TextLabel title="Farmer" subTitle={`${defaultData?.farmer?.first_name} ${defaultData?.farmer?.last_name}`} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                <div>
                                    <TextLabel title="Inputs Credits" subTitle={defaultData?.input_credit?.name || "N/A"} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                <div>
                                    <TextLabel title="Credit Type" subTitle={defaultData?.input_credit?.category?.name} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                
                                <div>
                                    <TextLabel title="Quantity" subTitle={defaultData?.quantity} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                {defaultData?.action === "view" && 
                                    <>
                                        <div>
                                            <TextLabel title="Issue Date" subTitle={formatDateReadable(defaultData?.issue_date)} variant="primary"/>
                                            <hr className="mt-2"/>
                                        </div>
                                        <div>
                                            <TextLabel title="Due Date" subTitle={formatDateReadable(defaultData?.due_date)} variant="primary"/>
                                            <hr className="mt-2"/>
                                        </div>
                                        <div>
                                            <TextLabel title="Credit Amount" subTitle={`${CEDI} ${defaultData?.credit_amount}`} variant="primary"/>
                                            <hr className="mt-2"/>
                                        </div>
                                        <div>
                                            <TextLabel title="Interest Rate" subTitle={`${Number(defaultData?.interest_rate || 0).toFixed(0)}%`} variant="primary"/>
                                            <hr className="mt-2"/>
                                        </div>
                                        <div>
                                            <TextLabel title="Approval Status" subTitle={<Badge className="capitalize" variant={statusBadgeMap[defaultData?.approval_status?.toLowerCase()]}>{defaultData?.approval_status}</Badge>} variant="primary"/>
                                            <hr className="mt-2"/>
                                        </div>
                                        <div>
                                            <TextLabel title="Payment Status" subTitle={<Badge variant={statusBadgeMap[defaultData?.payment_status?.toLowerCase()]}>{defaultData?.payment_status}</Badge>} variant="primary"/>
                                            <hr className="mt-2"/>
                                        </div>
                                    </>
                                }
                                
                            </div>

                            <div className="grid grid-cols-1 mt-5 gap-5">
                                <div className="">
                                    <TextLabel title="Extra Information/Notes" subTitle={defaultData?.notes} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                                
                            </div>
                            {/* <div className="flex justify-end mt-5">
                                <div className="md:w-[1/2]">
                                    <TextLabel title="Created By" subTitle={`${defaultData?.created_by?.first_name} ${defaultData?.created_by?.last_name}`} variant="primary"/>
                                    <hr className="mt-2"/>
                                </div>
                            </div> */}
                            {defaultData?.action === "deny" &&
                                <div className="mt-10 mb-5">
                                    <FormField
                                        control={form.control}
                                        name="denial_notes"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type the reason for denying this credit request.
                                            <span className="text-red-500 font-medium">This is irreversible!</span></FormLabel>
                                            <FormControl>
                                            <Textarea placeholder="Type here..." {...field} required/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                </div>
                            }
                            {defaultData?.action === "approve" &&
                                <div className="h-[430px] overflow-y-auto mb-10">
                                    <div className="rounded-lg border p-4 bg-[#F8FAFC] mt-3 ">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                            <FormField
                                                control={form.control}
                                                name="credit_amount"
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Credit Amount <div className='text-red-500'>*</div></FormLabel>
                                                    <FormControl>
                                                    <div className="relative flex items-center">
                                                        <span className="absolute mt-1 left-2 ms-2s text-[#4A8D34] font-medium text-xs">{CEDI}</span>
                                                        <Input placeholder="0" {...field} type="number" className="px-10"/>
                                                    </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="interest_rate"
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Interest Rate <div className='text-red-500'>*</div></FormLabel>
                                                    <FormControl>
                                                    <div className="relative flex items-center">
                                                        <span className="absolute right-2 ms-2s text-[#4A8D34] font-medium text-xs">%</span>
                                                            <Input placeholder="0" {...field} type="number"/>
                                                    </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>  
                                            )}/>
                                            <FormField
                                                control={form.control}
                                                name="issue_date"
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Issue Date <div className='text-red-500'>*</div></FormLabel>
                                                    <FormControl>
                                                    <Input type="date" {...field} max={new Date().toISOString().split("T")[0]}/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="due_date"
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Due Date <div className='text-red-500'>*</div></FormLabel>
                                                    <FormControl>
                                                    <Input type="date" {...field} min={form.watch("issue_date")}/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>  
                                            )}/>
                                        </div>
                                        <hr className="border-1 border-dashed border-[#CBD5E1]"/>
                                        <div className="grid grid-cols-1 gap-2 mt-3">
                                                {products.map((item, idx) => (
                                                    <div key={idx} className=" relative">
                                                        {idx > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeProductField(String(item._id))}
                                                                className="absolute -top-2 -right-1 p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                                            >
                                                                <X size={16} className="text-red-500" />
                                                            </button>
                                                        )}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div className="w-full space-y-3">
                                                                <Label className="text-sm">Warehouse <div className='text-red-500'>*</div></Label>
                                                                <Select
                                                                    required
                                                                    value={item.warehouse}
                                                                    onValueChange={(value) => updateProduct(item._id, 'warehouse', value)}
                                                                >
                                                                    <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select" />
                                                                    </SelectTrigger> 
                                                                    <SelectContent>
                                                                        {warehouses?.map((item:any, idx:number) => (
                                                                            <SelectItem key={idx} value={String(item?.id)}>{item?.name}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        
                                                            <div className="w-full space-y-3">
                                                                <Label className="text-sm">Quantity of Bags<div className='text-red-500'>*</div></Label>
                                                                <div>
                                                                    <Input
                                                                        className="" 
                                                                        placeholder="0" 
                                                                        type="number" 
                                                                        value={item.quantity}
                                                                        onChange={(e) => updateProduct(item._id, 'quantity', e.target.value)}
                                                                        required/>
                                                                </div>
                                                            </div>
                                                        
                                                        </div>
                                                    </div>
                                                ))}
                                                <div onClick={addNewProductField} className="cursor-pointer">
                                                    <div className="w-full h-10 flex flex-col items-center justify-center border rounded-lg bg-white shadow">
                                                        <div className="flex items-center text-sm gap-1" >
                                                            <PlusCircle className="text-[#64748B] text-xs" size={15}/>
                                                            Add New Warehouse Field
                                                        </div>
                                                        
                                                    </div>

                                                </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {defaultData?.action !== "view" && 
                                <div className="flex justify-end bg-white h-10">
                                    {defaultData?.action === "deny" ?
                                        <Button className="" type="button" onClick={() => handleApproveDeny({})} variant={"destructive"}>
                                            <LoadingLabel isLoading={isPending && (action === "deny")}>
                                                Deny Request
                                            </LoadingLabel>
                                        </Button>
                                    :
                                     <Button className="sticky absolute bottom-10" type="submit" variant={"default"}>
                                        <LoadingLabel isLoading={isPending && (action === "approve")}>
                                            Accept
                                        </LoadingLabel>
                                    </Button>
                                    }
                                </div>
                            }
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