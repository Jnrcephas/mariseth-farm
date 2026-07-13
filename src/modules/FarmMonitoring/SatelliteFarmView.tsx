"use client"
import { useState } from "react"
import dynamic from "next/dynamic"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Download, Satellite } from "lucide-react"
import PlaceholderNotice from "./PlaceholderNotice"
import FullscreenMapPanel from "./FullscreenMapPanel"
import { MONITORED_FARMS, HEALTH_STYLES } from "./farmMonitoringData"

// Leaflet touches `window`, which doesn't exist during Next.js server
// rendering, so the map must be loaded client-side only.
const SatelliteLeafletMap = dynamic(() => import("./SatelliteLeafletMap"), { ssr: false })

export default function SatelliteFarmView() {
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const filteredFarms = MONITORED_FARMS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )
  const alertFarms = MONITORED_FARMS.filter((f) => f.health === "alert")

  return (
    <div>
      <PageTitle title="Satellite Farm View" />
      <PlaceholderNotice text="NDVI health scores are illustrative - no live satellite/NDVI API (e.g. Sentinel Hub, Planet) is connected yet. The imagery itself is real - free Esri World Imagery satellite tiles, so you can preview the real interaction." />

      {/* Legend */}
      <div className="flex items-center gap-5 mb-4">
        {(Object.keys(HEALTH_STYLES) as (keyof typeof HEALTH_STYLES)[]).map((key) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: HEALTH_STYLES[key].dot }} />
            <span className="text-sm text-[#475569]">{HEALTH_STYLES[key].label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: farm list */}
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

          <div className="flex flex-col gap-3 max-h-[540px] overflow-y-auto pr-1">
            {filteredFarms.map((farm) => {
              const style = HEALTH_STYLES[farm.health]
              const isSelected = farm.id === selectedId
              return (
                <Card
                  key={farm.id}
                  className={`p-4 shadow-none cursor-pointer transition-colors ${
                    isSelected ? "border-[#4A8D34] bg-[#F0FDF4]" : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                  }`}
                  onClick={() => setSelectedId(farm.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-black truncate pr-2">{farm.name}</p>
                    <Badge className={`${style.badge} border-0 shrink-0`}>{style.label}</Badge>
                  </div>
                  <p className="text-xs text-[#64748B]">{farm.district} · NDVI {farm.ndvi.toFixed(2)}</p>
                </Card>
              )
            })}
          </div>

          {alertFarms.length > 0 && (
            <Card className="p-4 shadow-none border border-[#FCA5A5] bg-[#FEF2F2]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-black">Flagged Below Threshold</span>
                <Button variant="outline" className="rounded-sm text-xs h-8 px-2.5 cursor-pointer">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="flex flex-col gap-1.5">
                {alertFarms.map((f) => (
                  <p key={f.id} className="text-xs text-[#7F1D1D]">{f.name} - NDVI {f.ndvi.toFixed(2)}</p>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right: real satellite map */}
        <div className="flex-1 min-w-0">
          <FullscreenMapPanel title="Registered Farms - Satellite Map">
            {(isFullscreen) => (
              <div className={isFullscreen ? "relative w-screen h-screen" : "relative rounded-2xl overflow-hidden border border-[#E2E8F0] h-[600px]"}>
                <SatelliteLeafletMap onSelectFarm={setSelectedId} />

                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-black z-[1000]">
                  <Satellite className="h-3.5 w-3.5 text-[#4A8D34]" />
                  {MONITORED_FARMS.length} farms in view - click a marker for details
                </div>
              </div>
            )}
          </FullscreenMapPanel>
        </div>
      </div>
    </div>
  )
}