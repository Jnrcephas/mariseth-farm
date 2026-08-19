"use client"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { commaSeparator } from "@/lib/helpers"
import { useDashboardFarmTrends } from "@/apis/adminApiComponents"
import { Skeleton } from "@/components/ui/skeleton"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function MonthlyFarmsAddedBarChart() {
  const { data, isLoading } = useDashboardFarmTrends({})

  const trend = data?.trend ?? []
  const months = trend.map((item) => item.month ?? "")
  const farmsAdded = trend.map((item) => item.count ?? 0)
  const series = [{ name: "Farms Added", data: farmsAdded }]

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
        formatter: (value: any) => (value !== null && value !== undefined ? `${value.toLocaleString()} farms` : "No data"),
      },
    },
  }

  return (
    <Card className="w-full h-full shadow-none border border-[#E2E8F0]">
      <CardHeader className="pb-0">
        <CardTitle className="font-semibold text-base text-black">
          Farms Added{data?.year ? ` (${data.year})` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[320px] w-full bg-[#D2D6DC] border" />
        ) : (
          typeof window !== "undefined" && (
            <ReactApexChart options={options as any} series={series} type="area" height={320} />
          )
        )}
      </CardContent>
    </Card>
  )
}
