"use client"
import dynamic from "next/dynamic"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

type ICharts = {
    series: any[], 
    colors: string[], 
    labels:string[]
}

export default function PieChart({series, colors, labels}:ICharts){
    const options = {
        chart: {
          type: "donut",
          fontFamily: "Inter, sans-serif",
        },
        colors: colors,
        labels: labels,
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
            pie: {
              donut: {
                size: "60%",
                background: "#f8f9fa",
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: 'Total',
                  }
                }
              },
              customScale: 1,
              offsetY: 0,
            },
          },
          stroke: {
            show: true,
            width: 8,
            colors: ["#f8f9fa"],
            lineCap: "butt",
            curve: 'smooth',

        },
        legend: {
          show: false,
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: (val: any) => `${val} farmers`,
          },
        },
    }
    return(
        <div>
            {typeof window !== "undefined" && (
              <ReactApexChart options={options as any} series={series} type="donut" height={300} />
            )}

        </div>
    )
}