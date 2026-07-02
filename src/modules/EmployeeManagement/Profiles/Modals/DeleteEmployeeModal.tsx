import { useEmployeeDelete } from "@/apis/adminApiComponents";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { LoadingLabel } from "@/components/ui/label";
import { getErrorMap } from "@/lib/helpers";
import { XCircle } from "lucide-react"
import { toast } from "sonner";

export default function DeleteEmployeeModal({
    open, 
    setOpen, 
    data,
    refetch}:{
        open: boolean, 
        setOpen: (open: boolean) => void, 
        data: any;
        refetch: () => void;
    }) {
    const {mutate, isPending} = useEmployeeDelete({
        onSuccess: () =>{
            refetch()
            setOpen(false)
            toast.success("Employee Deleted Successfully")
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
            <DialogContent className="sm:max-w-[550px] p-0 text-[#334155] !rounded-b-lg">
                <DialogTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">Are you sure you want to delete this employee&apos;s profile?</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
                <div className="mt-1 p-5 text-center">
                    Delete this employee will delete his or her information. <br/>
                    This action is irreversible. Do you want to proceed?
                    ?
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