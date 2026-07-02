"use client";

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
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label, LoadingLabel } from "@/components/ui/label";
import { leadFarmerSchema } from "../utils/validations";
import { ArrowLeft, Loader, Save } from "lucide-react";
import { COUNTRY_LIST, GENDER_OPTIONS, routeTo, YES_NO_OPTIONS } from "@/lib/constants";
import PhoneNumberInput from "react-phone-number-input";
import { useRouter } from "next/navigation";
import { useFarmManagementFarmerCreate, useFarmManagementFarmerUpdate, useRegionsList } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import {  cleanJsonData, getErrorMap, stringToBool } from "@/lib/helpers";
import { Region } from "@/apis/adminApiSchemas";
import useGetRegionDistricts, { useAllFarms } from "../utils/hooks";
import { areasOfNeed, ID_TYPE_OPTIONS } from "../utils/constants";
import { formatPhoneNumberWithOutPlus, formatPhoneNumberWithPlus } from "@/modules/UserManagement/utils/helpers";

const getValueId = (value: any) => value?.id ?? value ?? "";
const getStringValue = (value: any) => value === undefined || value === null ? "" : String(value);
const getCountryValue = (value: any) => value?.name ?? value?.label ?? value ?? "";
const idTypeMap = {
    ghana_card: "Ghana Card",
    passport: "Passport ID",
} as Record<string, string>;
const getIdTypeValue = (value: any) => idTypeMap[String(value)] || getStringValue(value);
const getLeadFarmerDefaultValues = (defaultData: any) => ({
    ...defaultData,
    phone_number: formatPhoneNumberWithPlus(defaultData?.phone_number),
    email: defaultData?.email || "",
    other_names: defaultData?.other_names || "",

    farm: getStringValue(getValueId(defaultData?.farm)),
    region: getStringValue(getValueId(defaultData?.region)),
    district: getStringValue(getValueId(defaultData?.district)),
    country: getStringValue(getCountryValue(defaultData?.country)),

    farming_type: getStringValue(defaultData?.leadership_experience?.farming_type),
    is_mentoring_other_farmers: getStringValue(defaultData?.leadership_experience?.is_mentoring_other_farmers),
    id_type: getIdTypeValue(defaultData?.id_type),
    number_of_farmers_mentoring: defaultData?.leadership_experience?.number_of_farmers_mentoring || "",
    has_farming_membership: getStringValue(defaultData?.leadership_experience?.has_farming_membership),
    farm_association: defaultData?.leadership_experience?.farm_association || "",
    has_received_farming_leadership_training: getStringValue(defaultData?.leadership_experience?.has_received_farming_leadership_training ?? defaultData?.leadership_experience?.received_farming_leadership_training),
    farming_leadership_training: defaultData?.leadership_experience?.farming_leadership_training || defaultData?.leadership_experience?.specify_farming_leadership_training || "",

    has_received_support: getStringValue(defaultData?.support_assistance?.has_received_support ?? defaultData?.support_assistance?.received_support),
    support_received: defaultData?.support_assistance?.support_received || defaultData?.support_assistance?.specify_support_received || "",
    areas_of_needed_assistance: defaultData?.support_assistance?.areas_of_needed_assistance || ""
});

