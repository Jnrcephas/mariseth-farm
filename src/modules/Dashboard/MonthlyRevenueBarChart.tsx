import BarChart from "@/components/charts/BarChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export default function MonthlyRevenueBarChart(){
    const monthlyData = [
        { month: "Jan", revenue: 0 },
        { month: "Feb", revenue: 0 },
        { month: "Mar", revenue: 0 },
        { month: "Apr", revenue: 0 },
        { month: "May", revenue: 0 },
        { month: "Jun", revenue: 0 },
        { month: "Jul", revenue: 0 },
        { month: "Aug", revenue: 0 },
        { month: "Sep", revenue: 0 },
        { month: "Oct", revenue: 0 },
        { month: "Nov", revenue: 0 },
        { month: "Dec", revenue: 0 },
      ]
    
      const months = monthlyData.map((item) => item.month)
      const revenues = monthlyData.map((item) => item.revenue)
      const series = [{ name: "Revenue", data: revenues }]

    return(
        <Card className="w-full mx-auto">
            <CardHeader className="">
                <CardTitle className="font-medium text-green-700 mb-3">Monthly Revenue</CardTitle>
                <hr className="border-b-0"/>
            </CardHeader>
            <CardContent>
                <BarChart series={series} colors={["#4A8D34"]} categories={months} />
                
            </CardContent>
        </Card>
    )
}