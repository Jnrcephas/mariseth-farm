"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label, LoadingLabel } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GENDER_OPTIONS, NOTIFICATION_OPTIONS, routeTo } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PhoneNumberInput from "react-phone-number-input";
import { ArrowLeft, ArrowRight, PenSquare, PlusCircle, X } from "lucide-react";
import { useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEmployeeCreate, useEmployeeUpdate } from "@/apis/adminApiComponents";
import { toast } from "sonner";
import { cleanJsonData, getErrorMap } from "@/lib/helpers";
import { employeeProfileSchema } from "../../utils/validations";
import { Employee } from "@/apis/adminApiSchemas";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


export function EmployeePersonalInfo({isEdit=false, defaultData, setLevel, refetch}:{defaultData?: Employee; isEdit: boolean; setLevel: (level: number) => void; refetch: () => void;}){
    const submitTitle = isEdit ? "Update Profile" : "Next";

    const router = useRouter()
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);


    const form = useForm<z.infer<typeof employeeProfileSchema>>({
        resolver: zodResolver(employeeProfileSchema),
        defaultValues: {
            ...defaultData,
            email: defaultData?.email ?? "",
            ghana_card_number: defaultData?.ghana_card_number ?? "",
            relationship_status: defaultData?.relationship_status ?? "",
        }as any
    });

    const clearFileInput = () => {
        setProfilePicture(null)
        if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0]; 
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
            setProfilePicture(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

    const [emergencyContacts, setEmergencyContacts] = useState(
        defaultData?.emergency_contacts?.length ?
        defaultData?.emergency_contacts :
        [{
            id: Date.now(),
            name: '',
            relationship: '',
            phone_number: '',
        }]
    );
    
    const {mutate, isPending} =  useEmployeeCreate({
        onSuccess: (resp: any) =>{
            toast.success("Employee Added Successfully")
            router.push(`${routeTo.employeeProfilesEdit}/${resp?.id}?level=2`)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const {mutate: updateMutate, isPending: isUpdating} =  useEmployeeUpdate({
        onSuccess: () =>{
            toast.success("Employee Updated Successfully")
            setLevel(2)
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })

    const {mutate: updateShareholderAvatar, isPending: isUpdatingAvatar, isSuccess: isAvatarUpdateSuccessful} = useEmployeeUpdate({
        onSuccess: () => {
            refetch()
            toast.success("Profiled photo updated successfully");
        },
        onError: (errors:any) => {
            toast.error(getErrorMap(errors?.stack));
        },
    })

    const handleUpateAvatar = () => {
        const payload = {profile_picture : profilePicture} as any
        updateShareholderAvatar({
            body: payload,
            pathParams: {
                id: defaultData?.id
            } as any
        })
    }
    
    function onSubmit(values: z.infer<typeof employeeProfileSchema>) {
        if(values?.notification === "sms" && !values?.phone_number){
            return toast.error("Phone number is required to send sms notifications")
        }
        if(values?.notification === "email" && !values?.email){
            return toast.error("Email is required to send email notifications")
        }
        const payload = cleanJsonData({
            ...values,
            emergency_contacts:emergencyContacts
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
            })
        } 
    }

    const addNewContactField = () => {
        const newContact = {
        id: Date.now(),
        name: '',
        relationship: '',
        phone_number: '',
        };
        setEmergencyContacts([...emergencyContacts, newContact]);
    };

    const removeContactField = (id: string) => {
        if (emergencyContacts.length > 1) {
        setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== Number(id)));
        }
    };

    const updateContact = (id: number| undefined, field: string, value: string) => {
        setEmergencyContacts(emergencyContacts.map(contact => 
        contact.id === id ? { ...contact, [field]: value } : contact
        ));
    };
    return(
        <div>
            <div className="flex justify-between items-center py-5">
                <div className="text-lg font-medium ">Personal Information</div>
                <div className="flex gap-5">
                    <Link href={routeTo.employeeProfiles}>
                        <Button variant={"ghost"} className="border"><ArrowLeft className="text-[#16A34A]"/> Back</Button>
                    </Link>
                    {isEdit && 
                        <Button onClick={() =>  setLevel(2)} variant={"ghost"} className="border">Next <ArrowRight className="text-[#16A34A]"/></Button>
                    }
                </div>
            </div>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-12 gap-5">
                            <div className="col-span-9">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gender <div className='text-red-500'>*</div></FormLabel>
                                                <RadioGroup
                                                    className="flex flex-row w-full gap-x-6"
                                                    required
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
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
                                    <FormField
                                        control={form.control}
                                        name="date_of_birth"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date of birth <div className='text-red-500'>*</div></FormLabel>
                                            <FormControl>
                                            <Input placeholder="Enter Last Name" {...field} type="date"/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                </div>
                                 <div className="grid grid-cols-1 gap-5 mt-5">
                                        <FormField
                                        control={form.control}
                                        name="relationship_status"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Relationship Status</FormLabel>
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
                                                <SelectItem value="single">Single</SelectItem>
                                                <SelectItem value="married">Married</SelectItem>
                                                <SelectItem value="widowed">Widowed</SelectItem>
                                            </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />

                                     </div>
                            </div>
                            <div className=" col-span-3">
                                <div className="mt-1 text-sm font-medium text-gray-500 text-center dark:text-white">
                                        Profile Photo
                                    </div>
                                <div className="flex flex-col items-center justify-center">
                                    
                                    <div         
                                        id="FileUpload"
                                        className=" flex-col items-center justify-center relative  block  cursor-pointer appearance-nones rounded-xl border border-dashed border-gray-4 bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary p-1"
                                    >
                                        <div className="z-10 absolute right-0 w-5 h-5 bg-whites dark:bg-dark-3 dark:text-white hover:bg-opacity-0 text-primary font-medium text-sm flex items-center justify-center p-1 rounded-md">
                                            <span><PenSquare className="text-green-600"/></span>

                                        </div>
                                        <div  className="p-1" >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            name="profilePhoto"
                                            id="profilePhoto"
                                            onChange={handleFileChange}
                                            accept="image/png, image/jpg, image/jpeg"
                                            className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                        />
                                        <div className="">
                                        <div className="h-[150px] w-[150px] rounded flex items-center justify-center" >
                                            {profilePicture ? (
                                            <div className="p-3">
                                                
                                                    <Image src={profilePicture} alt="logo"  fill className="object-cover  !w-[100px]s rounded-lg" />
                                            </div>
                                            ):(defaultData?.profile_picture ? 
                                                <div className="p-3"> 
                                                    <Image
                                                        src={defaultData?.profile_picture}
                                                        alt="logo" 
                                                        fill 
                                                        className="object-cover  !w-[100px]s rounded-lg"/>
                                                </div> : 
                                            <div className="flex flex-col items-center justify-center">
                                            <span className="flex h-13.5 w-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                d="M10.4613 2.07827C10.3429 1.94876 10.1755 1.875 10 1.875C9.82453 1.875 9.65714 1.94876 9.53873 2.07827L6.2054 5.7241C5.97248 5.97885 5.99019 6.37419 6.24494 6.6071C6.49969 6.84002 6.89502 6.82232 7.12794 6.56756L9.375 4.10984V13.3333C9.375 13.6785 9.65482 13.9583 10 13.9583C10.3452 13.9583 10.625 13.6785 10.625 13.3333V4.10984L12.8721 6.56756C13.105 6.82232 13.5003 6.84002 13.7551 6.6071C14.0098 6.37419 14.0275 5.97885 13.7946 5.7241L10.4613 2.07827Z"
                                                fill="#23a63e"
                                                />
                                                <path
                                                d="M3.125 12.5C3.125 12.1548 2.84518 11.875 2.5 11.875C2.15482 11.875 1.875 12.1548 1.875 12.5V12.5457C1.87498 13.6854 1.87497 14.604 1.9721 15.3265C2.07295 16.0765 2.2887 16.7081 2.79029 17.2097C3.29189 17.7113 3.92345 17.9271 4.67354 18.0279C5.39602 18.125 6.31462 18.125 7.45428 18.125H12.5457C13.6854 18.125 14.604 18.125 15.3265 18.0279C16.0766 17.9271 16.7081 17.7113 17.2097 17.2097C17.7113 16.7081 17.9271 16.0765 18.0279 15.3265C18.125 14.604 18.125 13.6854 18.125 12.5457V12.5C18.125 12.1548 17.8452 11.875 17.5 11.875C17.1548 11.875 16.875 12.1548 16.875 12.5C16.875 13.6962 16.8737 14.5304 16.789 15.1599C16.7068 15.7714 16.5565 16.0952 16.3258 16.3258C16.0952 16.5565 15.7714 16.7068 15.1599 16.789C14.5304 16.8737 13.6962 16.875 12.5 16.875H7.5C6.30382 16.875 5.46956 16.8737 4.8401 16.789C4.22862 16.7068 3.90481 16.5565 3.67418 16.3258C3.44354 16.0952 3.29317 15.7714 3.21096 15.1599C3.12633 14.5304 3.125 13.6962 3.125 12.5Z"
                                                fill="#23a63e"
                                                />
                                            </svg>
                                            </span>
                                            
                                            <div className="mt-2.5 text-body-sm font-medium">
                                            <span className="text-gray-500 text-xs">Upload Profile Picture</span>
                                            </div>
                                            
                                        </div>)}
                                        
                                        </div>
                                            
                                        </div>
                                        </div>
                                        
                                    </div>
                                    {(profilePicture && !isAvatarUpdateSuccessful) && (
                                            <div className="flex justify-center">
                                            
                                            <span className="flex gap-3 font-medium mt-2">
                                            <button type="button" className="cursor-pointer text-xs font-bold text-red-600 h-5 border-red-600 border rounded px-1 w-[65px]" onClick={clearFileInput}>
                                                Remove
                                            </button>
                                            {isEdit && <>
                                            |
                                            <button type="button" onClick={handleUpateAvatar} className="cursor-pointer text-body-sm text-white font-bold h-5 text-xs bg-green-600 rounded px-1 w-[68px]">
                                                {isUpdatingAvatar ? "Loading...": "Save"}
                                            </button></>}
                                            </span>
                                        </div>
                                    )}    
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-5">
                           
                            <div className="grid grid-cols-2 gap-5">
                                

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
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="ghana_card_number"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ghana Card Number</FormLabel>
                                        <FormControl>
                                        <Input placeholder="GHA-XXXXXXXXX-X" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                               
                                <FormField
                                    control={form.control}
                                    name="notification"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Send Notifications Via <div className='text-red-500'>*</div></FormLabel>
                                            <RadioGroup
                                                className="flex flex-row w-full gap-x-6"
                                                required
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                            {NOTIFICATION_OPTIONS.map((item, idx) =>(
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
                            {emergencyContacts.map((item, idx) => (
                            <div key={`ec-${idx}`} className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
                                {idx > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeContactField(String(item.id))}
                                        className="absolute -top-1 -right-2 p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                    >
                                        <X size={16} className="text-red-500" />
                                    </button>
                                )}
                                
                                <div className="space-y-2">
                                    <Label>Emergency Contact <div className='text-red-500'>*</div></Label>
                                    <Input defaultValue={item?.relationship} placeholder="Enter Contact Relation" onChange={(e) => updateContact(item?.id, 'relationship', e.target.value)} required/>
                                    <FormMessage />
                                </div>
                                 
                                <div className="space-y-2">
                                    <Label>Emergency Contact Name <div className='text-red-500'>*</div></Label>
                                    <Input  defaultValue={item?.name} placeholder="Enter Contact Name" onChange={(e) => updateContact(item?.id, 'name', e.target.value)} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number <div className='text-red-500'>*</div></Label>
                                    <PhoneNumberInput
                                        onChange={(e) => updateContact(item?.id, 'phone_number', e as string)}
                                        maxLength={12}
                                        value={item?.phone_number || ""}
                                        placeholder={"eg. 024 123 4567"}
                                        defaultCountry="GH"
                                        className="phone-input"
                                        international={false}
                                        countryCallingCodeEditable={true}
                                        required
                                    />
                                </div>
                                  
                            </div>
                            ))}
                            
                        </div>
                        <div className="flex justify-center">
                            <Button type="button" onClick={addNewContactField} variant="ghost" className="w-full border border-[#4A8D34]">
                                <PlusCircle className="stroke-[#4A8D34]"/> Add New Emergency Contact
                            </Button>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" variant="default" className="w-[180px] mt-5">
                                <LoadingLabel isLoading={isPending || isUpdating}>
                                    {submitTitle}
                                </LoadingLabel>
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}