"use client"
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Verified } from "lucide-react";
import Link from "next/link";
import { routeTo } from "@/lib/constants";
import { formatDateReadable, formatText } from "@/lib/helpers";
import { useState } from "react";
import ApproveInspectionModal from "../Modals/ApproveInspectionModal";
import ApproveInspectionCommentModal from "../Modals/ApproveInspectionCommentModal";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import OutflowDetails from "./OutflowDetails";
import ApproveOutflowModal from "../Modals/ApproveOutflowModal";
import { ORDER_STATUS_MAP_APPROVAL } from "@/modules/SupplyChainManagement/utils/constants";
import DropdownButton from "@/components/customs/ButtonDropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import PickupCompleteModal from "../Modals/PickupCompleteModal";

export default function ViewApprovalOutflowDetails({defaultData, refetch, approvals=false}:{defaultData: any; refetch: () => void; approvals?: boolean}){
    const stage: keyof typeof ORDER_STATUS_MAP_APPROVAL = defaultData?.status || "availability_check"
    const [inspectionApprovalModal, setInspectionApprovalModal] = useState(false)
    const [approvalCommentModal, setApprovalCommentModal] = useState(false)
    const [approvalModal, setApprovalModal] = useState(false)
    const [approvePickupModal, setApprovePickupModal] = useState(false)
    const [verifyBtn, setVerifyBtn] = useState(false)

    const {hasAccess: verify_outflow_availability} = useHasAccess("outflow_approvals|verify_outflow_availability")
    const {hasAccess: mark_outflow_order_picked} = useHasAccess("outflow_approvals|mark_outflow_order_picked")

    const _stage = ORDER_STATUS_MAP_APPROVAL[stage] || "availability_check"
    const _stageClassName = {
        availability_check: {
            stage_1: {
                bg: "bg-[#F4F5F7] text-[#4A8D34] border-[#4A8D34]"
            },
            stage_2: {
                bg: "bg-white text-gray-500 border-[#C4C4C4]"               
            }
        },
        order_pickup: {
            stage_1: {
                bg: "bg-[#4A8D34] text-white"
            },
            stage_2: {
                bg: "bg-[#F4F5F7] text-[#4A8D34] border-[#4A8D34]"               
            },
        },
        order_picked_up: {
            stage_1: {
                bg: "bg-[#4A8D34] text-white"
            },
            stage_2: {
                bg: "bg-[#4A8D34] text-white"
            }
        }
    }
    const stageClassName = _stageClassName[_stage as keyof typeof _stageClassName] as any

    function handleVerifyStock(){
        setVerifyBtn(false)
        setInspectionApprovalModal(true)
    }
    function handleVerifyStockWithComment(){
        setVerifyBtn(false)
        setApprovalCommentModal(true)
    }

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
                                <div className="text-sm text-thin text-[#475569] mb-1">{formatDateReadable(defaultData?.expected_delivery_date)}</div>
                                
                                <Badge variant={statusBadgeMap[_stage]} className="text-sm capitalize">{formatText(_stage)}</Badge>
                            </div>
                            {(_stage === "availability_check" && verify_outflow_availability) &&
                            <DropdownButton 
                                open={verifyBtn} 
                                setOpen={setVerifyBtn} 
                                title="Verify Stock" 
                                icon={<Verified className="text-white"/>}
                                className="w-[160px]"
                                menuItems={[
                                    <DropdownMenuItem key="mariseth-farm" onClick={handleVerifyStock} className="py-3 px-6 text-gray-700 font-normal text-sm hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">
                                    Verify Stock
                                    </DropdownMenuItem>,
                                    <DropdownMenuItem key="external-farm" onClick={handleVerifyStockWithComment} className="py-3 px-6 text-gray-700 text-sm font-normal hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">
                                        Verify Stock with Comments
                                    </DropdownMenuItem>
                                
                                ]}
                            />
                            }
                            {_stage === "order_pickup" && 
                                <>
                                    {((mark_outflow_order_picked && defaultData?.warehouse?.delivery_information?.length)) ?
                                        <div className="space-x-5">
                                            <Button variant={"default"} className="bg-[#4A8D34] border text-white font-semibold" onClick={() => setApprovePickupModal(true)}>
                                                <Verified className="text-white"/> Pickup Complete
                                            </Button>
                                        </div>:<div><Button variant={"default"} disabled className="bg-[#4A8D34] border text-white font-semibold">
                                                <Verified className="text-white"/> Pickup Complete
                                            </Button></div>
                                    }
                                </>
                            }
                            
                        </CardTitle>
                    </CardHeader>
                </Card>
                
                <div className="flex items-center gap-0 mt-5">
                    
                    <div className="flex w-full relative items-center" >
                        <div className={`${stageClassName?.stage_1?.bg} h-13 px-6 py-3  font-medium rounded-l-lg border-1 border-[#4A8D34] w-full border-r-0`}>
                           Availability Check
                        </div>
                        <div className={`${stageClassName?.stage_1?.bg} flex items-center rounded z-10  rotate-45 -ml-5 right-0 h-[39px] w-[39px] border-l-0 border-b-0 border-r-[#4A8D34] border-t-[#4A8D34] border-1`}>
                            {stage !== "pending" && <Check size={18} className="mt-4 mr-5 -rotate-45 bg-white text-[#4A8D34] rounded-full"/>}
                        </div>
                    </div>
                    <div className="flex w-full relative items-center -ml-5 ">
                        <div className={`${stageClassName?.stage_2?.bg} rounded bg-white rotate-45  right-0 h-[38px] w-[38px] border-l-0 border-b-0  border-1`}>

                        </div>
                        <div className={`${stageClassName?.stage_2?.bg} w-full -ml-5 px-15 py-3 font-medium rounded-r-lg border-l-0 border-1 `}>
                            Order Pickup
                        </div>
                        {_stage === "order_picked_up" && <Check size={18} className="absolute right-0 mr-7 bg-white text-[#4A8D34] rounded-full"/>}
                    </div>
                </div>
                <OutflowDetails defaultData={defaultData} refetch={refetch}/>
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
                    <ApproveOutflowModal 
                        open={approvalModal} 
                        setOpen={setApprovalModal} 
                        data={defaultData} 
                        refetch={refetch}
                    />
                }
                {approvePickupModal &&
                    <PickupCompleteModal 
                        open={approvePickupModal} 
                        setOpen={setApprovePickupModal} 
                        data={defaultData} 
                        refetch={refetch}
                    />
                }
            </div>
        </AuthorizeAndRenderPage>
    )
}