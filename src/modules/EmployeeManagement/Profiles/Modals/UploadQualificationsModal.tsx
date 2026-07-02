"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { LoadingLabel } from "@/components/ui/label";
import { XCircle } from "lucide-react"
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { qualificationSchema } from "../../utils/validations";
import  { UploadedImage } from "@/components/UploadImagesCard";
import { useUploadQualificationDocs } from "../../utils/hooks";
import UploadDocsCard from "@/components/UploadDocsCard";

export default function UploadQualificationsModal({
    open, 
    setOpen, 
    data,
    refetch}:{
        open: boolean, 
        setOpen: (open: boolean) => void, 
        data: any;
        refetch: () => void
    }){

    const form = useForm<z.infer<typeof qualificationSchema>>({
        resolver: zodResolver(qualificationSchema),
        defaultValues: {}
    });
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])

    function onSuccess(){
        refetch()
        setOpen(false)
    }

    const {mutate, isPending} = useUploadQualificationDocs(onSuccess)

    function onSubmit(values: z.infer<typeof qualificationSchema>) {
        if(!uploadedImages?.length){
            return toast.error("Please select a document to upload")
        }
        const certificate = uploadedImages?.map((item) => item?.file)?.[0]

        const formData = new FormData();
        formData.append('id', data.id);
        formData.append('title', values.title);
        formData.append('description', values.title);
        formData.append('certificate', certificate);
        mutate(formData)
    }
    return(
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[750px] p-0 text-[#334155] !rounded-b-lg">
                <DialogTitle className="mt-2 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">Qualification Details</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
                <div className="mt-1 p-5 text-center">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        
                        <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type Qualification (course or degree) <div className='text-red-500'>*</div></FormLabel>
                                        <FormControl>
                                        <Input placeholder="Enter course or degree" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <UploadDocsCard 
                                    uploadedImages={uploadedImages} 
                                    setUploadedImages={setUploadedImages}
                                />
                            </div>
                        </div>
                    </form>
                </Form>
                </div>
                <DialogFooter className="flex !justify-between p-5 bg-[#F8FAFC] rounded-lg">
                    <Button onClick={() => setOpen(false)} type="button" variant={"outline"}>Cancel</Button>
                    <Button  type="button" variant={"default"} onClick={() => {
                        form.handleSubmit(onSubmit)();
                      }}>
                        <LoadingLabel isLoading={isPending}>
                            Upload
                        </LoadingLabel>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}