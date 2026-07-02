import { useFarmManagementFarmDelete } from "@/apis/adminApiComponents";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { LoadingLabel } from "@/components/ui/label";
import { getErrorMap } from "@/lib/helpers";
import { XCircle } from "lucide-react"
import { toast } from "sonner";

export default function DeleteFarmModal({
    open, 
    setOpen, 
    data,
    refetch
    }:{
        open: boolean;
        setOpen: (open: boolean) => void;
        data: any;
        refetch: () => void;
    }){
    const {mutate, isPending} = useFarmManagementFarmDelete({
        onSuccess: () =>{
            if(refetch) refetch()
            setOpen(false)
            toast.success("Farm Deleted Successfully")
        },
        onError: (errors: any) =>{
            toast.error(getErrorMap(errors));
        }
    })
    const handleDelete = () => {
        mutate({
            pathParams: {
                id: data?.id
            }
        })
    }
    return(
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[650px] p-0 text-[#334155] !rounded-b-lg">
                <DialogTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">Delete this farm?</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
                <div className="mt-1 p-5 text-center">
                    Deleting this farm will remove it from the system permanently. <br/>Do you want to proceed?
                </div>
                <DialogFooter className="flex !justify-between p-5 bg-[#F8FAFC]">
                    <Button type="button" variant={"outline"} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} type="button" variant={"destructive"}>
                        <LoadingLabel isLoading={isPending}>
                             Yes, Delete
                        </LoadingLabel>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}