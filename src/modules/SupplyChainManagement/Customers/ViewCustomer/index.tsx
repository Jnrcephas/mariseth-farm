"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { routeTo } from "@/lib/constants";
import OrdersTable from "./OrdersTable";
import AddCustomerModal from "../Modals/AddCustomerModal";
import DeleteCustomerModal from "../Modals/DeleteCustomerModal";
import { useState } from "react";

export default function ViewCustomerDetails({defaultData, refetch}:{defaultData: any, refetch: () => void}){
    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    function handleEditModal(){
        setEditModal(true)
    }
    function handleDeleteModal(){
        setDeleteModal(true)
    }

    return(
        <div>
           
            <div className="p-5 px-8 bg-white rounded-lg">
                <Link href={routeTo.customers}>
                    <Button variant="outline" className="cursor-pointer">
                        <ArrowLeft className="text-[#16A34A]"/>Back
                    </Button>
                </Link>
                <Card className="w-full  mx-auto px-8 mt-5  border-1 !shadow-none">
                    <CardHeader className="pb-2 border-l-4 border-[#26A996] border-b-0 border-r-0">
                        <CardTitle className=" font-medium mb-3 text-2xl flex justify-between">
                            <div>
                                {defaultData?.name}
                                <div className="text-sm mt-1 text-[#475569] mb-2">
                                    {defaultData?.customer_id}
                                </div>
                                <Badge variant="success" className="text-sm">Active</Badge>
                            </div>
                            <div className="space-x-5">
                                <Button variant={"ghost"} className="border text-[#0F172A]" onClick={handleEditModal}>
                                    <Pencil className="text-[#4A8D34]"/> Edit
                                </Button>
                                <Button variant={"destructive"} className="border text-white font-semibold" onClick={handleDeleteModal}>
                                    <Trash2 className="text-white"/> Delete
                                </Button>
                            </div>
                        </CardTitle>
                        <div className="space-y-3 text-[#475569]">
                            <div className="space-x-2">
                                <span className="text-[#4A8D34] text-sm">Phone Number</span>: 
                                {defaultData?.phone_number}
                            </div>
                            <div className="space-x-2">
                                <span className="text-[#4A8D34] text-sm">Email</span>: 
                                {defaultData?.email}
                            </div>
                            <div className="space-x-2">
                                <span className="text-[#4A8D34] text-sm">Company</span>: 
                                {defaultData?.company}
                            </div>
                            <div className="space-x-2">
                                <span className="text-[#4A8D34] text-sm">Location</span>: 
                                {defaultData?.location}
                            </div>
                            <div className="space-x-2">
                                <span className="text-[#4A8D34] text-sm">Comments</span>: 
                                {defaultData?.comments}
                            </div>
                        </div>
                    </CardHeader>
                </Card>
                
                <OrdersTable customerId={defaultData?.id} />

                {editModal &&
                    <AddCustomerModal
                        isEdit
                        open={editModal}
                        setOpen={setEditModal}
                        refetch={refetch}
                        defaultData={defaultData}
                    />
                }
                {deleteModal &&
                    <DeleteCustomerModal
                        open={deleteModal}
                        setOpen={setDeleteModal}
                        refetch={refetch}
                        data={defaultData}
                    />
                }
            </div>
        </div>
    )
}