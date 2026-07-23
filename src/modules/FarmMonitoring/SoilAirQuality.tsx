"use client"
import { useState } from "react"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wind, Droplet, FlaskConical, AlertTriangle, TrendingUp, Search } from "lucide-react"
import PlaceholderNotice from "./PlaceholderNotice"
import { MONITORED_FARMS } from "./farmMonitoringData"

type AqiCategory = "Good" | "Moderate" | "Unhealthy"

// PLACEHOLDER: illustrative per-farm Google Soil & Air Quality API data -
// swap for a real SoilAirQualityRecord query (ENV-01..ENV-05) once the
// Google API integration exists.
interface FarmSoilAir {
  farmId: number
  aqi: number
  aqiCategory: AqiCategory
  soilPh: string
  moisture: string
  recommendation?: string
  // sparkline points, 0-100 scale, illustrative 30-day AQI trend
  trend: number[]
}

const FARM_SOIL_AIR: FarmSoilAir[] = [
  { farmId: 1, aqi: 42, aqiCategory: "Good", soilPh: "6.4", moisture: "38%", trend: [30, 34, 28, 40, 35, 38, 42] },
  { farmId: 2, aqi: 78, aqiCategory: "Moderate", soilPh: "6.1", moisture: "31%", trend: [50, 55, 60, 58, 65, 70, 78] },
  { farmId: 3, aqi: 158, aqiCategory: "Unhealthy", soilPh: "5.4", moisture: "19%", recommendation: "Poor air quality detected - consider postponing pesticide application", trend: [90, 100, 120, 110, 140, 150, 158] },
  { farmId: 4, aqi: 35, aqiCategory: "Good", soilPh: "6.6", moisture: "42%", trend: [28, 30, 25, 33, 30, 32, 35] },
  { farmId: 5, aqi: 95, aqiCategory: "Moderate", soilPh: "5.9", moisture: "27%", trend: [60, 65, 70, 68, 80, 88, 95] },
]

const AQI_STYLES: Record<AqiCategory, string> = {
  Good: "bg-[#D1FAE5] text-[#059669]",
  Moderate: "bg-[#FEF3C7] text-[#D97706]",
  Unhealthy: "bg-[#FEE2E2] text-[#DC2626]",
}

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const w = 100
  const h = 32
  const step = w / (points.length - 1)
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - ((p - min) / range) * h}`)
    .join(" ")

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SoilAirQuality() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const thresholdAlerts = FARM_SOIL_AIR.filter((f) => f.recommendation)
  const filteredFarms = MONITORED_FARMS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageTitle title="Soil & Air Quality Dashboard" />
      <PlaceholderNotice text="Soil and air quality readings shown here are illustrative - no live Google Soil & Air Quality API connection exists yet." />

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search farms..."
          className="w-full text-sm border border-[#E2E8F0] rounded-sm pl-9 pr-3 py-2.5 outline-none focus:border-[#4A8D34]"
        />
      </div>

      {thresholdAlerts.length > 0 && (
        <Card className="p-5 shadow-none border border-[#FCA5A5] bg-[#FEF2F2] mb-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-[#DC2626]" />
            <span className="text-sm font-semibold text-black">Threshold Alerts</span>
          </div>
          <div className="flex flex-col gap-2">
            {thresholdAlerts.map((f) => {
              const farm = MONITORED_FARMS.find((m) => m.id === f.farmId)!
              return (
                <div key={f.farmId} className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5">
                  <span className="text-sm text-black">
                    <span className="font-medium">{farm.name}</span> - {f.recommendation}
                  </span>
                  <Badge className="bg-[#FEE2E2] text-[#DC2626] border-0 shrink-0">AQI {f.aqi}</Badge>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredFarms.map((farm) => {
          const s = FARM_SOIL_AIR.find((f) => f.farmId === farm.id)!
          const isExpanded = expandedId === farm.id
          const trendColor = s.aqiCategory === "Good" ? "#059669" : s.aqiCategory === "Moderate" ? "#D97706" : "#DC2626"

          return (
            <Card key={farm.id} className="p-5 shadow-none border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-black truncate pr-2">{farm.name}</p>
                <Badge className={`${AQI_STYLES[s.aqiCategory]} border-0 shrink-0`}>{s.aqiCategory}</Badge>
              </div>
              <p className="text-xs text-[#64748B] mb-4">{farm.district}</p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-1.5 flex items-center justify-center bg-[#EDE9FE] shrink-0">
                    <Wind className="h-3.5 w-3.5 text-[#7C3AED]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#94A3B8] leading-tight">AQI</p>
                    <p className="text-sm font-semibold text-black leading-tight">{s.aqi}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-1.5 flex items-center justify-center bg-[#CFFAFE] shrink-0">
                    <Droplet className="h-3.5 w-3.5 text-[#0891B2]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#94A3B8] leading-tight">Moisture</p>
                    <p className="text-sm font-semibold text-black leading-tight">{s.moisture}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-1.5 flex items-center justify-center bg-[#FEF3C7] shrink-0">
                    <FlaskConical className="h-3.5 w-3.5 text-[#D97706]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#94A3B8] leading-tight">Soil pH</p>
                    <p className="text-sm font-semibold text-black leading-tight">{s.soilPh}</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : farm.id)}
                className="flex items-center gap-1.5 text-xs font-medium text-[#4A8D34] cursor-pointer"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                {isExpanded ? "Hide 30-day trend" : "View 30-day trend"}
              </button>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
                  <Sparkline points={s.trend} color={trendColor} />
                  <p className="text-[10px] text-[#94A3B8] mt-1">AQI trend, last 30 days</p>
                </div>
              )}
            </Card>
          )
        })}
        {filteredFarms.length === 0 && (
          <p className="text-sm text-[#64748B] text-center py-10 col-span-full">No farms match your search.</p>
        )}
      </div>
    </div>
  )
}