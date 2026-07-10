"use client"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Info } from "lucide-react"
import PlaceholderNotice from "./PlaceholderNotice"

interface FarmAlertConfig {
  title: string
  location: string
  severity: "High" | "Medium" | "Low"
  time: string
}

// PLACEHOLDER: no sensor/IoT feed is wired up yet - swap this list out for
// a real alerts endpoint once one exists.
const FARM_ALERTS: FarmAlertConfig[] = [
  { title: "Low soil moisture detected", location: "Zuwera Iddrisu Farm - Kumbungu District", severity: "High", time: "2 hours ago" },
  { title: "Unusually high humidity", location: "Zorwee Yewaazun Farm - Sawla-Tuna-Kalba District", severity: "Medium", time: "5 hours ago" },
  { title: "Irrigation schedule due", location: "Zien Gbolo Farm - Sawla-Tuna-Kalba District", severity: "Low", time: "1 day ago" },
]

const SEVERITY_STYLES: Record<FarmAlertConfig["severity"], { icon: React.ElementType; bg: string; fg: string; badge: string }> = {
  High: { icon: AlertTriangle, bg: "#FEE2E2", fg: "#DC2626", badge: "bg-[#FEE2E2] text-[#DC2626]" },
  Medium: { icon: AlertCircle, bg: "#FEF3C7", fg: "#D97706", badge: "bg-[#FEF3C7] text-[#D97706]" },
  Low: { icon: Info, bg: "#DBEAFE", fg: "#2563EB", badge: "bg-[#DBEAFE] text-[#2563EB]" },
}

export default function FarmAlerts() {
  return (
    <div>
      <PageTitle title="Farm Alerts" />
      <PlaceholderNotice text="These alerts are illustrative - no live sensor/IoT feed is connected yet." />
      <div className="flex flex-col gap-3">
        {FARM_ALERTS.map((alert, idx) => {
          const style = SEVERITY_STYLES[alert.severity]
          const Icon = style.icon
          return (
            <Card key={idx} className="p-5 shadow-none border border-[#E2E8F0]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2.5 flex items-center justify-center shrink-0" style={{ backgroundColor: style.bg }}>
                    <Icon className="h-5 w-5" style={{ color: style.fg }} />
                  </div>
                  <div>
                    <p className="font-semibold text-black">{alert.title}</p>
                    <p className="text-sm text-[#64748B] mt-0.5">{alert.location}</p>
                    <p className="text-xs text-[#94A3B8] mt-1">{alert.time}</p>
                  </div>
                </div>
                <Badge className={`${style.badge} border-0 shrink-0`}>{alert.severity}</Badge>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
