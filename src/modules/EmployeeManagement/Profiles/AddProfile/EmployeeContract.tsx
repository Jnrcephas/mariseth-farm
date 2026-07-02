"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label, LoadingLabel } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { routeTo, YES_NO_OPTIONS } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDepartmentList, useEmployeeUpdate, useJobTitleList } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { cleanJsonData, getErrorMap, stringToBool } from "@/lib/helpers";
import { employeeContractSchema } from "../../utils/validations";
import { useRouter } from "next/navigation";
import { EMPLOYMENT_TYPES, WORK_TYPES } from "../../utils/constants";


export function EmployeeContract({defaultData, setLevel}:{defaultData?: any; setLevel: (level: number) => void;}){

    const router = useRouter()

    const form = useForm<z.infer<typeof employeeContractSchema>>({
        resolver: zodResolver(employeeContractSchema),
        defaultValues: {
            ...defaultData?.contract,
            ssnit_number: defaultData?.contract?.ssnit_number ?? "",
            bank_name: defaultData?.contract?.bank_name ?? "",
            bank_branch: defaultData?.contract?.bank_branch ?? "",
            account_number: defaultData?.contract?.account_number ?? "",

            job_title: String(defaultData?.contract?.job_title?.id),
            department: String(defaultData?.contract?.department?.id),
            annual_leave_days: String(defaultData?.contract?.annual_leave_days),
            sick_leave_days: String(defaultData?.contract?.sick_leave_days),
            leave_rollover: String(defaultData?.contract?.leave_rollover)
        } as any
    });

    const {data: _jobTitles} = useJobTitleList({queryParams:{page: 1, page_size: 50}})
    const jobTitles = _jobTitles as any

    const {data: _departments} = useDepartmentList({queryParams:{page: 1, page_size: 50}})
    const departments = _departments as any


    const {mutate: updateMutate, isPending: isUpdating} =  useEmployeeUpdate({
        onSuccess: () =>{
            toast.success("Employee Contract Saved Successfully")
            router.push(routeTo.employeeProfiles)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })
    
    function onSubmit(values: z.infer<typeof employeeContractSchema>) {
        const payload = cleanJsonData({
            ...values,
            leave_rollover: stringToBool(values?.leave_rollover)
        })
        updateMutate({
            body: {
                contract: payload
            } as any,
            pathParams: {
                id: defaultData?.id
            }
        })
    }


    return(
        <div>
            <div className="flex justify-between items-center py-5">
                <div className="text-lg font-medium ">Contract</div>
                <div className="flex gap-5">
                    <Button onClick={() =>  setLevel(2)} variant={"ghost"} className="border"><ArrowLeft className="text-[#16A34A]"/>Back</Button>
                    
                </div>
            </div>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-1 gap-5">
                            <FormField
                                control={form.control}
                                name="start_date"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Employment Start Date <div className='text-red-500'>*</div></FormLabel>
                                    <FormControl>
                                    <Input placeholder="Enter First Name" {...field} type="date" required/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="job_title"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Title <div className='text-red-500'>*</div></FormLabel>
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
                                            {jobTitles?.results?.map((item: any, idx: number) => (
                                                <SelectItem key={`j-${idx}`} value={String(item?.id)}>{item?.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department<div className='text-red-500'>*</div></FormLabel>
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
                                            {departments?.results?.map((item: any, idx: number) => (
                                                <SelectItem key={`d-${idx}`} value={String(item?.id)}>{item?.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="employment_type"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Employment Type <div className='text-red-500'>*</div></FormLabel>
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
                                            {EMPLOYMENT_TYPES?.map((item, idx) => (
                                                <SelectItem key={`t-${idx}`} value={item.value}>{item.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="work_type"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Work Type <div className='text-red-500'>*</div></FormLabel>
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
                                            {WORK_TYPES?.map((item, idx) => (
                                                <SelectItem key={`w-${idx}`} value={item.value}>{item.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="ssnit_number"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SSNIT Number</FormLabel>
                                        <FormControl>
                                        <Input placeholder="XXXXXXXXXXX" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bank_name"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank Name</FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Bank Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bank_branch"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank Branch</FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Account Name" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="account_number"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank Account Number</FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter Account Number" {...field} type="number"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="annual_leave_days"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Annual Leave Days <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter leave days" {...field} type="number" required/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sick_leave_days"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sick Leave Days <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter sick leave days" {...field} type="number" required/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="leave_rollover"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Does Leave Rollover</FormLabel>
                                            <RadioGroup
                                                className="flex flex-row w-full gap-x-6"
                                                required
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                            {YES_NO_OPTIONS.map((item, idx) =>(
                                                <div key={idx} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={item.value} id={item.value} />
                                                    <Label htmlFor={item.value} className="capitalize cursor-pointer">{item.label}</Label>
                                                </div>
                                            ))}
                                            <FormMessage />
                                        </RadioGroup> 
                                    </FormItem>
                                )}/>
                            </div>
                           
                        </div>
                       
                        <div className="flex justify-end">
                            <Button type="submit" variant="default" className="w-[180px] mt-5">
                                <LoadingLabel isLoading={isUpdating}>
                                    Save
                                </LoadingLabel>
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}