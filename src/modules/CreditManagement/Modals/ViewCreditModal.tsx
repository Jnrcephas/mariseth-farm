"use client"
import {
    Dialog,
    DialogContent,
    DialogPoweredByFooter,
    DialogTitle,
  } from "@/components/ui/dialog"
import { TextLabel } from "@/components/ui/label";
import { XCircle } from "lucide-react";
import { TModal } from "@/lib/types";
import { formatDateReadable } from "@/lib/helpers";
import { CEDI } from "@/lib/constants";
// import CustomTable from "@/components/CustomTable";


  export default function ViewCreditModal({open, setOpen, defaultData}:TModal){
    // const columns: ColumnDef<any>[] = [
    //         { header: "Date", accessorKey: "date_created",
    //             cell: (_row) => {
    //                 const date_created = _row.row.original?.date_created
    //                 return(<div className="capitalize">
    //                         {formatDateReadable(date_created)}
    //                 </div>)
    //             }
    
    //         },
    //         { header: "Event", accessorKey: "event", 
    //             cell: (_row) => {
    //                 const event = _row.row.original?.event
    //                 return(<div className="capitalize">
    //                         {event.replaceAll("_", " ")}
    //                 </div>)
    //              }
    //         },
    //         { header: "Field Updated", accessorKey: "field_name", 
    //             cell: (_row) => {
    //                 const field_name = _row.row.original?.field_name
    //                 return(<div className="capitalize">
    //                         {field_name.replaceAll("_", " ")}
    //                 </div>)
    //              }
    //         },
    //         { header: "Field Value", accessorKey: "new_value", 
    //             cell: (_row) => {
    //                 const new_value = _row.row.original?.new_value
    //                 return(<div className="capitalize">
    //                         {new_value.replaceAll("_", " ")}
    //                 </div>)
    //              }
    //         },
    //         { header: "Action By", accessorKey: "created_by", 
    //             cell: (_row) => {
    //                 const created_by = _row.row.original?.created_by
    //                 return(<div className="capitalize">
    //                         {created_by?.first_name} {created_by?.last_name}
    //                 </div>)
    //              }
    //         }
    //     ];

    return(
        <Dialog open={open}>
            <DialogContent className="md:max-w-[850px] md:max-h-[700px] text-[#334155] rounded-lg">
                <DialogTitle className=" flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">View Credit - {defaultData?.credit_id}</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
                <div className="mt-1 px-5 mb-10 overflow-y-auto h-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <TextLabel title="Farmer" subTitle={`${defaultData?.farmer?.first_name} ${defaultData?.farmer?.last_name}`} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Credit Type" subTitle={defaultData?.input_credit?.category?.name} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Inputs Credits" subTitle={defaultData?.input_credit?.name || "N/A"} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Quantity" subTitle={defaultData?.quantity} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Issue Date" subTitle={formatDateReadable(defaultData?.issue_date)} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Due Date" subTitle={formatDateReadable(defaultData?.due_date)} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Credit Amount" subTitle={`${CEDI} ${defaultData?.credit_amount}`} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Interest Rate" subTitle={`${Number(defaultData?.interest_rate || 0).toFixed(0)}%`} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 mt-5 gap-5">
                        <div className="md:col-span-8">
                            <TextLabel title="Extra Information/Notes" subTitle={defaultData?.notes} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div className="md:col-span-4">
                            <TextLabel title="Created By" subTitle={`${defaultData?.created_by?.first_name} ${defaultData?.created_by?.last_name}`} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                    </div>
                    {/* <div className="mt-5">
                        <div className="font-semibold text-sm text-[#4A8D34]">Credit Logs</div>
                        <hr className="py-2"/>
                        <CustomTable
                            columns={columns} 
                            data={defaultData?.logs || []} 
                            perPage={100} 
                            isLoading={false}
                            count={(defaultData?.logs || []).length || 0}
                        />
                    </div> */}
                </div>
                <div className="bottom-0 absolute w-full rounded-b-lg">
                    <DialogPoweredByFooter/>
                </div>
            </DialogContent>
            
        </Dialog>
    )
  }