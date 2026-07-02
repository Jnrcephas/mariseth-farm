"use client"
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import AddNewDepartmentModal from "./Modals/AddNewDepartmentModal";
import { useState } from "react";
import DeleteDepartmentModal from "./Modals/DeleteDepartmentModal";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import AssignedEmployees from "./AssignedEmployees";

export default function ViewDepartment({defaultData, refetch}:{defaultData: any; refetch: () => void;}){
    const {hasAccess: update_department} = useHasAccess("hr|update_department")
    const {hasAccess: delete_department} = useHasAccess("hr|delete_department")

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
                            <div className="font-medium mb-3 text-2xl">
                                {defaultData?.name}
                                <div className="text-sm mt-2 text-[#475569]">
                                    {defaultData?.department_id}
                                </div>
                                <Badge variant="success" className="text-sm">Active</Badge>
                            </div>
                            <div className="flex gap-5">
                                {delete_department &&
                                    <Button variant={"ghost"} onClick={() => setDeleteModal(true)} className="border"><Trash2 className="text-red-600"/> Delete</Button>
                                }
                                {update_department &&
                                    <Button variant={"default"} onClick={() => setEditModal(true)} ><Edit2 className="text-white"/> Edit</Button>
                                }
                            </div>
                        </CardTitle>
                    </CardHeader>
                </Card>
                
                <div className="mt-10">
                    <div><span className="text-green-600">Employees Assigned:</span> {defaultData?.number_of_employees}</div>
                    <hr className="mb-5"/>
                   <AssignedEmployees departmentId={defaultData?.id}/>
                </div>
                {editModal && 
                    <AddNewDepartmentModal
                        open={editModal} 
                        setOpen={setEditModal}
                        refetch={refetch}
                        defaultData={defaultData}
                        isEdit
                    />
                }
                {deleteModal && 
                    <DeleteDepartmentModal
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