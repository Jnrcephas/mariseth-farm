"use client"
import PageTitle from "@/components/layouts/PageTitle"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bug } from "lucide-react"
import PlaceholderNotice from "./PlaceholderNotice"

interface PestDiseaseConfig {
  name: string
  type: "Pest" | "Disease"
  location: string
  risk: "High" | "Medium" | "Low"
}

// PLACEHOLDER: no pest/disease detection service is wired up yet - swap
// this list out for a real feed once one exists.
const PEST_DISEASE_REPORTS: PestDiseaseConfig[] = [
  { name: "Fall Armyworm", type: "Pest", location: "Kumbungu District", risk: "High" },
  { name: "Leaf Blight", type: "Disease", location: "Sawla-Tuna-Kalba District", risk: "Medium" },
  { name: "Aphids", type: "Pest", location: "Sawla-Tuna-Kalba District", risk: "Low" },
]

const RISK_STYLES: Record<PestDiseaseConfig["risk"], string> = {
  High: "bg-[#FEE2E2] text-[#DC2626]",
  Medium: "bg-[#FEF3C7] text-[#D97706]",
  Low: "bg-[#D1FAE5] text-[#059669]",
}

export default function PestDisease() {
  return (
    <div>
      <PageTitle title="Pest & Disease" />
      <PlaceholderNotice text="These reports are illustrative - no live pest/disease detection service is connected yet." />
      <div className="flex flex-col gap-3">
        {PEST_DISEASE_REPORTS.map((report, idx) => (
          <Card key={idx} className="p-5 shadow-none border border-[#E2E8F0]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full p-2.5 flex items-center justify-center bg-[#FEE2E2] shrink-0">
                  <Bug className="h-5 w-5 text-[#DC2626]" />
                </div>
                <div>
                  <p className="font-semibold text-black">{report.name}</p>
                  <p className="text-sm text-[#64748B] mt-0.5">{report.type} • {report.location}</p>
                </div>
              </div>
              <Badge className={`${RISK_STYLES[report.risk]} border-0 shrink-0`}>{report.risk} Risk</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
