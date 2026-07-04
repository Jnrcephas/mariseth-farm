"use client"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { commaSeparator } from "@/lib/helpers"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

// NOTE: there is currently no revenue/finance endpoint in the API
// (see src/apis/adminApiComponents.ts - no such hook exists yet). Per request,
// this uses illustrative placeholder numbers so the chart looks right while
// the design is being reviewed. SWAP THIS OUT for real API data before this
// ships to real users - a chart showing made-up revenue figures to an actual
// farm manager would be actively misleading. Search for "monthlyData" to
// find this again once a real endpoint exists.
const monthlyData = [
  { month: "Jul", revenue: 140 },
  { month: "Aug", revenue: 430 },
  { month: "Sep", revenue: 320 },
  { month: "Oct", revenue: 690 },
  { month: "Nov", revenue: 395 },
  { month: "Dec", revenue: 590 },
  { month: "Jan", revenue: 660 },
]

export default function MonthlyRevenueBarChart() {
  const months = monthlyData.map((item) => item.month)
  const revenues = monthlyData.map((item) => item.revenue)
  const series = [{ name: "Revenue", data: revenues }]

  const options = {
    chart: {
      type: "area",
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#4A8D34"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100],
        colorStops: [
          { offset: 0, color: "#4A8D34", opacity: 0.45 },
          { offset: 100, color: "#4A8D34", opacity: 0.02 },
        ],
      },
    },
    colors: ["#4A8D34"],
    xaxis: {
      categories: months,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#94A3B8", fontSize: "12px" } },
    },
    yaxis: {
      labels: {
        formatter: (value: any) => commaSeparator(value),
        style: { colors: "#94A3B8", fontSize: "12px" },
      },
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      y: {
        formatter: (value: any) => (value ? `GHS ${value.toLocaleString()}` : "No data"),
      },
    },
  }

  return (
    <Card className="w-full h-full shadow-none border border-[#E2E8F0]">
      <CardHeader className="pb-0">
        <CardTitle className="font-semibold text-base text-black">Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        {typeof window !== "undefined" && (
          <ReactApexChart options={options as any} series={series} type="area" height={320} />
        )}
      </CardContent>
    </Card>
  )
}
