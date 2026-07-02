import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { LoadingLabel } from "@/components/ui/label";
import { XCircle } from "lucide-react"

export default function DeleteDocModal({
    open, 
    setOpen, 
    onDelete,
    isLoading
    }:{
        open: boolean, 
        setOpen: (open: boolean) => void, 
        onDelete: () => void;
        isLoading: boolean
    }) {
   
    return(
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[500px] p-0 text-[#334155] !rounded-b-lg">
                <DialogTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">Delete Qualification?</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
                <div className="mt-1 p-5 text-center">
                    Are you sure you want to delete qualification ?
                </div>
                <DialogFooter className="flex !justify-between p-5 bg-[#F8FAFC]">
                    <Button type="button" variant={"outline"} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={onDelete} type="button" variant={"destructive"}>
                        <LoadingLabel isLoading={isLoading}>
                            Yes, Delete
                        </LoadingLabel>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}