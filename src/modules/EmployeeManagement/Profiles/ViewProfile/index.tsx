"use client"
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import DeleteEmployeeModal from "../Modals/DeleteEmployeeModal";
import { useRouter } from "next/navigation";
import { routeTo } from "@/lib/constants";
import DeactivateEmployeeModal from "../Modals/DeactivateEmployeeModal";
import DisciplinaryModal from "../Modals/DisciplinaryModal";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ViewPersonalInfo from "./PersonalInfo";
import ViewQualifications from "./Qualifications";
import ViewContract from "./Contract";
import ViewDisciplinaryActions from "./DisciplinaryActions";
import ViewTraining from "./Traning";
import Image from "next/image";

export default function ViewEmployeeProfile({defaultData, refetch}:{defaultData: any; refetch: () => void;}){

    const router = useRouter()
    const {hasAccess: update_employee} = useHasAccess("employee|update_employee")
    const {hasAccess: delete_employee} = useHasAccess("employee|delete_employee")
    const {hasAccess: add_employee_disciplinary_action} = useHasAccess("employee|add_employee_disciplinary_action")

    const [deleteModal, setDeleteModal] = useState(false)
    const [disciplinaryModal, setDisciplinaryModal] = useState(false)
    const [deactivateModal, setDeactivateModal] = useState(false)
    
    return(
        <AuthorizeAndRenderPage permission="employee|view_employee">
            <div className="mt-5">
                <Button variant="outline" className="cursor-pointer" onClick={() => window.history.back()}>
                    <ArrowLeft className="text-[#16A34A]"/>Back
                </Button>
                <Card className="w-full  mx-auto px-8 mt-5  border-1 !shadow-none">
                    <CardHeader className="pb-2 border-l-4 border-[#26A996] border-b-0 border-r-0">
                        <CardTitle className="flex justify-between !mb-0">
                            <div className="font-medium mb-0 text-2xl">
                                {defaultData?.first_name} {defaultData?.last_name}
                                <div className="text-sm mt-2 text-[#475569]">
                                    {defaultData?.employee_id}
                                </div>
                                <Badge variant={statusBadgeMap[defaultData?.status]} className="text-sm">{defaultData?.status}</Badge>
                                
                            </div>
                            
                            <div className="flex gap-5">
                                {add_employee_disciplinary_action &&
                                    <Button variant={"ghost"} onClick={() => setDisciplinaryModal(true)} className="border">Disciplinary Actions</Button>
                                }
                                {update_employee &&
                                    <Button variant={"ghost"} onClick={() => setDeactivateModal(true)} className="border">Deactivate Account</Button>
                                }

                                {delete_employee &&
                                    <Button variant={"ghost"} onClick={() => setDeleteModal(true)} className="border"><Trash2 className="text-red-600"/> Delete</Button>
                                }
                                
                                {update_employee &&
                                    <Button variant={"default"} onClick={() => router.push(`${routeTo.employeeProfilesEdit}/${defaultData?.id}`)} ><Edit2 className="text-white"/> Edit</Button>
                                }
                            </div>
                        </CardTitle>
                        <div className="flex justify-between">
                                    <div className="space-y-3 text-gray-500 text-sm">
                                        <div className="space-x-2 mt-3 ">
                                            <span className="text-[#4A8D34] text-sm me-1">Phone Number:</span>
                                                {defaultData?.phone_number}
                                        </div>
                                        <div className="space-x-2">
                                            <span className="text-[#4A8D34] text-sm me-1">Email:</span>
                                            {defaultData?.email || "-"}
                                        </div>
                                        <div className="space-x-2">
                                            <span className="text-[#4A8D34] text-sm me-1">Job Title:</span>
                                            {defaultData?.contract?.job_title?.name || "-"}
                                        </div>
                                        {/* <div className="space-x-2">
                                            <span className="text-[#4A8D34] text-sm me-1">Probation:</span>
                                            {boolToYesNo(defaultData?.probation)}
                                        </div> */}
                                    </div>
                                    <div>
                                        {defaultData?.profile_picture ? 
                                        <Image
                                            src={defaultData?.profile_picture || "/default-profile.png"} 
                                            alt="Profile Photo"
                                            width={80}
                                            height={80}
                                            className="w-[120px] h-[120px] rounded object-cover"
                                            title={`${defaultData?.first_name} ${defaultData?.last_name}`}
                                        />:
                                        <div className="w-[120px] h-[120px] rounded bg-green-50 flex items-center justify-center"/>
                                        }
                                    </div>
                                    
                                </div>
                    </CardHeader>
                </Card>
                
                <Tabs defaultValue="1" className="w-full mx-auto mt-10">
                    <TabsList className="grid grid-cols-1 md:grid-cols-5 mx-auto p- h-[36px] bg-[#F1F5F9] border ">
                        <TabsTrigger className="h-[28px] cursor-pointer" value="1">Personal Information</TabsTrigger>
                        <TabsTrigger className="h-[28px] cursor-pointer" value="2">Documents</TabsTrigger>
                        <TabsTrigger className="h-[28px] cursor-pointer" value="3">Contract</TabsTrigger>
                        <TabsTrigger className="h-[28px] cursor-pointer" value="4">Training</TabsTrigger>
                        <TabsTrigger className="h-[28px] cursor-pointer" value="5">Disciplinary  Actions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="1" >
                        <ViewPersonalInfo data={defaultData}/>
                    </TabsContent>
                    <TabsContent value="2" >
                        <ViewQualifications data={defaultData}/>
                    </TabsContent>
                    <TabsContent value="3" >
                       <ViewContract data={defaultData}/>
                    </TabsContent>
                    <TabsContent value="4" >
                        <ViewTraining employeeId={defaultData?.id}/>
                    </TabsContent>
                    <TabsContent value="5" >
                        <AuthorizeAndRenderPage permission="employee|list_employee_disciplinary_actions">
                            <ViewDisciplinaryActions employeeId={defaultData?.id}/>
                        </AuthorizeAndRenderPage>
                    </TabsContent>
                </Tabs>
                
                {deleteModal && 
                    <DeleteEmployeeModal
                        open={deleteModal} 
                        setOpen={setDeleteModal}
                        data={defaultData}
                        refetch={refetch}
                    />
                }
                {deactivateModal &&
                    <DeactivateEmployeeModal
                        open={deactivateModal} 
                        setOpen={setDeactivateModal}
                        data={defaultData}
                        refetch={refetch}
                    />
                }
                {disciplinaryModal &&
                    <DisciplinaryModal
                        open={disciplinaryModal} 
                        setOpen={setDisciplinaryModal}
                        data={defaultData}
                        refetch={refetch}
                    />
                }
            </div>
        </AuthorizeAndRenderPage>
    )
}