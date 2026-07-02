"use client"
import PieChart from "@/components/charts/PieChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FarmersDistributionChart({data}:{data: any}) {

  const genderData = [
    { gender: "Male", count: data?.gender?.male || 0, color: "#00B3DB" },
    { gender: "Female", count: data?.gender?.female || 0, color: "#F05125" },
  ]
  const farmersTypeData = [
    { gender: "Lead Farmer", count: data?.farmer_type?.lead_farmer || 0, color: "#FFC803" },
    { gender: "Smallholder Farmer", count: data?.farmer_type?.smallholder_farmer || 0, color: "#1DAB4B" },
  ]

  const series = genderData.map((item) => item.count)
  const colors = genderData.map((item) => item.color)
  const labels = genderData.map((item) => item.gender)

  const series2 = farmersTypeData.map((item) => item.count)
  const colors2 = farmersTypeData.map((item) => item.color)
  const labels2 = farmersTypeData.map((item) => item.gender)


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
      <Card className="w-full  mx-auto">
        <CardHeader className="pb-2">
          <CardTitle className=" font-medium text-green-700 mb-3">Gender Distribution Of Farmers</CardTitle>
          <hr className="border-b-0"/>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2">
              <PieChart series={series} colors={colors} labels={labels}/>
            </div>
            <div className="w-full md:w-1/2 space-y-6 mt-4 md:mt-0 flex justify-center">
              <div className="space-y-10">
                {genderData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1 h-8 mr-4" style={{ backgroundColor: item.color }}></div>
                    <div>
                      <p className="text-gray-600">{item.gender}</p>
                      <p className="text-lg font-bold">{item.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full  mx-auto">
        <CardHeader className="pb-2">
          <CardTitle className="font-medium text-green-700 mb-3">Distribution By Farmer Type</CardTitle>
          <hr className="border-b-0"/>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2">
              <PieChart series={series2} colors={colors2} labels={labels2}/>
            </div>
            <div className="w-full md:w-1/2 space-y-6 mt-4 md:mt-0 flex justify-center">
              <div className="space-y-10">
                {farmersTypeData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1 h-8 mr-4" style={{ backgroundColor: item.color }}></div>
                    <div>
                      <p className="text-gray-600">{item.gender}</p>
                      <p className="text-lg font-bold">{item.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
