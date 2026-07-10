"use client"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Leaf, TrendingUp, Ruler, Sun } from "lucide-react"
import PlaceholderNotice from "./PlaceholderNotice"

interface CropStatConfig {
  label: string
  value: string
  icon: React.ElementType
  bg: string
  fg: string
}

// PLACEHOLDER: no satellite/drone imagery or crop-sensor feed is wired up
// yet - swap this array out for real readings once one exists.
const CROP_STATS: CropStatConfig[] = [
  { label: "Vegetation Index (NDVI)", value: "0.71", icon: Leaf, bg: "#D1FAE5", fg: "#059669" },
  { label: "Growth Stage", value: "Flowering", icon: TrendingUp, bg: "#DBEAFE", fg: "#2563EB" },
  { label: "Average Crop Height", value: "1.2m", icon: Ruler, bg: "#EDE9FE", fg: "#7C3AED" },
  { label: "Sunlight Exposure", value: "7.5 hrs/day", icon: Sun, bg: "#FEF3C7", fg: "#D97706" },
]

export default function CropHealth() {
  return (
    <div>
      <PageTitle title="Crop Health" />
      <PlaceholderNotice text="Crop health data shown here is illustrative - no live satellite/drone or crop-sensor feed is connected yet." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CROP_STATS.map((stat) => (
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
