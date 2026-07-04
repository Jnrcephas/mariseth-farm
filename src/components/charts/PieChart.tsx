"use client"
import dynamic from "next/dynamic"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

type ICharts = {
    series: any[], 
    colors: string[], 
    labels:string[],
    height?: number,
    showTotal?: boolean,
}

export default function PieChart({series, colors, labels, height = 300, showTotal = true}:ICharts){
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
                size: "65%",
                background: "#f8f9fa",
                labels: {
                  show: showTotal,
                  total: {
                    show: showTotal,
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
            width: 6,
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
              <ReactApexChart options={options as any} series={series} type="donut" height={height} />
            )}

        </div>
    )
}