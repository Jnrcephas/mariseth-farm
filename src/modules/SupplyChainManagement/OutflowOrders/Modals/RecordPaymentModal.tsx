import { DialogPoweredByFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingLabel, TextLabel } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { TModal } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { paymentSchema } from "../../utils/validations";
import { useOutflowRecordPayment } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { cleanJsonData, commaSeparator, getErrorMap } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PAYMENT_METHODS, PAYMENT_MODE_TYPES } from "../../utils/constants";
import { Input } from "@/components/ui/input";
import PhoneNumberInput from "react-phone-number-input";
import { Textarea } from "@/components/ui/textarea";
import { CEDI } from "@/lib/constants";
import { useEffect } from "react";


export default function RecordPaymentModal({open, setOpen, defaultData, refetch}:TModal){

    const form = useForm<z.infer<typeof paymentSchema>>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {}
    });

    const payment_type = form.watch("payment_type");

    useEffect(() => {
        if(payment_type === "full"){
            form.setValue("amount_paid", defaultData?.amount_due || 0);
        }
    }, [payment_type]);

    const {mutate, isPending} = useOutflowRecordPayment({
        onSuccess: () =>{
            if(refetch) refetch()
            toast.success("Recorded Successfully");
            setOpen(false)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof paymentSchema>) {
        const payload = cleanJsonData({
            ...values
        })
        mutate({
            body: payload,
            pathParams: {
                id: defaultData?.id
            }
        })
    }

    return(
         <Sheet open={open}>
            <SheetContent className="md:max-w-[550px] h-[750px] text-[#334155] rounded-lg mt-4">
                <SheetTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">Make Payment</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </SheetTitle>
                <hr/>
                <div className="px-5 h-full overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="mb-2 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <TextLabel title="Order Total" subTitle={`${CEDI} ${commaSeparator(defaultData?.total_cost)}`} />
                                    <TextLabel title="Amount Paid" subTitle={`${CEDI} ${commaSeparator(defaultData?.amount_paid)}`}/>
                                    <TextLabel title="Remainder" subTitle={`${CEDI} ${commaSeparator(defaultData?.amount_due)}`}/>
                                </div>
                                <hr/>
                            </div>
                            <div className="grid grid-cols-1 gap-5 mt-5 mb-5">
                                <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="payment_type"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Type<div className='text-red-500'>*</div></FormLabel>
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
                                                {PAYMENT_MODE_TYPES?.map((item, idx) => (
                                                    <SelectItem key={idx} value={String(item?.value)}>{item?.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="payment_method"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Method<div className='text-red-500'>*</div></FormLabel>
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
                                                {PAYMENT_METHODS?.map((item, idx) => (
                                                    <SelectItem key={idx} value={String(item?.value)}>{item?.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-12 gap-5"> 
                                    {["cash", "mobile_money"].includes(form.watch("payment_method")) && 
                                        <div className={`${form.watch("payment_method") === "cash" ? "col-span-12" : "col-span-6"}`}>
                                            <FormField
                                                control={form.control}
                                                name="paid_to"
                                                render={({ field }) => (
                                                <FormItem >
                                                    <FormLabel>Paid To<div className='text-red-500'>*</div></FormLabel>
                                                    <FormControl>
                                                    <Input placeholder="" {...field}  required/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />
                                        </div>
                                    }
                                    {form.watch("payment_method") === "mobile_money" && 
                                        <div className="col-span-6">
                                            <FormField
                                                control={form.control}
                                                name="mobile_money_number"
                                                render={({ field }) => (
                                                <FormItem >
                                                    <FormLabel>Mobile Money Number <div className='text-red-500'>*</div></FormLabel>
                                                    <FormControl>
                                                        <PhoneNumberInput
                                                            {...field}
                                                            maxLength={12}
                                                            placeholder={"eg. 024 123 4567"}
                                                            defaultCountry="GH"
                                                            className="phone-input"
                                                            international={false}
                                                            countryCallingCodeEditable={true}
                                                            required
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />
                                        </div>
                                    }
                                    {form.watch("payment_method") === "bank_transfer" &&   
                                    <>
                                        <div className="col-span-6">             
                                            <FormField
                                                control={form.control}
                                                name="bank_name"
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bank Name <div className='text-red-500'>*</div></FormLabel>
                                                    <FormControl>
                                                    <Input placeholder="" {...field} required/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-6">             
                                            <FormField
                                                control={form.control}
                                                name="bank_account_number"
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bank Account Number <div className='text-red-500'>*</div></FormLabel>
                                                    <FormControl>
                                                    <Input placeholder="" {...field} required/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-6">             
                                            <FormField
                                                control={form.control}
                                                name="bank_account_name"
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bank Account Name <div className='text-red-500'>*</div></FormLabel>
                                                    <FormControl>
                                                    <Input placeholder="" {...field} required/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />
                                        </div>
                                    </>
                                    }
                                </div>
                                <FormField
                                    control={form.control}
                                    name="amount_paid"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter Amount Here <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="" {...field} max={Number(defaultData?.amount_due)} type="number" required/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Note</FormLabel>
                                        <FormControl>
                                        <Textarea placeholder="Type here..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                            />
                            </div>
                            
                            <div className="flex justify-center bg-white bottom-0 ">
                                <Button type="submit" variant="default" className="w-full  ">
                                    <LoadingLabel isLoading={isPending}>Make Payment</LoadingLabel>
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