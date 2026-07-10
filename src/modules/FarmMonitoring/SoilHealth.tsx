"use client"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Droplet, FlaskConical, Sprout, Thermometer } from "lucide-react"
import PlaceholderNotice from "./PlaceholderNotice"

interface SoilStatConfig {
  label: string
  value: string
  icon: React.ElementType
  bg: string
  fg: string
}

// PLACEHOLDER: no soil-sensor feed is wired up yet - swap this array out
// for real readings once one exists.
const SOIL_STATS: SoilStatConfig[] = [
  { label: "Soil pH", value: "6.4", icon: FlaskConical, bg: "#EDE9FE", fg: "#7C3AED" },
  { label: "Moisture", value: "38%", icon: Droplet, bg: "#CFFAFE", fg: "#0891B2" },
  { label: "Nitrogen Level", value: "Moderate", icon: Sprout, bg: "#D1FAE5", fg: "#059669" },
  { label: "Soil Temperature", value: "24°C", icon: Thermometer, bg: "#FEF3C7", fg: "#D97706" },
]

export default function SoilHealth() {
  return (
    <div>
      <PageTitle title="Soil Health" />
      <PlaceholderNotice text="Soil readings shown here are illustrative - no live soil-sensor feed is connected yet." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SOIL_STATS.map((stat) => (
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
