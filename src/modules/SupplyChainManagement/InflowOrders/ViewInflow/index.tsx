"use client"
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, FileText, Verified } from "lucide-react";
import Link from "next/link";
import { routeTo } from "@/lib/constants";
import { formatDateReadable, formatText } from "@/lib/helpers";
import InflowDetails from "./InflowDetails";
import { useState } from "react";
import ApproveInspectionModal from "../Modals/ApproveInspectionModal";
import ApproveInspectionCommentModal from "../Modals/ApproveInspectionCommentModal";
import ApproveInflowModal from "../Modals/ApproveInflowModal";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";

export default function ViewInflowDetails({defaultData, refetch, approvals=false}:{defaultData: any; refetch: () => void; approvals?: boolean}){
    const stage = defaultData?.status
    const [inspectionApprovalModal, setInspectionApprovalModal] = useState(false)
    const [approvalCommentModal, setApprovalCommentModal] = useState(false)
    const [approvalModal, setApprovalModal] = useState(false)

    const {hasAccess: approve_inflow_delivery_inspection} = useHasAccess("inflow_orders|approve_inflow_delivery_inspection")
    const {hasAccess: approve_inflow_order} = useHasAccess("inflow_orders|approve_inflow_order")

    function getStageClass1(){
        switch (stage) {
            case "order_approval":
                return "bg-[#4A8D34] text-white"
            case "approved":
                return "bg-[#4A8D34] text-white"
            default:
                return "bg-[#F4F5F7] text-[#4A8D34]"
        }
    }
    function getStageClass2(){
        switch (stage) {
            case "delivery_inspection":
                return "bg-white text-gray-500 border-[#C4C4C4]"
            case "order_approval":
                return "bg-[#F4F5F7] text-[#4A8D34] border-[#4A8D34]"
            case "approved":
                return "bg-[#4A8D34] text-white"
            default:
                return "bg-white text-gray-500"
        }
    }
    function getBorderClass2(){
        switch (stage) {
            case "delivery_inspection":
                return "border-r-[#C4C4C4] border-t-[#C4C4C4]"
            case "order_approval":
                return "border-r-[#4A8D34] border-t-[#4A8D34]"
            case "approved":
                return "border-r-[#4A8D34] border-t-[#4A8D34]"
            default:
                return "border-r-[#C4C4C4] border-t-[#C4C4C4]"
        }
    }
    const tab1Classes = getStageClass1()
    const tab2Classes = getStageClass2()
    const borderClasses = getBorderClass2()

    return(
        <AuthorizeAndRenderPage permission={"inflow_orders|view_inflow_order"}>
            <div className="p-5 px-8 bg-white rounded-lg">
                <Link href={approvals ? routeTo.inflowApprovals : routeTo.inflowOrders}>
                    <Button variant="outline" className="cursor-pointer">
                        <ArrowLeft className="text-[#16A34A]"/>Back
                    </Button>
                </Link>
                <Card className="w-full  mx-auto px-8 mt-5  border-1 !shadow-none">
                    <CardHeader className="pb-2 border-l-4 border-[#26A996] border-b-0 border-r-0">
                        <CardTitle className=" font-medium mb-3 text-2xl flex justify-between">
                            <div>
                                <div className="text-xl">{defaultData?.order_id}</div>
                                <div className="text-sm text-thin text-[#475569] mb-1">{formatDateReadable(defaultData?.order_creation_date)}</div>
                                
                                <Badge variant={statusBadgeMap[defaultData?.status]} className="text-sm capitalize">{formatText(defaultData?.status)}</Badge>
                            </div>
                            {(stage === "delivery_inspection" && approve_inflow_delivery_inspection) &&
                                <div className="space-x-5">
                                    <Button variant={"ghost"} className="border text-[#0F172A]" onClick={() => setApprovalCommentModal(true)}>
                                        <FileText className="text-[#4A8D34]"/> Approve with Comments
                                    </Button>
                                    <Button variant={"default"} className="bg-[#4A8D34] border text-white font-semibold" onClick={() => setInspectionApprovalModal(true)}>
                                        <Verified className="text-white"/> Approve without Comments
                                    </Button>
                                </div>
                            }
                            {(stage === "order_approval" && approve_inflow_order) &&
                                <div className="space-x-5">
                                    <Button variant={"default"} className="bg-[#4A8D34] border text-white font-semibold" onClick={() => setApprovalModal(true)}>
                                        <Verified className="text-white"/> Approve
                                    </Button>
                                </div>
                            }
                            
                        </CardTitle>
                    </CardHeader>
                </Card>
                {/* <div className="grid grid-cols-2 items-center gap- mt-5">
                    <NavArrowStart size="full">
                        YHh
                    </NavArrowStart>
                    <NavArrowEnd />
                </div> */}
                
                <div className="flex items-center gap-0 mt-5">
                    
                    <div className="flex w-full relative items-center" >
                        <div className={`${tab1Classes} h-13 px-6 py-3  font-medium rounded-l-lg border-1 border-[#4A8D34] w-full border-r-0`}>
                            Delivery Inspection
                        </div>
                        <div className={`${tab1Classes} flex items-center rounded z-10  rotate-45 -ml-5 right-0 h-[39px] w-[39px] border-l-0 border-b-0 border-r-[#4A8D34] border-t-[#4A8D34] border-1`}>
                            {stage !== "delivery_inspection" && <Check size={18} className="mt-4 mr-5 -rotate-45 bg-white text-[#4A8D34] rounded-full"/>}
                        </div>
                    </div>
                    <div className="flex w-full relative items-center -ml-5 ">
                        <div className={`${borderClasses} rounded bg-white rotate-45  right-0 h-[38px] w-[38px] border-l-0 border-b-0  border-1`}>

                        </div>
                        <div className={`${tab2Classes} w-full -ml-5 px-15 py-3 font-medium rounded-r-lg border-l-0 border-1 `}>
                            Order Approval
                        </div>
                        {stage === "approved" && <Check size={18} className="absolute right-0 mr-7 bg-white text-[#4A8D34] rounded-full"/>}
                    </div>
                </div>
                <InflowDetails defaultData={defaultData} />
                {inspectionApprovalModal &&
                    <ApproveInspectionModal 
                        open={inspectionApprovalModal} 
                        setOpen={setInspectionApprovalModal} 
                        data={defaultData} 
                        refetch={refetch}
                    />
                }
                {approvalCommentModal &&
                    <ApproveInspectionCommentModal
                        open={approvalCommentModal} 
                        setOpen={setApprovalCommentModal} 
                        data={defaultData} 
                        refetch={refetch}
                    />
                }
                {approvalModal &&
                    <ApproveInflowModal 
                        open={approvalModal} 
                        setOpen={setApprovalModal} 
                        data={defaultData} 
                        refetch={refetch}
                    />
                }
            </div>
        </AuthorizeAndRenderPage>
    )
}