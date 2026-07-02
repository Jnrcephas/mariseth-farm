"use client"
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Download, FileImage, Image as ImageIcon, Trash2, UploadCloud} from "lucide-react";
import { useState } from "react";
import { Employee } from "@/apis/adminApiSchemas";

import UploadQualificationsModal from "../Modals/UploadQualificationsModal";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEmployeeRemoveQualification } from "@/apis/adminApiComponents";
import DeleteDocModal from "../Modals/DeleteDocModal";
import { toast } from "sonner";
import { getErrorMap, handleDownload } from "@/lib/helpers";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ViewDocModal from "../Modals/VIewDocModal";


export function EmployeeQualifications({defaultData, setLevel, refetch}:
    {defaultData?: Employee; 
        setLevel: (level: number) => void; 
        refetch: () => void;}){

    const [uploadCertModal, setUploadCertModal] = useState(false)
    const [selectedToDelete, setSelectedToDelete] = useState<number | null>(null)
    const [deleteModal, setDeleteModal] = useState(false)
    const [selected, setSelected] = useState<any>({})
    const [viewModal, setViewModal] = useState(false)

    const {mutate, isPending} = useEmployeeRemoveQualification({
        onSuccess: () => {
            toast.success("Qualification deleted successfully")
            refetch()
            setDeleteModal(false)
        },
        onError: (error: any) => {
            toast.error(getErrorMap(error))
        }
    })

    function handleDeleteDoc(id: number){
        setSelectedToDelete(id)
        setDeleteModal(true)
    }
    function handleView(item: any){
        setSelected(item)
        setViewModal(true)
    }

    function onDelete(){
        mutate({
            pathParams: {
                id: defaultData?.id,
                qualificationId: String(selectedToDelete)
            },
            body: defaultData as any
        } as any)
    }
    
    return(
        <div>
            <div className="flex justify-between items-center py-5">
                <div className="text-lg font-medium ">Documents</div>
                <div className="flex gap-5">
                    <Button onClick={() =>  setLevel(1)} variant={"ghost"} className="border"><ArrowLeft className="text-[#16A34A]"/>Back</Button>
                    <Button onClick={() =>  setLevel(3)} variant={"ghost"} className="border">Next <ArrowRight className="text-[#16A34A]"/></Button>
                </div>
            </div>
            <div>
                <div>
                    {defaultData?.qualifications?.length ? 
                        <div className="flex flex-col gap-5">
                            <Button type="button" onClick={() => setUploadCertModal(true)} variant="ghost" className="w-[200px] border">
                                <UploadCloud className="stroke-[#4A8D34]"/> Upload New Document
                            </Button>
                            <div className="border rounded-lg p-3 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                {defaultData?.qualifications?.map((item, idx) => (
                                    <div key={`q-${idx}`} className="border rounded-lg flex justify-between p-2 ">
                                        <div className="flex items-center gap-2">
                                            <Image src="/images/pdf.svg" width={20} height={20} alt="pdf"/>
                                            <div className="text-sm">{item?.title}</div>
                                        </div>
                                        <div className="flex justify-between items-center gap-2 ">
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <ImageIcon className="stroke-green-600 cursor-pointer w-5" onClick={() => handleView(item)}/>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>View Document</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <div className="text-gray-200">|</div>
                                            <Tooltip>
                                                <TooltipTrigger><Download className="stroke-blue-500 cursor-pointer" size={15} onClick={() => handleDownload(item?.certificate || "", item?.description)}/></TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Download Document</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <div className="text-gray-200">|</div>  
                                             <Tooltip>
                                                <TooltipTrigger><Trash2 className="stroke-red-500 cursor-pointer" size={15} onClick={() => handleDeleteDoc(item.id!)}/></TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete Document</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>:
                        <Card className="h-full w-full border-2 border-dashed transition-colors cursor-pointer" onClick={() => setUploadCertModal(true)}>
                            <CardContent className=" p-2 flex flex-col justify-center">
                                <div className="w-10 h-10 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                                    <FileImage className="w-5 h-5 text-green-800" />
                                </div>
                                <div className="flex flex-col justify-center items-center">
                                    <p className="text-sm font-medium mb-2 ">Choose file to upload</p>
                                    <p className="text-xs text-gray-500">Supported formats: PNG, JPEG, PDF (5MB max file size)</p>
                                    <Button variant={"default"} className="w-[100px] mt-5">Select File</Button>
                                </div>
                            </CardContent>
                        </Card>
                    }
                </div>
                <div className="flex justify-end">
                    <Button type="submit" variant="default" className="w-[80px] mt-5" onClick={() => setLevel(3)}>
                            Next
                    </Button>
                </div>
                {uploadCertModal &&
                    <UploadQualificationsModal open={uploadCertModal} setOpen={setUploadCertModal} data={defaultData} refetch={refetch}/>
                }
                {deleteModal &&
                    <DeleteDocModal open={deleteModal}  setOpen={setDeleteModal} onDelete={onDelete} isLoading={isPending}/>
                }
                {viewModal &&
                    <ViewDocModal open={viewModal} setOpen={setViewModal} data={selected}/>
                }
            </div>
        </div>
    )
}