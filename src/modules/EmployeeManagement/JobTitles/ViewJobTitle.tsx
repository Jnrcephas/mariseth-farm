"use client"
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import AddJobTitleModal from "./Modals/AddJobTitleModal";
import DeleteJobTitleModal from "./Modals/DeleteJobTitleModal";
import Link from "next/link";
import { boolToYesNo } from "@/lib/helpers";
import AssignedEmployees from "./AssignedEmployees";

export default function ViewJobTitle({defaultData, refetch}:{defaultData: any; refetch: () => void;}){
    const {hasAccess: update_job_title} = useHasAccess("hr|update_job_title")
    const {hasAccess: delete_job_title} = useHasAccess("hr|delete_job_title")

    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    
    return(
        <AuthorizeAndRenderPage permission="hr|view_department">
            <div className="p-5 px-8">
                <Button variant="outline" className="cursor-pointer" onClick={() => window.history.back()}>
                    <ArrowLeft className="text-[#16A34A]"/>Back
                </Button>
                <Card className="w-full  mx-auto px-8 mt-5  border-1 !shadow-none">
                    <CardHeader className="pb-2 border-l-4 border-[#26A996] border-b-0 border-r-0">
                        <CardTitle className="flex justify-between">
                            <div className="font-medium mb-3">
                                <div className="text-2xl">{defaultData?.name}</div>
                                <div className="text-sm mt-2 text-[#475569]">
                                    {defaultData?.job_title_id}
                                </div>
                                <Badge variant="success" className="text-sm">Active</Badge>
                                <div className="space-y-3 text-gray-500 mt-3">
                                    <div className="space-x-2 mt-3 ">
                                        <span className="text-[#4A8D34] text-sm me-1">Department:</span>
                                            {defaultData?.department?.name}
                                    </div>
                                    <div className="space-x-2">
                                        <span className="text-[#4A8D34] text-sm me-1">Level:</span>
                                        {defaultData?.level?.name}
                                    </div>
                                    <div className="space-x-2">
                                        <span className="text-[#4A8D34] text-sm me-1">Job Description:</span>
                                        <Link  className="underline text-blue-600" href={defaultData?.job_description_url ?? "#"}>{defaultData?.job_description_url}</Link>
                                    </div>
                                    <div className="space-x-2">
                                        <span className="text-[#4A8D34] text-sm me-1">Probation:</span>
                                        {boolToYesNo(defaultData?.probation)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                {delete_job_title &&
                                    <Button variant={"ghost"} onClick={() => setDeleteModal(true)} className="border"><Trash2 className="text-red-600"/> Delete</Button>
                                }
                                {update_job_title &&
                                    <Button variant={"default"} onClick={() => setEditModal(true)} ><Edit2 className="text-white"/> Edit</Button>
                                }
                            </div>
                        </CardTitle>
                    </CardHeader>
                </Card>
                
                <div className="mt-10">
                    <div><span className="text-green-600">Employees Assigned:</span> {defaultData?.number_of_employees}</div>
                    <hr className="mb-0"/>
                    <AssignedEmployees job_title={defaultData?.id}/>
                </div>
                {editModal && 
                    <AddJobTitleModal
                        open={editModal} 
                        setOpen={setEditModal}
                        refetch={refetch}
                        defaultData={defaultData}
                        isEdit
                    />
                }
                {deleteModal && 
                    <DeleteJobTitleModal
                        open={deleteModal} 
                        setOpen={setDeleteModal}
                        data={defaultData}
                        refetch={refetch}
                    />
                }
            </div>
        </AuthorizeAndRenderPage>
    )
}