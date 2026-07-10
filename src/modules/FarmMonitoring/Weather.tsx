"use client"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { CloudSun, Droplets, CloudRain, Wind } from "lucide-react"
import PlaceholderNotice from "./PlaceholderNotice"

interface WeatherStatConfig {
  label: string
  value: string
  icon: React.ElementType
  bg: string
  fg: string
}

// PLACEHOLDER: no weather API is wired up yet - swap this array out for a
// real forecast once one is connected (e.g. OpenWeatherMap, a farm-station
// feed, etc).
const WEATHER_STATS: WeatherStatConfig[] = [
  { label: "Temperature", value: "28°C", icon: CloudSun, bg: "#FEF3C7", fg: "#D97706" },
  { label: "Humidity", value: "64%", icon: Droplets, bg: "#CFFAFE", fg: "#0891B2" },
  { label: "Rainfall (24h)", value: "12mm", icon: CloudRain, bg: "#DBEAFE", fg: "#2563EB" },
  { label: "Wind Speed", value: "9 km/h", icon: Wind, bg: "#D1FAE5", fg: "#059669" },
]

export default function Weather() {
  return (
    <div>
      <PageTitle title="Weather" />
      <PlaceholderNotice text="Weather data shown here is illustrative - no live weather source is connected yet." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {WEATHER_STATS.map((stat) => (
          <Card key={stat.label} className="p-5 shadow-none border border-[#E2E8F0]">
            <div className="flex items-start justify-between">
              <span className="text-sm text-[#475569] font-medium">{stat.label}</span>
              <div className="rounded-full p-2.5 flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.fg }} />
              </div>
            </div>
            <p className="text-3xl font-bold text-black mt-3">{stat.value}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
