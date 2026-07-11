"use client"
import { useState } from "react"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PenLine, Truck, Bell, ShieldCheck, ShieldAlert } from "lucide-react"
import PlaceholderNotice from "./PlaceholderNotice"
import { MONITORED_FARMS } from "./farmMonitoringData"

// PLACEHOLDER: illustrative fence configuration - swap for real GeoFence /
// GeoFenceEvent records (GEO-01..GEO-06) once a map drawing tool + GPS
// gateway integration exists.
interface FenceConfig {
  farmId: number
  assets: number
  recipients: string[]
  configured: boolean
}

const FENCES: FenceConfig[] = [
  { farmId: 1, assets: 3, recipients: ["Field Officer - Kumbungu"], configured: true },
  { farmId: 2, assets: 1, recipients: ["Field Officer - Sawla-Tuna-Kalba"], configured: true },
  { farmId: 3, assets: 0, recipients: [], configured: false },
  { farmId: 4, assets: 2, recipients: ["Field Officer - Kumbungu", "Farm Manager"], configured: true },
  { farmId: 5, assets: 0, recipients: [], configured: false },
]

export default function GeoFencingManager() {
  const [selectedFarmId, setSelectedFarmId] = useState(MONITORED_FARMS[0].id)

  const selectedFarm = MONITORED_FARMS.find((f) => f.id === selectedFarmId) ?? MONITORED_FARMS[0]
  const selectedFence = FENCES.find((f) => f.farmId === selectedFarmId)!

  return (
    <div>
      <PageTitle title="Geo-Fencing Manager" />
      <PlaceholderNotice text="Boundary drawing and asset tracking shown here are illustrative - no live GPS gateway is connected yet." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Boundary drawing area */}
        <Card className="lg:col-span-2 p-5 shadow-none border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-black">{selectedFarm.name} - Boundary</span>
            <Button variant="outline" className="rounded-sm text-sm cursor-pointer">
              <PenLine className="h-4 w-4" />
              Draw Boundary
            </Button>
          </div>

          <div className="relative rounded-xl bg-[#ECFDF5] border border-[#BBF7D0] h-72 flex items-center justify-center overflow-hidden">
            {selectedFence.configured ? (
              <svg viewBox="0 0 200 140" className="w-2/3 h-2/3">
                <polygon
                  points="30,110 20,50 70,20 160,35 175,90 120,125"
                  fill="#4A8D34"
                  fillOpacity="0.25"
                  stroke="#4A8D34"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
              </svg>
            ) : (
              <p className="text-sm text-[#64748B]">No boundary drawn yet for this farm.</p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4 text-sm text-[#475569]">
            <Truck className="h-4 w-4 text-[#94A3B8]" />
            {selectedFence.assets} tracked asset{selectedFence.assets === 1 ? "" : "s"} assigned to this fence
          </div>
        </Card>

        {/* Fence list + alert configuration */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 shadow-none border border-[#E2E8F0]">
            <span className="text-sm font-semibold text-black">Fence List</span>
            <div className="flex flex-col gap-2 mt-3">
              {MONITORED_FARMS.map((farm) => {
                const fence = FENCES.find((f) => f.farmId === farm.id)!
                const isSelected = farm.id === selectedFarmId
                return (
                  <button
                    key={farm.id}
                    type="button"
                    onClick={() => setSelectedFarmId(farm.id)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left cursor-pointer transition-colors ${
                      isSelected ? "bg-[#4A8D34] text-white" : "bg-[#F8FAFC] text-black hover:bg-[#F1F5F9]"
                    }`}
                  >
                    <span className="text-sm font-medium truncate pr-2">{farm.name}</span>
                    {fence.configured ? (
                      <ShieldCheck className={`h-4 w-4 shrink-0 ${isSelected ? "text-white" : "text-[#16A34A]"}`} />
                    ) : (
                      <ShieldAlert className={`h-4 w-4 shrink-0 ${isSelected ? "text-white" : "text-[#CA8A04]"}`} />
                    )}
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="p-5 shadow-none border border-[#E2E8F0]">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-4 w-4 text-[#4A8D34]" />
              <span className="text-sm font-semibold text-black">Alert Recipients</span>
            </div>
            {selectedFence.recipients.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedFence.recipients.map((r) => (
                  <Badge key={r} className="bg-[#E2E8F0] text-[#334155] border-0">{r}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#64748B] mb-3">No recipients configured for this fence yet.</p>
            )}
            <input
              type="text"
              placeholder="Add recipient..."
              className="w-full text-sm border border-[#E2E8F0] rounded-sm px-3 py-2 outline-none focus:border-[#4A8D34]"
              disabled
            />
          </Card>
        </div>
      </div>
    </div>
  )
}