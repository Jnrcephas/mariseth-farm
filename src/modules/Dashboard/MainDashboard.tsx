'use client';
import { AnimatePresence, motion} from "framer-motion";
import MetricsCard from "./MetricsCard";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react";
import { Calendar } from "lucide-react";
import FarmersDistributionChart from "./FarmersDistributionChart";
// import MonthlyRevenueBarChart from "./MonthlyRevenueBarChart";
import { useDashboardFarmerAnalysis } from "@/apis/adminApiComponents";
import SuspenseWrapper from "@/components/SuspenseWrapper";
import { reportDuration } from "./utils/constants";
import { Skeleton } from "@/components/ui/skeleton";

export default function MainDashboard(){
    const [dateFilter, setDateFilter] = useState<any>({label: "All Time"})

    const {data, isLoading} = useDashboardFarmerAnalysis({queryParams: dateFilter as any})

    function handleFilter(dateFilter: any){
        if(dateFilter?.value){
            const startDate = dateFilter?.value?.split("~")[0]
            const endDate = dateFilter?.value?.split("~")[1]
            setDateFilter({ label: dateFilter?.label, start_date: startDate, end_date: endDate })
        }else{
            setDateFilter({ label: dateFilter?.label })
        }
    }

    return(
        
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.9 }}
                className="flex flex-col overflow-auto gap-2 w-full"
            >
                <div className="mb-2">
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="bg-white border-gray-200 text-gray-800 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-green-600" />
                        {dateFilter.label}
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-2"
                        >
                            <path
                            d="M2.5 4.5L6 8L9.5 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            />
                        </svg>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {reportDuration.map((item, idx) => (
                            <DropdownMenuItem  key={idx} onClick={() => handleFilter(item)}>{item?.label}</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <MetricsCard data={data}/>
                <SuspenseWrapper isLoading={isLoading}
                    skeleton={
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
                                <Skeleton className="h-[370px] w-full bg-[#D2D6DC] border" />
                                <Skeleton className="h-[370px] w-full bg-[#D2D6DC] border" />
                             </div>
                             <Skeleton className="h-[370px] w-full bg-[#D2D6DC] border mt-5" />
                        </div>
                    }>
                    <div>
                        <div className="mt-5">
                            <FarmersDistributionChart data={data}/>
                        </div>
                        {/* <div className="mt-5">
                            <MonthlyRevenueBarChart />
                        </div> */}
                    </div>
                </SuspenseWrapper>
            </motion.div>
        </AnimatePresence>
        
    )
}