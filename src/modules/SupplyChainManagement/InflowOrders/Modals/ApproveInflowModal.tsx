import { useInflowApproveOrder } from "@/apis/adminApiComponents";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { LoadingLabel } from "@/components/ui/label";
import { getErrorMap } from "@/lib/helpers";
import { XCircle } from "lucide-react"
import { toast } from "sonner";

export default function ApproveInflowModal({
    open, 
    setOpen, 
    data,
    refetch}:{
        open: boolean, 
        setOpen: (open: boolean) => void, 
        data: any
        refetch: () => void
    }){

    const {mutate, isPending} = useInflowApproveOrder({
        onSuccess: () =>{
            refetch()
            setOpen(false)
            toast.success("Approved Successfully")
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })
    const handleApprove = () => {
        mutate({
            pathParams: { id: data?.id },
            // body: data
        }as any)
    }
    return(
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[500px] p-0 text-[#334155] !rounded-b-lg">
                <DialogTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">Approve Inbound Order?</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
                <div className="mt-1 p-5 text-center">
                    Are you sure you want to approve Inbound Order ?
                </div>
                <DialogFooter className="flex !justify-between p-5 bg-[#F8FAFC]">
                    <Button onClick={() => setOpen(false)} type="button" variant={"outline"}>Cancel</Button>
                    <Button onClick={handleApprove} type="button" variant={"default"}>
                        <LoadingLabel isLoading={isPending}>
                            Yes, Approve
                        </LoadingLabel>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}