export default function AddLeadFarmer({isEdit, defaultData={}, farmerRegRequestId}:{isEdit?: boolean; defaultData?: any; farmerRegRequestId?: number}) {

    const router = useRouter()
    const form = useForm<z.infer<typeof leadFarmerSchema>>({
        resolver: zodResolver(leadFarmerSchema),
        defaultValues: getLeadFarmerDefaultValues(defaultData)
    });

    useEffect(() => {
        form.reset(getLeadFarmerDefaultValues(defaultData));
    }, [defaultData, form]);

    const {data:_regionsData, isLoading: isLoadingRegions} = useRegionsList({})
    const _regions = _regionsData as any
    const regions = _regions?.results as Region[] || []
    const {districts} = useGetRegionDistricts(regions, Number(form.watch("region")))
    
    const {farms: farms, isLoading:isLoadingFarms} = useAllFarms()

    const {mutate, isPending} = useFarmManagementFarmerCreate({
        onSuccess: () => {
            toast.success("Lead Farmer added successfully")
            router.push(routeTo.farmers)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const {mutate: updateMutate, isPending: isUpdating} = useFarmManagementFarmerUpdate({
        onSuccess: () => {
            toast.success("Lead Farmer updated successfully")
            router.push(routeTo.farmers)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    function onSubmit(values: z.infer<typeof leadFarmerSchema>) {
        const payload = cleanJsonData({
            type: "lead",
            first_name: values?.first_name,
            last_name: values?.last_name,
            other_names: values?.other_names,
            gender: values?.gender as "m" | "f",
            date_of_birth: values?.date_of_birth,
            id_type: values?.id_type,
            id_number: values?.id_number,
            phone_number: formatPhoneNumberWithOutPlus(values?.phone_number),
            email: values?.email || "",
            address: values?.address,
            village: values?.village,
            region: values?.region,
            district: values?.district,
            country: values?.country,
            farm: Number(values?.farm),
            leadership_experience: {
                farming_type: values?.farming_type,
                is_mentoring_other_farmers: stringToBool(values?.is_mentoring_other_farmers),
                number_of_farmers_mentoring: values?.number_of_farmers_mentoring,
                has_farming_membership: stringToBool(values?.has_farming_membership),
                farm_association: values?.farm_association,
                has_received_farming_leadership_training: stringToBool(values?.has_received_farming_leadership_training),
                farming_leadership_training: values?.farming_leadership_training,
            },
            support_assistance: {
                has_received_support: stringToBool(values?.has_received_support),
                support_received: values?.support_received,
                areas_of_needed_assistance: values?.areas_of_needed_assistance
            },
            farmer_reg_request: farmerRegRequestId
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
        <div className="mt-1 p-5 w-full">
            <div className="flex justify-between mb-5">
                <Button variant="outline" className="cursor-pointer" onClick={() => router.push(routeTo.farmers)}>
                   <ArrowLeft className="text-[#16A34A]"/>  Back
                </Button>
                <Button variant="outline" className="bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A] cursor-pointer" onClick={form.handleSubmit(onSubmit)}>
                   <Save className="text-[#16A34A]"/>  
                   <LoadingLabel isLoading={isPending || isUpdating}>Save and continue later</LoadingLabel>
                </Button>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 container md:w-[833px] mx-auto">
                    <div className="text-xl font-medium">Lead Farmer - Personal Information</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name <div className='text-red-500'>*</div></FormLabel>
                                <FormControl>
                                <Input placeholder="Enter First Name" {...field} required/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name <div className='text-red-500'>*</div></FormLabel>
                                <FormControl>
                                <Input placeholder="Enter Last Name" {...field} required/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="other_names"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Other Names </FormLabel>
                                <FormControl>
                                <Input placeholder="Enter Other Names" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div>
                            <Label className="capitalize mb-3">Gender<div className='text-red-500'>*</div></Label>
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <RadioGroup 
                                            className="flex flex-row w-full gap-x-6"
                                            required
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                        {GENDER_OPTIONS.map((item, idx) =>(
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        <FormField
                            control={form.control}
                            name="date_of_birth"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of Birth <div className='text-red-500'>*</div></FormLabel>
                                <FormControl>
                                <Input placeholder="Enter Date of Birth" {...field} type="date" required/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="id_type"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select ID Type<div className='text-red-500'>*</div></FormLabel>
                                <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                required
                                >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                    </SelectTrigger> 
                                </FormControl>
                                <SelectContent>
                                    {ID_TYPE_OPTIONS.map((item) => (
                                        <SelectItem key={item} value={item}>{item}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="id_number"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Number <div className='text-red-500'>*</div></FormLabel>
                                <FormControl>
                                <Input placeholder="Enter ID Number" {...field} required/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone_number"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number <div className='text-red-500'>*</div></FormLabel>
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
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <Input placeholder="Enter Email" {...field} type="email"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address<div className='text-red-500'>*</div></FormLabel>
                                <FormControl>
                                <Input placeholder="Enter Address" {...field} required/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1">
                        <FormField
                            control={form.control}
                            name="village"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Village/Community<div className='text-red-500'>*</div></FormLabel>
                                <FormControl>
                                <Input placeholder="Enter Community" {...field} required/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="region"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Region {isLoadingRegions && <Loader className="animate-spin"/>}<div className='text-red-500'>*</div></FormLabel>
                                <Select
                                onValueChange={field.onChange}
                                value={field.value}
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
                                value={field.value}
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
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country<div className='text-red-500'>*</div></FormLabel>
                                <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                required
                                >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                    </SelectTrigger> 
                                </FormControl>
                                <SelectContent>
                                    {COUNTRY_LIST.map((item, idx) =>(
                                        <SelectItem key={idx} value={item.label}>{item.label}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="farm"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Farm {isLoadingFarms && <Loader className="animate-spin"/>}</FormLabel>
                                <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                    </SelectTrigger> 
                                </FormControl>
                                <SelectContent>
                                    {farms?.map((item, idx) => (
                                        <SelectItem key={idx} value={String(item?.id)}>{item?.name}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="text-xl font-medium">Leadership & Experience</div>
                    <div className=""> 
                        <FormField
                            control={form.control}
                            name="farming_type"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Farming Type</FormLabel>
                                <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                    </SelectTrigger> 
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="subsistence">Subsistence</SelectItem>
                                    <SelectItem value="commercial">Commercial</SelectItem>
                                    <SelectItem value="mixed">Mixed</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       
                        <div>
                            <Label className="capitalize mb-3">Are you currently mentoring other farmers</Label>
                            <FormField
                                control={form.control}
                                name="is_mentoring_other_farmers"
                                render={({ field }) => (
                                    <RadioGroup 
                                        className="flex flex-row w-full gap-x-6"
                                        required
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        {YES_NO_OPTIONS.map((item, idx) =>(
                                            <div key={idx} className="flex items-center space-x-2">
                                                <RadioGroupItem value={item.value} id={item.value} />
                                                <Label htmlFor={item.value} className="capitalize cursor-pointer">{item.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup> 
                                )}/>
                        </div>
                        <FormField
                            control={form.control}
                            name="number_of_farmers_mentoring"
                            render={({ field }) => (
                            <FormItem className={`${form.watch("is_mentoring_other_farmers") !== "true" && "opacity-[40%]"}`}>
                                <FormLabel>If Yes, how many farmers are you mentoring </FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} type="number" required disabled={form.watch("is_mentoring_other_farmers") !== "true"}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <Label className="capitalize mb-3">Membership in Farming Cooperatives/Associations</Label>
                            <FormField
                                control={form.control}
                                name="has_farming_membership"
                                render={({ field }) => (
                                    <RadioGroup 
                                        className="flex flex-row w-full gap-x-6"
                                        required
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        {YES_NO_OPTIONS.map((item, idx) =>(
                                            <div key={idx} className="flex items-center space-x-2">
                                                <RadioGroupItem value={item.value} id={item.value} />
                                                <Label htmlFor={item.value} className="capitalize cursor-pointer">{item.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup> 
                                )}/>
                        </div>
                        <FormField
                            control={form.control}
                            name="farm_association"
                            render={({ field }) => (
                            <FormItem className={`${form.watch("has_farming_membership") !== "true" && "opacity-[40%]"}`}>
                                <FormLabel>If Yes, Please Specify Here </FormLabel>
                                <FormControl>
                                <Input placeholder="" {...field} required disabled={form.watch("has_farming_membership") !== "true"}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <Label className="capitalize mb-3"> Have you received any leadership or agricultural training?</Label>
                            <FormField
                                control={form.control}
                                name="has_received_farming_leadership_training"
                                render={({ field }) => (
                                    <RadioGroup 
                                        className="flex flex-row w-full gap-x-6"
                                        required
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        {YES_NO_OPTIONS.map((item, idx) =>(
                                            <div key={idx} className="flex items-center space-x-2">
                                                <RadioGroupItem value={item.value} id={item.value} />
                                                <Label htmlFor={item.value} className="capitalize cursor-pointer">{item.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup> 
                                )}/>
                        </div>
                        <FormField
                            control={form.control}
                            name="farming_leadership_training"
                            render={({ field }) => (
                            <FormItem className={`${form.watch("has_received_farming_leadership_training") !== "true" && "opacity-[40%]"}`}>
                                <FormLabel>If Yes, Please Specify Here </FormLabel>
                                <FormControl>
                                <Input placeholder="" {...field} required disabled={form.watch("has_received_farming_leadership_training") !== "true"}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        
                    </div>
                    <div className="text-xl font-medium">Support & Assistance</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <Label className="capitalize mb-3">Do you receive any government or NGO support?</Label>
                            <FormField
                                control={form.control}
                                name="has_received_support"
                                render={({ field }) => (
                                    <RadioGroup 
                                        className="flex flex-row w-full gap-x-6"
                                        required
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        {YES_NO_OPTIONS.map((item, idx) =>(
                                            <div key={idx} className="flex items-center space-x-2">
                                                <RadioGroupItem value={item.value} id={item.value} />
                                                <Label htmlFor={item.value} className="capitalize cursor-pointer">{item.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup> 
                                )}/>
                        </div>
                        <FormField
                            control={form.control}
                            name="support_received"
                            render={({ field }) => (
                            <FormItem className={`${form.watch("has_received_support") !== "true" && "opacity-[40%]"}`}>
                                <FormLabel>If Yes, Please Specify Here </FormLabel>
                                <FormControl>
                                <Input placeholder="" {...field} disabled={form.watch("has_received_support") !== "true"}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="areas_of_needed_assistance"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Areas of Needed Assistance</FormLabel>
                            <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            >
                            <FormControl>
                                <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select" />
                                </SelectTrigger> 
                            </FormControl>
                            <SelectContent>
                                {areasOfNeed.map((item, idx) =>(
                                    <SelectItem key={idx} value={item.label}>{item.label}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" className="bg-[#16A34A] text-white w-fulls rounded-md cursor-pointer"> 
                             <LoadingLabel isLoading={isPending || isUpdating}>{isEdit ? "Update" : "Submit"}</LoadingLabel>
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    )
}
