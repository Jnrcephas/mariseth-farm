import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { TextLabel } from "@/components/ui/label"
import { boolToYesNo, formatDateReadable, formatGender } from "@/lib/helpers"
import { IFarmer } from "../../utils/types"
import { formatPhoneNumberStartWithZero } from "@/modules/UserManagement/utils/helpers"



export default function LeadFarmerPersonalInfo({defaultData}:{defaultData: IFarmer}){
    const leadership_experience = defaultData?.leadership_experience
    return(
        <div className="space-y-5">
            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="border px-5 rounded-t-lg text-[#4A8D34] text">Personal Information</AccordionTrigger>
                    <AccordionContent className="border p-5 border-t-0 rounded-b-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <TextLabel title={"Farmer Type"} subTitle={"Lead Farmer"} variant="dark"/>
                            <TextLabel title={"Full Name"} subTitle={`${defaultData?.first_name} ${defaultData?.last_name}`} variant="dark"/>
                            <TextLabel title={"Gender"} subTitle={formatGender(defaultData?.gender)} variant="dark"/>
                            <TextLabel title={"Date of Birth"} subTitle={formatDateReadable(defaultData?.date_of_birth)} variant="dark"/>
                            <TextLabel title={"National ID/Passport Number"} subTitle={defaultData?.id_number} variant="dark"/>
                            <TextLabel title={"Contact"} subTitle={formatPhoneNumberStartWithZero(defaultData?.phone_number || "")} variant="dark"/>
                            <TextLabel title={"Email"} subTitle={defaultData?.email} variant="dark"/>
                            <TextLabel title={"Address"} subTitle={defaultData?.address} variant="dark"/>
                            <TextLabel title={"Village/Community"} subTitle={defaultData?.village} variant="dark"/>
                            <TextLabel title={"Region"} subTitle={defaultData?.region?.name} variant="dark"/>
                            <TextLabel title={"District"} subTitle={defaultData?.district?.name} variant="dark"/>
                            <TextLabel title={"Country"} subTitle={defaultData?.country} variant="dark"/>

                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-2">
                    <AccordionTrigger className="border px-5 rounded-t-lg text-[#4A8D34]">Leadership & Experience</AccordionTrigger>
                    <AccordionContent className="border p-5 border-t-0 rounded-b-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <TextLabel title={"Farming Type"} subTitle={leadership_experience?.farming_type} variant="dark"/>
                            <TextLabel title={"Are you currently mentoring other farmers"} subTitle={boolToYesNo(leadership_experience?.is_mentoring_other_farmers)} variant="dark"/>
                            <TextLabel title={"If Yes, how many farmers are you mentoring"} subTitle={leadership_experience?.number_of_farmers_mentoring || "0"} variant="dark"/>
                            <TextLabel title={"Membership in Farming Cooperatives/Associations"} subTitle={boolToYesNo(leadership_experience?.has_farming_membership)} variant="dark"/>
                            <TextLabel title={"If Other, Please Specify Here"} subTitle={leadership_experience?.farm_association} variant="dark"/>
                            <TextLabel title={"Have you received any leadership or agricultural training?"} subTitle={boolToYesNo(leadership_experience?.has_received_farming_leadership_training)} variant="dark"/>
                            <TextLabel title={"If Other, Please Specify Here"} subTitle={leadership_experience?.farming_leadership_training} variant="dark"/>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}