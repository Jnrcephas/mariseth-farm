"use client"
import { useState } from "react"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CloudSun, Droplets, CloudRain, Wind, AlertTriangle, Search } from "lucide-react"
import PlaceholderNotice from "./PlaceholderNotice"
import { MONITORED_FARMS } from "./farmMonitoringData"

// PLACEHOLDER: illustrative per-farm 7-day forecast summary - swap for a
// real WeatherForecast query (WTH-01..WTH-06) once a weather API
// (OpenWeatherMap, Tomorrow.io, etc.) is connected.
interface FarmWeather {
  farmId: number
  temperature: string
  humidity: string
  rainfall: string
  wind: string
  severeAlert?: string
}

const FARM_WEATHER: FarmWeather[] = [
  { farmId: 1, temperature: "28°C", humidity: "64%", rainfall: "12mm", wind: "9 km/h" },
  { farmId: 2, temperature: "27°C", humidity: "71%", rainfall: "38mm", wind: "14 km/h", severeAlert: "Heavy rainfall forecast in next 24h" },
  { farmId: 3, temperature: "31°C", humidity: "48%", rainfall: "0mm", wind: "6 km/h" },
  { farmId: 4, temperature: "29°C", humidity: "58%", rainfall: "4mm", wind: "11 km/h" },
  { farmId: 5, temperature: "22°C", humidity: "80%", rainfall: "2mm", wind: "19 km/h", severeAlert: "Frost warning overnight" },
]

const MINI_STATS = [
  { key: "temperature" as const, label: "Temp", icon: CloudSun, bg: "#FEF3C7", fg: "#D97706" },
  { key: "humidity" as const, label: "Humidity", icon: Droplets, bg: "#CFFAFE", fg: "#0891B2" },
  { key: "rainfall" as const, label: "Rain (24h)", icon: CloudRain, bg: "#DBEAFE", fg: "#2563EB" },
  { key: "wind" as const, label: "Wind", icon: Wind, bg: "#D1FAE5", fg: "#059669" },
]

export default function Weather() {
  const [search, setSearch] = useState("")
  const severeAlerts = FARM_WEATHER.filter((w) => w.severeAlert)
  const filteredFarms = MONITORED_FARMS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageTitle title="Weather Dashboard" />
      <PlaceholderNotice text="Weather data shown here is illustrative - no live weather source (e.g. OpenWeatherMap, Tomorrow.io) is connected yet." />

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

      {severeAlerts.length > 0 && (
        <Card className="p-5 shadow-none border border-[#FCA5A5] bg-[#FEF2F2] mb-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-[#DC2626]" />
            <span className="text-sm font-semibold text-black">Severe Weather Alerts</span>
          </div>
          <div className="flex flex-col gap-2">
            {severeAlerts.map((w) => {
              const farm = MONITORED_FARMS.find((f) => f.id === w.farmId)!
              return (
                <div key={w.farmId} className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5">
                  <span className="text-sm text-black">
                    <span className="font-medium">{farm.name}</span> - {w.severeAlert}
                  </span>
                  <Badge className="bg-[#FEE2E2] text-[#DC2626] border-0 shrink-0">Severe</Badge>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredFarms.map((farm) => {
          const w = FARM_WEATHER.find((f) => f.farmId === farm.id)!
          return (
            <Card key={farm.id} className="p-5 shadow-none border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-black truncate pr-2">{farm.name}</p>
                {w.severeAlert && <span className="h-2 w-2 rounded-full bg-[#DC2626] shrink-0" />}
              </div>
              <p className="text-xs text-[#64748B] mb-4">{farm.district}</p>
              <div className="grid grid-cols-2 gap-3">
                {MINI_STATS.map((stat) => (
                  <div key={stat.key} className="flex items-center gap-2">
                    <div className="rounded-full p-1.5 flex items-center justify-center shrink-0" style={{ backgroundColor: stat.bg }}>
                      <stat.icon className="h-3.5 w-3.5" style={{ color: stat.fg }} />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#94A3B8] leading-tight">{stat.label}</p>
                      <p className="text-sm font-semibold text-black leading-tight">{w[stat.key]}</p>
                    </div>
                  </div>
                ))}
              </div>
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