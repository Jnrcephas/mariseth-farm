"use client"
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import InventoryTable from "./InventoryTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { routeTo } from "@/lib/constants";
import { useState } from "react";
import AddWarehouseModal from "../Modals/AddWarehouseModal";
import DeleteWarehouseModal from "../Modals/DeleteWarehouseModal";
import ManagersTable from "./ManagersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WarehouseInputCredits from "./WarehouseInputCredits";

export default function ViewWarehouseDetails({defaultData, refetch}:{defaultData: any, refetch: () => void}){
    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    return(
        <div>
            
            <div className="p-5 px-8 bg-white rounded-lg">
                <Link href={routeTo.warehouses}>
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
                                    {defaultData?.warehouse_id}
                                </div>
                                <Badge variant="success" className="text-sm">Active</Badge>
                            </div>
                            <div className="space-x-5">
                                <Button variant={"ghost"} className="border text-[#0F172A]" onClick={() => setEditModal(true)}>
                                    <Pencil className="text-[#4A8D34]"/> Edit
                                </Button>
                                <Button variant={"destructive"} className="border text-white font-semibold" onClick={() => setDeleteModal(true)}>
                                    <Trash2 className="text-white"/> Delete
                                </Button>
                            </div>
                        </CardTitle>
                        <div className="space-y-3 text-[#475569]">
                            <div className="space-2">
                                <span className="text-[#4A8D34] text-sm mr-2">Region:</span>
                                {defaultData?.region?.name}
                            </div>
                            <div className="space-2">
                                <span className="text-[#4A8D34] text-sm mr-2">District:</span>
                                {defaultData?.district?.name}
                            </div>
                            <div className="space-2">
                                <span className="text-[#4A8D34] text-sm mr-2">Capacity:</span>
                                {defaultData?.capacity} tons
                            </div>
                            
                        </div>
                    </CardHeader>
                </Card>
                <div className="mt-5">
                    <div className="mb-1 font-semibold text-lg text-[#0F172A]">Inventory</div>
                </div>
                <Tabs defaultValue="1" className="w-full mx-auto mt-2">
                    <TabsList className="grid w-[400px] grid-cols-2 mx-auto p- h-[36px] bg-[#F1F5F9] border ">
                        <TabsTrigger className="h-[28px] cursor-pointer" value="1">Products</TabsTrigger>
                        <TabsTrigger className="h-[28px] cursor-pointer" value="2">Input Credits</TabsTrigger>
                    </TabsList>
                    <TabsContent value="1">
                        <InventoryTable warehouseId={defaultData?.id}/>
                    </TabsContent>
                    <TabsContent value="2">
                        <WarehouseInputCredits warehouseId={defaultData?.id}/>
                    </TabsContent>
                </Tabs>
                
                <ManagersTable data={defaultData?.managers}/>
                {editModal &&
                    <AddWarehouseModal
                        isEdit
                        open={editModal}
                        setOpen={setEditModal}
                        refetch={refetch}
                        defaultData={defaultData}
                    />
                }
                {deleteModal &&
                    <DeleteWarehouseModal
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