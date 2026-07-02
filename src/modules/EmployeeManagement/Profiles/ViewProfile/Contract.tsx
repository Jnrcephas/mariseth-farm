import { TextLabel } from "@/components/ui/label";
import { boolToYesNo, formatDateReadable } from "@/lib/helpers";

export default function ViewContract({data}:{data: any}){
    return (
        <div className="">
            <div className="bg-white rounded-lg border p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <TextLabel title={"Employment Start Date"} subTitle={formatDateReadable(data?.contract?.start_date)} />
                    <TextLabel title={"Job Title"} subTitle={data?.contract?.job_title?.name} />
                    <TextLabel title={"Department"} subTitle={data?.contract?.job_title?.department?.name} />
                    <TextLabel title={"Employment Type"} subTitle={data?.contract?.employment_type?.replaceAll("_", " ")} />
                    <TextLabel title={"Work Type"} subTitle={data?.contract?.work_type?.replaceAll("_", " ")} />
                    <TextLabel title={"SSNIT Number"} subTitle={data?.contract?.ssnit_number} />
                    <TextLabel title={"Bank Name"} subTitle={data?.contract?.bank_name} />
                    <TextLabel title={"Bank Branch"} subTitle={data?.contract?.bank_branch} />
                    <TextLabel title={"Bank Account Number"} subTitle={data?.contract?.bank_account_number} />
                    <TextLabel title={"Annual Leave Days"} subTitle={data?.contract?.annual_leave_days} />
                    <TextLabel title={"Sick Leave Days"} subTitle={data?.contract?.sick_leave_days || 0} />
                    <TextLabel title={"Does Leave Rollover"} subTitle={boolToYesNo(data?.contract?.leave_rollover)} />
                </div>
            </div>
        </div>
    )
}