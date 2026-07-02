import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { XCircle } from "lucide-react"

export default function DeactivateProductModal({
    open, 
    setOpen, 
    data}:{
        open: boolean, 
        setOpen: (open: boolean) => void, 
        data: any
    }) {
    const handleDelete = () => {
        console.log("Deleting farm with ID:", data.farm_id);
        setOpen(false);
    }
    return(
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[650px] p-0 text-[#334155] !rounded-b-lg">
                <DialogTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">Delete this Product?</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
                <div className="mt-1 p-5 text-center">
                    Deactivating this product will disable it. <br/>Do you want to proceed?
                </div>
                <DialogFooter className="flex !justify-between p-5 bg-[#F8FAFC]">
                    <Button type="button" onClick={() => setOpen(false)} variant={"outline"}>Cancel</Button>
                    <Button onClick={handleDelete} type="button" variant={"destructive"}>Yes, Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}