"use client"
import { useState } from "react"
import dynamic from "next/dynamic"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, PenLine, Shapes, Users2, Building2 } from "lucide-react"
import PlaceholderNotice from "./PlaceholderNotice"
import FullscreenMapPanel from "./FullscreenMapPanel"
import { MONITORED_FARMS } from "./farmMonitoringData"
import type { GeoFenceAsset } from "./GeoFenceLeafletMap"

// Leaflet touches `window`, which doesn't exist during Next.js server
// rendering, so the map must be loaded client-side only.
const GeoFenceLeafletMap = dynamic(() => import("./GeoFenceLeafletMap"), { ssr: false })

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

// PLACEHOLDER: illustrative tracked-asset positions (small offsets around
// the farm center) - swap for real GPS device coordinates once GEO-02
// exists.
function getAssetsForFarm(farmId: number, assetCount: number, center: { lat: number; lng: number }): GeoFenceAsset[] {
  const offsets = [
    { dLat: 0.0025, dLng: -0.002 }, { dLat: -0.002, dLng: 0.003 }, { dLat: 0.0015, dLng: 0.0032 },
    { dLat: -0.003, dLng: -0.0025 }, { dLat: 0.0035, dLng: 0.001 },
  ]
  const statuses = ["Onsite", "En route", "Offsite"]
  return Array.from({ length: assetCount }).map((_, i) => ({
    id: `${farmId}-${i}`,
    label: i === 0 ? "Field Officer" : `Asset ${i + 1}`,
    lat: center.lat + offsets[i % offsets.length].dLat,
    lng: center.lng + offsets[i % offsets.length].dLng,
    status: statuses[i % statuses.length],
    lastSeen: `${(i + 1) * 4} mins ago`,
  }))
}

export default function GeoFencingManager() {
  const [search, setSearch] = useState("")
  const [selectedFarmId, setSelectedFarmId] = useState(MONITORED_FARMS[0].id)

  const filteredFarms = MONITORED_FARMS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedFarm = MONITORED_FARMS.find((f) => f.id === selectedFarmId) ?? MONITORED_FARMS[0]
  const selectedFence = FENCES.find((f) => f.farmId === selectedFarmId)!
  const assets = getAssetsForFarm(selectedFarm.id, selectedFence.assets, selectedFarm.latLng)

  return (
    <div>
      <PageTitle title="Geo-Fencing Manager" />
      <PlaceholderNotice text="Boundary drawing and asset tracking are illustrative - no live GPS gateway is connected yet. The map itself uses free OpenStreetMap tiles so you can preview the real interaction." />

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: farm / fence list */}
        <div className="lg:w-[340px] shrink-0 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search farms..."
              className="w-full text-sm border border-[#E2E8F0] rounded-sm pl-9 pr-3 py-2.5 outline-none focus:border-[#4A8D34]"
            />
          </div>

          <div className="flex flex-col gap-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredFarms.map((farm) => {
              const fence = FENCES.find((f) => f.farmId === farm.id)!
              const isSelected = farm.id === selectedFarmId
              return (
                <Card
                  key={farm.id}
                  className={`p-4 shadow-none cursor-pointer transition-colors ${
                    isSelected ? "border-[#4A8D34] bg-[#F0FDF4]" : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                  }`}
                  onClick={() => setSelectedFarmId(farm.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-[#4A8D34] shrink-0" />
                    <p className="text-sm font-semibold text-black truncate">{farm.name}</p>
                  </div>
                  <p className="text-xs text-[#64748B] mb-3">{farm.district}</p>

                  <div className="flex items-end justify-between">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-sm font-bold text-black">{fence.assets}</p>
                        <p className="text-[10px] text-[#94A3B8]">Assets</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-black">{fence.recipients.length}</p>
                        <p className="text-[10px] text-[#94A3B8]">Recipients</p>
                      </div>
                    </div>
                    <Badge
                      className={`border-0 shrink-0 ${
                        fence.configured ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEF9C3] text-[#CA8A04]"
                      }`}
                    >
                      {fence.configured ? "Configured" : "Unconfigured"}
                    </Badge>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Right: real map */}
        <div className="flex-1 min-w-0">
          <FullscreenMapPanel title={`${selectedFarm.name} - Boundary`}>
            {(isFullscreen) => (
              <div className={isFullscreen ? "relative w-screen h-screen" : "relative rounded-2xl overflow-hidden border border-[#E2E8F0] h-[600px]"}>
                <GeoFenceLeafletMap farm={selectedFarm} assets={assets} configured={selectedFence.configured} />

                {/* asset count chip */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-black z-[1000]">
                  <Users2 className="h-3.5 w-3.5 text-[#4A8D34]" />
                  {selectedFence.assets} asset{selectedFence.assets === 1 ? "" : "s"} tracked
                </div>

                {/* draw / shape tools */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 z-[1000]">
                  <button className="flex items-center gap-1.5 bg-white rounded-sm shadow px-3 py-2 text-xs font-medium text-black cursor-pointer hover:bg-[#F8FAFC]">
                    <PenLine className="h-3.5 w-3.5" />
                    Draw
                  </button>
                  <button className="flex items-center gap-1.5 bg-white rounded-sm shadow px-3 py-2 text-xs font-medium text-black cursor-pointer hover:bg-[#F8FAFC]">
                    <Shapes className="h-3.5 w-3.5" />
                    Shape
                  </button>
                </div>
              </div>
            )}
          </FullscreenMapPanel>
        </div>
      </div>
    </div>
  )
}