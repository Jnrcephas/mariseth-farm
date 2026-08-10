"use client"
import { useState } from "react"
import { CirclePlus, UploadCloud } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { routeTo } from "@/lib/constants"
import { useHasAccess } from "@/hooks/auth/useHasAccess"
import { cn } from "@/lib/utils"
import SupplyChainInflowOrders from "./SupplyChainInflowOrders"
import BulkUploadModal from "../BulkUploadModal"

type InboundTab = "pending" | "completed"

const INBOUND_TABS: { key: InboundTab; label: string }[] = [
  { key: "pending", label: "Pending Inbound Orders" },
  { key: "completed", label: "Completed Inbound Orders" },
]

export default function MainSupplyChainInflow(){
    const { hasAccess: create_inflow_order } = useHasAccess("inflow_orders|create_inflow_order")
    const upload_inflow_orders = true
    // const { hasAccess: upload_inflow_orders } = useHasAccess("inflow_orders|upload_inflow_orders")
    const [activeTab, setActiveTab] = useState<InboundTab>("pending")
    const [bulkUploadOpen, setBulkUploadOpen] = useState(false)

    return(
        <div className="mt-10">
            <div className="font-bold text-xl text-black mb-4">Inbound Orders</div>

            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                    {INBOUND_TABS.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "rounded-sm px-6 py-4 text-base font-bold transition-colors cursor-pointer",
                                activeTab === tab.key
                                    ? "bg-[#4A8D34] text-white"
                                    : "bg-[#E2E8F0] text-[#64748B] hover:bg-[#CBD5E1]"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    {upload_inflow_orders && (
                        <Button
                            variant="outline"
                            className="border-[#4A8D34] text-[#4A8D34] cursor-pointer rounded-sm px-6 py-4 text-base font-bold"
                            onClick={() => setBulkUploadOpen(true)}
                        >
                            <UploadCloud />
                            Bulk Upload
                        </Button>
                    )}
                    {create_inflow_order && (
                        <Link href={routeTo.inflowOrdersAdd}>
                            <Button className="bg-[#4A8D34] hover:bg-[#3f7a2c] text-white cursor-pointer rounded-sm px-6 py-4 text-base font-bold">
                                <CirclePlus />
                                Add New Inbound Order
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <SupplyChainInflowOrders completed={activeTab === "completed"}/>

            {upload_inflow_orders && (
                <BulkUploadModal open={bulkUploadOpen} setOpen={setBulkUploadOpen} type="inflow" />
            )}
        </div>
    )
}