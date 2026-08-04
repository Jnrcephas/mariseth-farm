"use client"
import { useState } from "react"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet, Thermometer, Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useFarmManagementFarmList } from "@/apis/adminApiComponents"
import { useFarmSoilQuality } from "@/apis/useFarmSoilQuality"
import { kelvinToCelsius } from "@/apis/useFarmWeather"
import { formatDateReadable, cleanJsonData } from "@/lib/helpers"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

// Farms are fetched a page at a time (server-side search + pagination) rather
// than all at once, because each card below fires its own soil_quality
// request - pulling in e.g. 100 farms client-side used to mean ~100
// simultaneous requests on page load. Keeping the page small keeps that bounded.
const FARMS_PAGE_SIZE = 12

const MINI_STATS = [
  { key: "moisture" as const, label: "Soil Moisture", icon: Droplet, bg: "#CFFAFE", fg: "#0891B2" },
  { key: "topsoil" as const, label: "Topsoil Temp", icon: Thermometer, bg: "#FEF3C7", fg: "#D97706" },
  { key: "subsoil" as const, label: "Subsoil Temp (10cm)", icon: Thermometer, bg: "#FEE2E2", fg: "#DC2626" },
]

// NOTE: soil quality is resolved purely off the farm id server-side (backend
// confirmed - it does not require a boundary to be set), so every farm is
// fetched here. Boundary is only relevant to the Geofencing/asset-tracking
// feature, not to weather/soil data.

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
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search, 300)

  const { data: farmsData, isLoading, isPlaceholderData } = useFarmManagementFarmList({
    // URLSearchParams stringifies `undefined` as the literal text "undefined",
    // so an empty `query` key must be stripped out entirely rather than set
    // to undefined - otherwise the backend searches for the literal string
    // "undefined" and returns no farms.
    queryParams: cleanJsonData({ page, page_size: FARMS_PAGE_SIZE, query: debouncedSearch }) as any,
    // Keep the previous page's farms on screen while the next page loads,
    // instead of unmounting every card (and re-firing every soil_quality
    // request) on each pagination/search change.
    placeholderData: (prev: any) => prev,
  } as any)

  const farms = (farmsData?.results || []) as any[]
  const pagination = farmsData?.pagination

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div>
      <PageTitle title="Soil Quality Dashboard" />

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
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
          <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
            {farms.map((farm) => (
              <FarmSoilQualityCard key={farm.id} farm={farm} />
            ))}
          </div>

          {farms.length === 0 && (
            <p className="text-sm text-[#64748B] text-center py-16">
              {search ? "No farms match your search." : "No farms found."}
            </p>
          )}

          {farms.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-[#64748B]">
                Page {pagination?.page || page} of {pagination?.pages || 1} · {pagination?.total ?? farms.length} farms
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="border"
                  disabled={!pagination?.has_previous || isPlaceholderData}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button
                  variant="ghost"
                  className="border"
                  disabled={!pagination?.has_next || isPlaceholderData}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}


// curl -X PUT "http://13.140.140.177:8000/api/v1/farm-management/farm/9259" \
//   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg4NDY0MDAwLCJpYXQiOjE3ODU4NzIwMDAsImp0aSI6ImI1YWE2MzFjNmQ2NzQwNWE5OGU1OTEzNGIxODE3NmEzIiwidXNlcl9pZCI6MTE2fQ.g7zZI89lIvQWmQhXF6E_ox9_ZXu_tFYRDZLg18JVIfA" \
//   -H "Content-Type: application/json" \
//   -d '{
//     "boundary": {
//       "type": "Polygon",
//       "coordinates": [[
//         [-2.6100, 7.4400],
//         [-2.5900, 7.4400],
//         [-2.5900, 7.4600],
//         [-2.6100, 7.4600],
//         [-2.6100, 7.4400]
//       ]]
//     }
//   }'