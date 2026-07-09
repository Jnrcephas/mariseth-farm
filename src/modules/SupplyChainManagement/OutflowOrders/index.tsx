"use client"
import { useState } from "react"
import { CirclePlus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { routeTo } from "@/lib/constants"
import { useHasAccess } from "@/hooks/auth/useHasAccess"
import { cn } from "@/lib/utils"
import SupplyChainOutflowOrders from "./SupplyChainOutflowOrders"

type OutboundTab = "pending" | "completed"

const OUTBOUND_TABS: { key: OutboundTab; label: string }[] = [
  { key: "pending", label: "Pending Outbound Orders" },
  { key: "completed", label: "Completed Outbound Orders" },
]

export default function MainSupplyChainOutflow(){
    const { hasAccess: create_outflow_order } = useHasAccess("outflow_orders|create_outflow_order")
    const [activeTab, setActiveTab] = useState<OutboundTab>("pending")

    return(
        <div className="mt-10">
            <div className="font-bold text-xl text-black mb-4">Outbound Orders</div>

            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                    {OUTBOUND_TABS.map((tab) => (
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

                {create_outflow_order && (
                    <Link href={routeTo.outflowOrdersAdd}>
                        <Button className="bg-[#4A8D34] hover:bg-[#3f7a2c] text-white cursor-pointer rounded-sm px-6 py-4 text-base font-bold">
                            <CirclePlus />
                            Add New Outbound Order
                        </Button>
                    </Link>
                )}
            </div>

            <SupplyChainOutflowOrders completed={activeTab === "completed"}/>
        </div>
    )
}