"use client"
import { commaSeparator } from "@/lib/helpers"
import dynamic from "next/dynamic"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

type ICharts = {
    series: any[], 
    colors: string[], 
    categories:string[]
}

export default function BarChart({series, colors, categories}:ICharts){
    const options = {
        chart: {
          type: "bar",
          fontFamily: "Inter, sans-serif",
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: "60%",
            colors: {
              ranges: [
                {
                  from: 0,
                  to: Number.POSITIVE_INFINITY,
                  color: "#4A8D34",
                },
              ],
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: colors,
        xaxis: {
          categories: categories,
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            style: {
              colors: "#6B7280",
              fontSize: "12px",
            },
          },
        },
        yaxis: {
          labels: {
            formatter: (value: any) => {
              return `GHS ${commaSeparator(value)}`
              
            },
            style: {
              colors: "#6B7280",
              fontSize: "12px",
            },
          },
        },
        grid: {
          show: false,
        },
        states: {
          hover: {
            filter: {
              type: "none",
            },
          },
          active: {
            filter: {
              type: "none",
            },
          },
        },
        tooltip: {
          y: {
            formatter: (value: any) => (value ? `GHS ${value.toLocaleString()}` : "No data"),
          },
        },
      }
    return(
        <div>
            {typeof window !== "undefined" && (
                <ReactApexChart
                    options={options as any}
                    series={series}
                    type="bar"
                    height={350}
                />
            )}
        </div>
    )
}