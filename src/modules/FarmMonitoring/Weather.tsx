"use client"
import { useState } from "react"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CloudSun, Droplets, Cloud, Wind, MapPin, Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useFarmManagementFarmList } from "@/apis/adminApiComponents"
import { useFarmWeather, kelvinToCelsius, mpsToKph } from "@/apis/useFarmWeather"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

// Farms are fetched a page at a time (server-side search + pagination) rather
// than all at once, because each card below fires its own weather request -
// pulling in e.g. 100 farms client-side used to mean ~100 simultaneous
// requests on page load. Keeping the page small keeps that bounded.
const FARMS_PAGE_SIZE = 12

const MINI_STATS = [
  { key: "temperature" as const, label: "Temp", icon: CloudSun, bg: "#FEF3C7", fg: "#D97706" },
  { key: "humidity" as const, label: "Humidity", icon: Droplets, bg: "#CFFAFE", fg: "#0891B2" },
  { key: "clouds" as const, label: "Cloud Cover", icon: Cloud, bg: "#DBEAFE", fg: "#2563EB" },
  { key: "wind" as const, label: "Wind", icon: Wind, bg: "#D1FAE5", fg: "#059669" },
]

function NoBoundaryCard({ farm }: { farm: any }) {
  return (
    <Card className="p-5 shadow-none border border-[#E2E8F0]">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-black truncate pr-2">{farm.name}</p>
      </div>
      <p className="text-xs text-[#64748B] mb-4">{farm?.district?.name || farm?.district}</p>
      <div className="flex items-start gap-2 bg-[#FFFBEB] rounded-lg p-3">
        <MapPin className="h-4 w-4 text-[#D97706] shrink-0 mt-0.5" />
        <p className="text-xs text-[#92400E]">
          No boundary set for this farm yet. Edit the farm and mark its boundary on the map to start receiving weather data.
        </p>
      </div>
    </Card>
  )
}

function FarmWeatherCard({ farm }: { farm: any }) {
  const { data, isLoading, error } = useFarmWeather({
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
        <p className="text-xs text-[#DC2626]">Couldn&apos;t load weather for this farm right now.</p>
      </Card>
    )
  }

  const condition = data.weather?.[0]
  const stats = {
    temperature: `${Math.round(kelvinToCelsius(data.temp))}°C`,
    humidity: `${Math.round(data.humidity)}%`,
    clouds: `${Math.round(data.clouds)}%`,
    wind: `${Math.round(mpsToKph(data.wind_speed))} km/h`,
  }

  return (
    <Card className="p-5 shadow-none border border-[#E2E8F0]">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-black truncate pr-2">{farm.name}</p>
      </div>
      <p className="text-xs text-[#64748B] mb-4">{farm?.district?.name || farm?.district}</p>
      <div className="grid grid-cols-2 gap-3">
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
      {condition && (
        <div className="mt-3 flex items-center gap-2 bg-[#F8FAFC] rounded-lg px-3 py-2">
          <CloudSun className="h-3.5 w-3.5 text-[#64748B] shrink-0" />
          <span className="text-xs text-[#334155] capitalize">{condition.description}</span>
        </div>
      )}
    </Card>
  )
}

export default function Weather() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search, 300)

  const { data: farmsData, isLoading, isPlaceholderData } = useFarmManagementFarmList({
    queryParams: { page, page_size: FARMS_PAGE_SIZE, query: debouncedSearch || undefined } as any,
    // Keep the previous page's farms on screen while the next page loads,
    // instead of unmounting every card (and re-firing every weather
    // request) on each pagination/search change.
    placeholderData: (prev: any) => prev,
  } as any)

  const farms = (farmsData?.results || []) as any[]
  const farmsWithBoundary = farms.filter((f) => f.boundary)
  const farmsWithoutBoundary = farms.filter((f) => !f.boundary)
  const pagination = farmsData?.pagination

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div>
      <PageTitle title="Weather Dashboard" />

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
          {farmsWithoutBoundary.length > 0 && (
            <Card className="p-4 shadow-none border border-[#FDE68A] bg-[#FFFBEB] mb-5">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#D97706] shrink-0" />
                <span className="text-sm text-[#92400E]">
                  {farmsWithoutBoundary.length} farm{farmsWithoutBoundary.length !== 1 ? "s" : ""} without a boundary set won&apos;t show weather until one is added.
                </span>
              </div>
            </Card>
          )}

          <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}>
            {farmsWithBoundary.map((farm) => (
              <FarmWeatherCard key={farm.id} farm={farm} />
            ))}
            {farmsWithoutBoundary.map((farm) => (
              <NoBoundaryCard key={farm.id} farm={farm} />
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