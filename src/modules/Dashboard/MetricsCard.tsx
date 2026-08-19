"use client"

import { Card } from "@/components/ui/card"
import { Users, UserRound, Package, TrendingUp, TrendingDown, LineChart } from "lucide-react"

interface MetricCardConfig {
  label: string
  value: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  trend?: { direction: "up" | "down"; label: string }
}

export default function MetricsCard({ data, totalFarms }: { data: any; totalFarms?: number }) {
  // NOTE: `trend` values are still illustrative placeholders for design
  // review - there is no trend/delta field in the dashboard analysis or
  // total-farms APIs yet (checked src/apis/adminApiComponents.ts). SWAP
  // THESE OUT for real numbers once that data exists; showing made-up
  // percentages to a real user would be misleading. The 4 count values
  // (Lead Farmers, Smallholder Farmers, Active Warehouses, Farms) below
  // ARE real, wired to the API.
  const metrics: MetricCardConfig[] = [
    {
      label: "Lead Farmers",
      value: (data?.lead_farmers || 0).toLocaleString(),
      icon: UserRound,
      iconBg: "#EDE9FE",
      iconColor: "#7C3AED",
      // trend: { direction: "up", label: "8.5% Up from yesterday" },
    },
    {
      label: "Smallholder Farmers",
      value: (data?.smallholder_farmers || 0).toLocaleString(),
      icon: Users,
      iconBg: "#CFFAFE",
      iconColor: "#0891B2",
      // trend: { direction: "down", label: "4.3% Down from yesterday" },
    },
    {
      label: "Active Warehouses",
      value: (data?.active_warehouses || 0).toLocaleString(),
      icon: Package,
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
      // trend: { direction: "up", label: "1.3% Up from past week" },
    },
    {
      label: "Farms",
      value: (totalFarms || 0).toLocaleString(),
      icon: LineChart,
      iconBg: "#D1FAE5",
      iconColor: "#059669",
      // trend: { direction: "down", label: "4.3% Down from yesterday" },
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="p-5 shadow-none border border-[#E2E8F0]">
          <div className="flex items-start justify-between">
            <span className="text-sm text-[#475569] font-medium">{metric.label}</span>
            <div
              className="rounded-full p-2.5 flex items-center justify-center"
              style={{ backgroundColor: metric.iconBg }}
            >
              <metric.icon className="h-5 w-5" style={{ color: metric.iconColor }} />
            </div>
          </div>
          <p className="text-3xl font-bold text-black mt-3">{metric.value}</p>
          {metric.trend && (
            <div className="flex items-center gap-1 mt-2 text-xs">
              {metric.trend.direction === "up" ? (
                <TrendingUp className="h-3.5 w-3.5 text-[#16A34A]" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-[#DC2626]" />
              )}
              <span className={metric.trend.direction === "up" ? "text-[#16A34A] font-semibold" : "text-[#DC2626] font-semibold"}>
                {metric.trend.label.split(" ")[0]}
              </span>
              <span className="text-[#94A3B8]">{metric.trend.label.split(" ").slice(1).join(" ")}</span>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
