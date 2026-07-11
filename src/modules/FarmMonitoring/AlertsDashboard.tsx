"use client"
import { useState } from "react"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Satellite, Fence, CloudRain, FlaskConical } from "lucide-react"
import PlaceholderNotice from "./PlaceholderNotice"
import { cn } from "@/lib/utils"

type AlertType = "satellite" | "geo_fence" | "weather" | "soil_air"
type FilterKey = "all" | AlertType
type Severity = "High" | "Medium" | "Low"

interface AlertItem {
  id: number
  type: AlertType
  title: string
  location: string
  severity: Severity
  time: string
}

// PLACEHOLDER: illustrative combined feed - swap for a real query across
// SatelliteSnapshot, GeoFenceEvent, WeatherForecast, and
// SoilAirQualityRecord alert flags once those integrations exist.
const ALERTS: AlertItem[] = [
  { id: 1, type: "satellite", title: "Low NDVI - possible water stress", location: "Zien Gbolo Farm", severity: "High", time: "2 hours ago" },
  { id: 2, type: "geo_fence", title: "Tracked asset exited farm boundary", location: "Zorwee Yewaazun Farm", severity: "Medium", time: "4 hours ago" },
  { id: 3, type: "weather", title: "Heavy rainfall forecast (>40mm)", location: "Kumbungu District", severity: "High", time: "6 hours ago" },
  { id: 4, type: "soil_air", title: "Poor air quality detected", location: "Zuwera Iddrisu Farm", severity: "Medium", time: "1 day ago" },
  { id: 5, type: "weather", title: "Frost warning overnight", location: "Sawla-Tuna-Kalba District", severity: "Low", time: "1 day ago" },
  { id: 6, type: "satellite", title: "NDVI trending down over 2 weeks", location: "Zorwee Yewaazun Farm", severity: "Low", time: "2 days ago" },
]

const TYPE_META: Record<AlertType, { label: string; icon: React.ElementType; bg: string; fg: string }> = {
  satellite: { label: "Satellite", icon: Satellite, bg: "#EDE9FE", fg: "#7C3AED" },
  geo_fence: { label: "Geo-Fence", icon: Fence, bg: "#DBEAFE", fg: "#2563EB" },
  weather: { label: "Weather", icon: CloudRain, bg: "#FEF3C7", fg: "#D97706" },
  soil_air: { label: "Soil & Air Quality", icon: FlaskConical, bg: "#D1FAE5", fg: "#059669" },
}

const SEVERITY_BADGE: Record<Severity, string> = {
  High: "bg-[#FEE2E2] text-[#DC2626]",
  Medium: "bg-[#FEF3C7] text-[#D97706]",
  Low: "bg-[#DBEAFE] text-[#2563EB]",
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "satellite", label: "Satellite" },
  { key: "geo_fence", label: "Geo-Fence" },
  { key: "weather", label: "Weather" },
  { key: "soil_air", label: "Soil & Air Quality" },
]

export default function AlertsDashboard() {
  const [filter, setFilter] = useState<FilterKey>("all")

  const filtered = filter === "all" ? ALERTS : ALERTS.filter((a) => a.type === filter)

  return (
    <div>
      <PageTitle title="Alerts Dashboard" />
      <PlaceholderNotice text="This is an aggregate feed of illustrative alerts from Satellite, Geo-Fence, Weather, and Soil & Air Quality monitoring - no live sources are connected yet." />

      <div className="flex items-center gap-2 flex-wrap mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
              filter === f.key
                ? "bg-[#4A8D34] text-white"
                : "bg-[#E2E8F0] text-[#64748B] hover:bg-[#CBD5E1]"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((alert) => {
          const meta = TYPE_META[alert.type]
          const Icon = meta.icon
          return (
            <Card key={alert.id} className="p-5 shadow-none border border-[#E2E8F0]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2.5 flex items-center justify-center shrink-0" style={{ backgroundColor: meta.bg }}>
                    <Icon className="h-5 w-5" style={{ color: meta.fg }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-black">{alert.title}</p>
                      <Badge className="border-0 text-[10px] uppercase tracking-wide" style={{ backgroundColor: meta.bg, color: meta.fg }}>
                        {meta.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#64748B] mt-0.5">{alert.location}</p>
                    <p className="text-xs text-[#94A3B8] mt-1">{alert.time}</p>
                  </div>
                </div>
                <Badge className={`${SEVERITY_BADGE[alert.severity]} border-0 shrink-0`}>{alert.severity}</Badge>
              </div>
            </Card>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-[#64748B] text-center py-10">No alerts for this category.</p>
        )}
      </div>
    </div>
  )
}