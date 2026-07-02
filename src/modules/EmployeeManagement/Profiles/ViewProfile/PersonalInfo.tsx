import { TextLabel } from "@/components/ui/label";
import { formatDateReadable, formatGender } from "@/lib/helpers";

export default function ViewPersonalInfo({data}:{data: any}){
    return (
        <div className=" ">
            <div className="bg-white rounded-lg border p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <TextLabel title={"First Name"} subTitle={data?.first_name} />
                    <TextLabel title={"Last Name"} subTitle={data?.last_name} />
                    <TextLabel title={"Gender"} subTitle={formatGender(data?.gender)} />
                    <TextLabel title={"Date of Birth"} subTitle={formatDateReadable(data?.date_of_birth)} />
                    <TextLabel title={"Start Date"} subTitle={formatDateReadable(data?.contract?.start_date)} />
                    <TextLabel title={"Job Title"} subTitle={data?.contract?.job_title?.name} />
                    <TextLabel title={"Department"} subTitle={data?.contract?.job_title?.department?.name} />
                    <TextLabel title={"Phone Number"} subTitle={data?.phone_number} />
                    <TextLabel title={"Email"} subTitle={data?.email} />
                    <TextLabel title={"Ghana Card Number"} subTitle={data?.ghana_card_number} />
                    <TextLabel title={"Receive Notifications Via"} subTitle={data?.notification} />
                    {data?.emergency_contacts?.map((item: any, idx: number) =>(
                        <TextLabel key={`c-${idx}`} title={`Emergency Contact ${idx + 1}`} subTitle={
                            <div>{item?.relationship} | {item?.name} | {item?.phone_number}</div>
                        } />
                    ))}
                </div>
            </div>
        </div>
    )
}