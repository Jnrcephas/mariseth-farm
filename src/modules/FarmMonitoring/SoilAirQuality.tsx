"use client"
import { useState } from "react"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Droplet, Thermometer, Loader2, Search } from "lucide-react"
import { useFarmManagementFarmList } from "@/apis/adminApiComponents"
import { useFarmSoilQuality } from "@/apis/useFarmSoilQuality"
import { kelvinToCelsius } from "@/apis/useFarmWeather"
import { formatDateReadable } from "@/lib/helpers"

const MINI_STATS = [
  { key: "moisture" as const, label: "Soil Moisture", icon: Droplet, bg: "#CFFAFE", fg: "#0891B2" },
  { key: "topsoil" as const, label: "Topsoil Temp", icon: Thermometer, bg: "#FEF3C7", fg: "#D97706" },
  { key: "subsoil" as const, label: "Subsoil Temp (10cm)", icon: Thermometer, bg: "#FEE2E2", fg: "#DC2626" },
]

function FarmSoilQualityCard({ farm }: { farm: any }) {
  const { data, isLoading, error } = useFarmSoilQuality({
    pathParams: { farm_id: farm.id },
  })

  if (isLoading) {
    return (
      <Card className="p-5 shadow-none border border-[#E2E8F0] flex items-center justify-center min-h-[168px]">
        <Loader2 className="h-5 w-5 animate-spin text-[#94A3B8]" />
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="p-5 shadow-none border border-[#E2E8F0]">
        <p className="text-sm font-semibold text-black truncate pr-2 mb-1">{farm.name}</p>
        <p className="text-xs text-[#64748B] mb-4">{farm?.district?.name || farm?.district}</p>
        <p className="text-xs text-[#DC2626]">No soil quality reading available for this farm yet.</p>
      </Card>
    )
  }

  const stats = {
    moisture: `${Math.round(data.moisture * 100)}%`,
    topsoil: `${Math.round(kelvinToCelsius(data.t0))}°C`,
    subsoil: `${Math.round(kelvinToCelsius(data.t10))}°C`,
  }

  return (
    <Card className="p-5 shadow-none border border-[#E2E8F0]">
      <p className="text-sm font-semibold text-black truncate pr-2 mb-1">{farm.name}</p>
      <p className="text-xs text-[#64748B] mb-4">{farm?.district?.name || farm?.district}</p>
      <div className="grid grid-cols-1 gap-3">
        {MINI_STATS.map((stat) => (
          <div key={stat.key} className="flex items-center gap-2">
            <div className="rounded-full p-1.5 flex items-center justify-center shrink-0" style={{ backgroundColor: stat.bg }}>
              <stat.icon className="h-3.5 w-3.5" style={{ color: stat.fg }} />
            </div>
            <div>
              <p className="text-[10px] text-[#94A3B8] leading-tight">{stat.label}</p>
              <p className="text-sm font-semibold text-black leading-tight">{stats[stat.key]}</p>
            </div>
          </div>
        ))}
      </div>
      {data.dt && (
        <p className="text-[10px] text-[#94A3B8] mt-3 pt-3 border-t border-[#E2E8F0]">
          Last reading {formatDateReadable(data.dt, "Do MMMM, YYYY - hh:mm A")}
        </p>
      )}
    </Card>
  )
}

export default function SoilAirQuality() {
  const [search, setSearch] = useState("")
  const { data: farmsData, isLoading } = useFarmManagementFarmList({
    queryParams: { page: 1, page_size: 100 } as any,
  })
  const farms = (farmsData?.results || []) as any[]
  const filteredFarms = farms.filter((f) =>
    String(f?.name || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageTitle title="Soil Quality Dashboard" />

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

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-[#94A3B8]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredFarms.map((farm) => (
              <FarmSoilQualityCard key={farm.id} farm={farm} />
            ))}
          </div>

          {farms.length === 0 && (
            <p className="text-sm text-[#64748B] text-center py-16">No farms found.</p>
          )}
          {farms.length > 0 && filteredFarms.length === 0 && (
            <p className="text-sm text-[#64748B] text-center py-16">No farms match your search.</p>
          )}
        </>
      )}
    </div>
  )
}
