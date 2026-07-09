'use client';
import PageTitle from "@/components/layouts/PageTitle";
import MetricsCard from "@/modules/Dashboard/MetricsCard";
import FarmersDistributionChart from "@/modules/Dashboard/FarmersDistributionChart";
import MonthlyRevenueBarChart from "@/modules/Dashboard/MonthlyRevenueBarChart";
import { useDashboardFarmerAnalysis } from "@/apis/adminApiComponents";
import SuspenseWrapper from "@/components/SuspenseWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import ReportsQuickActions from "./ReportsQuickActions";

// PLACEHOLDER PAGE: there's no dedicated "reports and analysis" backend
// endpoint yet (checked src/apis/adminApiComponents.ts - nothing named
// report/analysis exists). Rather than ship an empty shell, this reuses the
// same real farmer/warehouse stats and chart components the Dashboard
// already has, so the page has real content today and matches the
// Dashboard's visual language. Once the actual reports this page should
// show are defined, swap the data source (`useDashboardFarmerAnalysis`
// below) and the quick-action destinations (see ReportsQuickActions.tsx)
// for the real thing.
export default function ReportsAndAnalysis() {
    const { data, isLoading } = useDashboardFarmerAnalysis({})

    return (
        <div className="flex flex-col gap-2 w-full">
            <PageTitle title="Reports and analysis" />
            <MetricsCard data={data} />
            <ReportsQuickActions />
            <SuspenseWrapper
                isLoading={isLoading}
                skeleton={
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
                        <Skeleton className="h-[400px] w-full bg-[#D2D6DC] border lg:col-span-2" />
                        <div className="flex flex-col gap-4">
                            <Skeleton className="h-[192px] w-full bg-[#D2D6DC] border" />
                            <Skeleton className="h-[192px] w-full bg-[#D2D6DC] border" />
                        </div>
                    </div>
                }
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
                    <div className="lg:col-span-2">
                        <MonthlyRevenueBarChart />
                    </div>
                    <FarmersDistributionChart data={data} />
                </div>
            </SuspenseWrapper>
        </div>
    )
}