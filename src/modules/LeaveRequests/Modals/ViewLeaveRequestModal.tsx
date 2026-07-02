import { useLeaveApproveDecline } from "@/apis/adminApiComponents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { LoadingLabel, TextLabel } from "@/components/ui/label";
import { capitalize, formatDateReadable, getErrorMap } from "@/lib/helpers";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import { XCircle } from "lucide-react"
import { toast } from "sonner";

export default function ViewLeaveRequestModal({
    open, 
    setOpen, 
    data,
    refetch,
    handleDenyModal}:{
        open: boolean, 
        setOpen: (open: boolean) => void, 
        data: any;
        refetch: () => void;
        handleDenyModal: (data: any) => void;
    }) {
    const {mutate, isPending} = useLeaveApproveDecline({
        onSuccess: () =>{
            refetch()
            setOpen(false)
            toast.success("Request Approved Successfully")
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })
    const handleApprove = () => {
        const payload = {
            action: "approve"
        } as any
        mutate({
            pathParams: {
                id: data?.id
            },
            body: payload
        })
    }
     const handleDeny = () => {
        handleDenyModal(data)
    }
    return(
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[500px] p-0 text-[#334155] !rounded-b-lg">
                <DialogTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">View Leave - <span className="text-green-600">{data?.leave_id}</span></div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
                <div className="mt-1 px-5 text-center pb-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <TextLabel title={"Employee"} subTitle={`${data?.employee?.first_name} ${data?.employee?.last_name}`} />
                        <TextLabel title={"Leave Type"} subTitle={`${data?.leave_type?.name}`} />
                        <TextLabel title={"From"} subTitle={data?.start_date} />
                        <TextLabel title={"To"} subTitle={data?.end_date} />
                        <TextLabel title={"Annual Leave Remaining"} subTitle={data?.annual_leave_remaining} />
                        <TextLabel title={"Department"} subTitle={data?.employee?.department} />
                        <TextLabel title={"Reason"} subTitle={data?.reason} />
                        <TextLabel title={"Status"} subTitle={<Badge className="capitalize" variant={statusBadgeMap[data?.status]}>{data?.status}</Badge>} />
                    </div>
                    {data?.status === "declined" && 
                    <div className="grid grid-cols-1 mt-5">
                        <TextLabel title={"Denied Reason"} subTitle={data?.rejection_reason} />
                    </div>}
                    {["approved", "declined"].includes(data?.status) &&
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                            <TextLabel title={`${capitalize(data?.status)} By`} subTitle={`${data?.action_taken_by?.first_name} ${data?.action_taken_by?.last_name}`} />
                            <TextLabel title={"On"} subTitle={`${formatDateReadable(data?.action_taken_on)}`} />
                        </div>
                    }
                </div>
               
                {data?.status !== "approved" &&
                    <DialogFooter className="flex justify-between p-5 bg-[#F8FAFC]">
                        {data?.status !== "declined" && 
                            <Button type="button" className="w-1/2" variant={"destructive"} onClick={handleDeny}>Deny</Button>
                        }
                        <Button onClick={handleApprove} className="w-1/2" type="button" variant={"default"}>
                            <LoadingLabel isLoading={isPending}>
                                Approve
                            </LoadingLabel>
                        </Button>
                    </DialogFooter>
                }
            </DialogContent>
        </Dialog>
    )
}