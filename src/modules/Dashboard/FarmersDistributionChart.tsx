"use client"
import PieChart from "@/components/charts/PieChart"
import { Card } from "@/components/ui/card"

interface DistributionCardProps {
  title: string
  items: { label: string; count: number; color: string }[]
}

function DistributionCard({ title, items }: DistributionCardProps) {
  const series = items.map((item) => item.count)
  const colors = items.map((item) => item.color)
  const labels = items.map((item) => item.label)

  return (
    <Card className="w-full p-5 shadow-none border border-[#E2E8F0]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm text-black">{title}</h3>
        <span className="text-xs text-[#94A3B8]">Farmers</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="w-[110px] shrink-0">
          <PieChart series={series} colors={colors} labels={labels} height={110} showTotal={false} />
        </div>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <div>
                <p className="text-xs text-[#94A3B8]">{item.label}</p>
                <p className="text-sm font-bold text-black">{item.count.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default function FarmersDistributionChart({ data }: { data: any }) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <DistributionCard
        title="Gender Distribution"
        items={[
          { label: "Males", count: data?.gender?.male || 0, color: "#00B3DB" },
          { label: "Females", count: data?.gender?.female || 0, color: "#0F766E" },
        ]}
      />
      <DistributionCard
        title="Distribution by Farmer Type"
        items={[
          { label: "Smallholder Farmer", count: data?.farmer_type?.smallholder_farmer || 0, color: "#8B7CF6" },
          { label: "Lead Farmers", count: data?.farmer_type?.lead_farmer || 0, color: "#E2E8F0" },
        ]}
      />
    </div>
  )
}
