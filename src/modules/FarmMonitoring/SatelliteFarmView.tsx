"use client"
import { useState } from "react"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Satellite, User2, MapPin, CalendarClock } from "lucide-react"
import PlaceholderNotice from "./PlaceholderNotice"
import { MONITORED_FARMS, HEALTH_STYLES } from "./farmMonitoringData"

// PLACEHOLDER: illustrative snapshot dates for the history slider - swap
// for real satellite snapshot timestamps once SAT-05 (24-month retention)
// is wired up.
const SNAPSHOT_DATES = ["10 Apr 2026", "22 May 2026", "15 Jun 2026", "01 Jul 2026", "08 Jul 2026"]

export default function SatelliteFarmView() {
  const [selectedId, setSelectedId] = useState(MONITORED_FARMS[0].id)
  const [snapshotIdx, setSnapshotIdx] = useState(SNAPSHOT_DATES.length - 1)

  const selectedFarm = MONITORED_FARMS.find((f) => f.id === selectedId) ?? MONITORED_FARMS[0]
  const alertFarms = MONITORED_FARMS.filter((f) => f.health === "alert")

  return (
    <div>
      <PageTitle title="Satellite Farm View" />
      <PlaceholderNotice text="Satellite imagery and NDVI health scores shown here are illustrative - no live satellite API (e.g. Sentinel Hub, Planet) is connected yet." />

      {/* Legend */}
      <div className="flex items-center gap-5 mb-5">
        {(Object.keys(HEALTH_STYLES) as (keyof typeof HEALTH_STYLES)[]).map((key) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: HEALTH_STYLES[key].dot }} />
            <span className="text-sm text-[#475569]">{HEALTH_STYLES[key].label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* "Map" - farm polygon tiles color-coded by health */}
        <Card className="lg:col-span-2 p-5 shadow-none border border-[#E2E8F0]">
          <div className="flex items-center gap-2 mb-4">
            <Satellite className="h-4 w-4 text-[#4A8D34]" />
            <span className="text-sm font-semibold text-black">Registered Farms - Satellite Map</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MONITORED_FARMS.map((farm) => {
              const style = HEALTH_STYLES[farm.health]
              const isSelected = farm.id === selectedId
              return (
                <button
                  key={farm.id}
                  type="button"
                  onClick={() => setSelectedId(farm.id)}
                  className={`text-left rounded-xl p-4 border transition-all cursor-pointer ${
                    isSelected ? "ring-2 ring-offset-2 ring-[#4A8D34]" : "hover:opacity-90"
                  }`}
                  style={{ backgroundColor: style.bg, borderColor: style.fg }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: style.dot }} />
                    <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: style.fg }}>
                      {style.label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-black leading-tight">{farm.name}</p>
                  <p className="text-xs text-[#64748B] mt-1">NDVI {farm.ndvi.toFixed(2)}</p>
                </button>
              )
            })}
          </div>

          {alertFarms.length > 0 && (
            <div className="mt-5 pt-5 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-black">Farms Flagged Below Health Threshold</span>
                <Button variant="outline" className="rounded-sm text-sm cursor-pointer">
                  <Download className="h-4 w-4" />
                  Export Alerts Report
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {alertFarms.map((farm) => (
                  <div key={farm.id} className="flex items-center justify-between bg-[#FEE2E2] rounded-lg px-4 py-2.5">
                    <span className="text-sm text-[#7F1D1D]">{farm.name} - possible water stress, check irrigation</span>
                    <Badge className="bg-white text-[#DC2626] border-0 shrink-0">NDVI {farm.ndvi.toFixed(2)}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Side detail panel */}
        <Card className="p-5 shadow-none border border-[#E2E8F0] h-fit">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-black">Farm Detail</span>
            <Badge className={`${HEALTH_STYLES[selectedFarm.health].badge} border-0`}>
              {HEALTH_STYLES[selectedFarm.health].label}
            </Badge>
          </div>

          <p className="text-lg font-bold text-black">{selectedFarm.name}</p>

          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-[#475569]">
              <User2 className="h-4 w-4 text-[#94A3B8]" />
              Lead Farmer: <span className="text-black font-medium">{selectedFarm.leadFarmer}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#475569]">
              <MapPin className="h-4 w-4 text-[#94A3B8]" />
              {selectedFarm.district}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#475569]">
              <CalendarClock className="h-4 w-4 text-[#94A3B8]" />
              Last image: <span className="text-black font-medium">{selectedFarm.lastImageDate}</span>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-[#475569]">NDVI Score</span>
              <span className="font-semibold text-black">{selectedFarm.ndvi.toFixed(2)}</span>
            </div>
            <div className="h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${selectedFarm.ndvi * 100}%`, backgroundColor: HEALTH_STYLES[selectedFarm.health].dot }}
              />
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#E2E8F0]">
            <p className="text-sm font-semibold text-black mb-2">View History</p>
            <input
              type="range"
              min={0}
              max={SNAPSHOT_DATES.length - 1}
              value={snapshotIdx}
              onChange={(e) => setSnapshotIdx(Number(e.target.value))}
              className="w-full accent-[#4A8D34] cursor-pointer"
            />
            <p className="text-xs text-[#64748B] mt-1">Snapshot: {SNAPSHOT_DATES[snapshotIdx]}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}