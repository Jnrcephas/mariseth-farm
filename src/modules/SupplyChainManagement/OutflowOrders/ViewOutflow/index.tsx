"use client"
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, CreditCard, Grid2X2Check, Truck, Verified } from "lucide-react";
import Link from "next/link";
import { routeTo } from "@/lib/constants";
import { formatDateReadable, formatText } from "@/lib/helpers";
import OutflowDetails from "./OutflowDetails";
import { useState } from "react";
import ApproveInspectionModal from "../Modals/ApproveInspectionModal";
import ApproveOutflowModal from "../Modals/ApproveOutflowModal";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import RecordPaymentModal from "../Modals/RecordPaymentModal";
import SetDeliveryInfo from "../Modals/SetDeliveryInfo";
import ApproveInspectionCommentModal from "@/modules/Approvals/Outflow/Modals/ApproveInspectionCommentModal";
import { ORDER_STATUS_MAP_OUTFLOW } from "../../utils/constants";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import MarkAsDelivered from "../Modals/MarkAsDelivered";
import DropdownButton from "@/components/customs/ButtonDropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ApprovalStatusCommentModal from "../Modals/ApprovalStatusCommentModal";
import ApprovalStatusModal from "../Modals/ApprovalStatusModal";

export default function ViewOutflowDetails({defaultData, refetch, approvals=false}:{defaultData: any; refetch: () => void; approvals?: boolean}){
    const stage: keyof typeof ORDER_STATUS_MAP_OUTFLOW = defaultData?.status || "availability_check"
    
    const [inspectionApprovalModal, setInspectionApprovalModal] = useState(false)
    const [approvalCommentModal, setApprovalCommentModal] = useState(false)
    const [approvalModal, setApprovalModal] = useState(false)

    const [paymentModal, setPaymentModal] = useState(false)
    const [deliveryModal, setDeliveryModal] = useState(false)
    const [editDeliveryModal, setEditDeliveryModal] = useState(false)
    const [deliveredModal, setDeliveredModal] = useState(false)
    const [approvalStatusModal, setApprovalStatusModal] = useState(false)
    const [approvalStatusWithCommentModal, setApprovalStatusWithCommentModal] = useState(false)
    const [verifyBtn, setVerifyBtn] = useState(false)


    const warehousesApproved = Array.isArray(defaultData?.warehouses) && defaultData.warehouses.length > 0
        ? defaultData.warehouses.every((item: any) => item?.status === "verified")
        : false;

    const _stage = ORDER_STATUS_MAP_OUTFLOW[stage] || "availability_check"
    

    const _stageClassName = {
        availability_check: {
            stage_1: {
                bg: "bg-[#F4F5F7] text-[#4A8D34] border-[#4A8D34]"
            },
            stage_2: {
                bg: "bg-white text-gray-500 border-[#C4C4C4]"               
            },
            stage_3: {
                bg: "bg-white text-gray-500 border-[#C4C4C4]"                
            },
            stage_4: {
                bg: "bg-white text-gray-500 border-[#C4C4C4]"
            }
        },
        truck_pickup: {
            stage_1: {
                bg: "bg-[#4A8D34] text-white"
            },
            stage_2: {
                bg: "bg-[#F4F5F7] text-[#4A8D34] border-[#4A8D34]"               
            },
            stage_3: {
                bg: "bg-white text-gray-500 border-[#C4C4C4]"                
            },
            stage_4: {
                bg: "bg-white text-gray-500 border-[#C4C4C4]"            
            }
        },
        order_picked_up: {
            stage_1: {
                bg: "bg-[#4A8D34] text-white"
            },
            stage_2: {
                bg: "bg-[#4A8D34] text-white"
            },
            stage_3: {
                bg: "bg-[#F4F5F7] text-[#4A8D34] border-[#4A8D34]"
            },
            stage_4: {
                bg: "bg-white text-gray-500 border-[#C4C4C4]"
            }
        },
        delivery: {
            stage_1: {
                bg: "bg-[#4A8D34] text-white"
            },
            stage_2: {
                bg: "bg-[#4A8D34] text-white"
            },
            stage_3: {
                bg: "bg-[#F4F5F7] text-[#4A8D34] border-[#4A8D34]"
            },
            stage_4: {
                bg: "bg-white text-gray-500 border-[#C4C4C4]"
            }
        },
        order_approval: {
            stage_1: {
                bg: "bg-[#4A8D34] text-white"
            },
            stage_2: {
                bg: "bg-[#4A8D34] text-white"
            },
            stage_3: {
                bg: "bg-[#4A8D34] text-white"
            },
            stage_4: {
                bg: "bg-[#F4F5F7] text-[#4A8D34] border-[#4A8D34]"
            }
        },
        approved: {
            stage_1: {
                bg: "bg-[#4A8D34] text-white"
            },
            stage_2: {
                bg: "bg-[#4A8D34] text-white"
            },
            stage_3: {
                bg: "bg-[#4A8D34] text-white"
            },
            stage_4: {
                bg: "bg-[#4A8D34] text-white"
            }
        }
    }
    const stageClassName = _stageClassName[_stage as keyof typeof _stageClassName] as any

    function handleApprovalStatus(){
        setVerifyBtn(false)
        setApprovalStatusModal(true)
    }
    function handleApprovalStatusWithComment(){
        setVerifyBtn(false)
        setApprovalStatusWithCommentModal(true)
    }
    

    return(
        <AuthorizeAndRenderPage permission={"outflow_orders|view_outflow_order"}>
            <div className="p-5 px-8 bg-white rounded-lg">
                <Link href={approvals ? routeTo.outflowApprovals : routeTo.inflowOrders}>
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
                            {/* {stage === "pending" &&
                                <div className="space-x-5">
                                    <Button variant={"ghost"} className="border text-[#0F172A]" onClick={() => setApprovalCommentModal(true)}>
                                        <FileText className="text-[#4A8D34]"/> Approve with Comments
                                    </Button>
                                    <Button variant={"default"} className="bg-[#4A8D34] border text-white font-semibold" onClick={() => setInspectionApprovalModal(true)}>
                                        <Verified className="text-white"/> Approve without Comments
                                    </Button>
                                </div>
                            } */}
                            
                            {warehousesApproved && (_stage === "truck_pickup") && !defaultData?.delivery_information?.length &&
                                <div className="space-x-5">
                                    {/* {defaultData?.delivery_information?.length ? 
                                        <Button variant={"ghost"} className="border text-[#0F172A]" onClick={() => setDeliveryModal(true)}>
                                            <Truck className="text-[#4A8D34]"/> Set Delivery Details
                                        </Button>:
                                        <Button variant={"ghost"} className="border text-[#0F172A]" onClick={() => setEditDeliveryModal(true)}>
                                            <Truck className="text-[#4A8D34]"/> Edit Delivery Details
                                        </Button>
                                    } */}
                                    <Button variant={"ghost"} className="border text-[#0F172A]" onClick={() => setDeliveryModal(true)}>
                                        <Truck className="text-[#4A8D34]"/> Set Delivery Details
                                    </Button>
                                </div>
                            }
                            {_stage === "delivery" && 
                                <Button variant={"default"} onClick={() => setDeliveredModal(true)}>
                                    <Grid2X2Check className="text-white"/> Mark As Delivered
                                </Button>
                            }
                            {_stage === "order_approval" &&
                                <div className="space-x-5">
                                    {(Number(Number(defaultData?.amount_due).toFixed(0)) > 0) &&
                                        <Button variant={"ghost"} className="border text-[#0F172A]" onClick={() => setPaymentModal(true)}>
                                            <CreditCard className="text-[#4A8D34]"/> Record Payment
                                        </Button>
                                    }
                                    <DropdownButton 
                                        open={verifyBtn} 
                                        setOpen={setVerifyBtn} 
                                        title="Approval Status" 
                                        icon={<Verified className="text-white"/>}
                                        className="w-[200px]"
                                        menuItems={[
                                            <DropdownMenuItem key="mariseth-farm" onClick={handleApprovalStatus} className="py-3 px-6 text-gray-700 font-normal text-sm hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">
                                            Approve Without Comments
                                            </DropdownMenuItem>,
                                            <DropdownMenuItem key="external-farm" onClick={handleApprovalStatusWithComment} className="py-3 px-6 text-gray-700 text-sm font-normal hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">
                                                Submit Comments
                                            </DropdownMenuItem>
                                        
                                        ]}
                                    />

                                </div>
                            }
                            
                        </CardTitle>
                    </CardHeader>
                </Card>
                
                <div className="grid grid-cols-4 items-center gap-3 mt-5">
                    
                    <div className="flex w-full relative items-center w-full border-r-0" >
                        <div className={`${stageClassName?.stage_1?.bg} h-13 px-6 py-3 font-medium rounded-l-lg border-1 border-[#4A8D34] w-full border-r-0`} >
                            Availability Check
                        </div>
                        <div style={{marginRight: "-20px"}} className={`${stageClassName?.stage_1?.bg} absolute flex items-center rounded z-10  rotate-45 -ml-3s right-0 h-[39px] w-[39px] border-l-0 border-b-0 border-r-[#4A8D34] border-t-[#4A8D34] border-1`}>
                            {_stage !== "availability_check" && <Check size={18} className="mt-4 mr-5 -rotate-45 bg-white text-[#4A8D34] rounded-full"/>}
                        </div>
                    </div>
                    <div className="flex w-full relative items-center border-r-0">
                        <div className={`${stageClassName?.stage_2?.bg} rounded bg-white absolute rotate-45 -ml-5 left-0s h-[38px] w-[38px] border-l-0 border-b-0  border-1`}>

                        </div>
                        <div className={`${stageClassName?.stage_2?.bg} w-full h-13  px-15 py-3 font-medium rounded-r-lgs border-l-0 border-1 border-r-0`}>
                            Truck Pickup
                        </div>
                        <div style={{marginRight: "-20px"}} className={`${stageClassName?.stage_2?.bg} flex items-center absolute rounded z-10 rotate-45 -ml-6s right-0 h-[38px] w-[38px] border-l-0 border-b-0 border-1`}>
                             {["delivery","order_approval", "approved"].includes(_stage) && <Check size={18} className="mt-4 mr-5 -rotate-45 bg-white text-[#4A8D34] rounded-full"/>}
                        </div>
                    </div>
                    <div className="flex w-full relative items-center  border-r-0">
                        <div className={`${stageClassName?.stage_3?.bg} rounded bg-white absolute rotate-45 -ml-5 left-0s h-[38px] w-[38px] border-l-0 border-b-0  border-1`}>

                        </div>
                        <div className={`${stageClassName?.stage_3?.bg} w-full h-13 px-15 py-3 font-medium rounded-r-lgs border-l-0 border-1 border-r-0`}>
                            Delivery
                        </div>
                        <div style={{marginRight: "-20px"}} className={`${stageClassName?.stage_3?.bg} flex items-center absolute rounded z-10 rotate-45 -ml-6s right-0 h-[38px] w-[38px] border-l-0 border-b-0 border-1`}>
                             {["order_approval", "approved"].includes(_stage) && <Check size={18} className="mt-4 mr-5 -rotate-45 bg-white text-[#4A8D34] rounded-full"/>}
                        </div>
                    </div>
                    
                    <div className="flex w-full relative items-center  ">
                        <div className={`${stageClassName?.stage_4?.bg} rounded bg-white absolute rotate-45 -ml-5 left-0s h-[38px] w-[38px] border-l-0 border-b-0  border-1`}>

                        </div>
                        <div className={`${stageClassName?.stage_4?.bg} w-full h-13 px-15 py-3 font-medium rounded-r-lg border-l-0 border-1 `}>
                            Order Approval
                        </div>
                        {_stage === "approved" && <Check size={18} className="absolute right-0 mr-7 bg-white text-[#4A8D34] rounded-full"/>}
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
                {paymentModal &&
                    <RecordPaymentModal 
                        open={paymentModal} 
                        setOpen={setPaymentModal} 
                        defaultData={defaultData} 
                        refetch={refetch}
                    />
                }
                {deliveryModal &&
                    <SetDeliveryInfo 
                        open={deliveryModal} 
                        setOpen={setDeliveryModal} 
                        data={defaultData} 
                        refetch={refetch}
                    />
                }
                {editDeliveryModal &&
                    <SetDeliveryInfo 
                        open={editDeliveryModal} 
                        setOpen={setEditDeliveryModal} 
                        data={defaultData} 
                        refetch={refetch}
                        isEdit
                    />
                }
                {deliveredModal &&
                    <MarkAsDelivered 
                        open={deliveredModal} 
                        setOpen={setDeliveredModal} 
                        data={defaultData} 
                        refetch={refetch}
                    />
                }
                {approvalStatusWithCommentModal && 
                    <ApprovalStatusCommentModal
                        open={approvalStatusWithCommentModal} 
                        setOpen={setApprovalStatusWithCommentModal} 
                        data={defaultData} 
                        refetch={refetch}
                    />
                }
                {approvalStatusModal && 
                    <ApprovalStatusModal
                        open={approvalStatusModal} 
                        setOpen={setApprovalStatusModal} 
                        data={defaultData} 
                        refetch={refetch}
                    />
                }
            </div>
        </AuthorizeAndRenderPage>
    )
}