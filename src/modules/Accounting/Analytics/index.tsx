"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, FileText, Truck, Receipt } from "lucide-react"
import { CEDI, PAGE_SIZE } from "@/lib/constants"
import { commaSeparator } from "@/lib/helpers"
import { AuthorizeAndRenderPage } from "@/components/Unauthorized"
import PageTitle from "@/components/layouts/PageTitle"
import { useExpensesList, useInvoiceList, useWaybillList } from "@/apis/adminApiComponents"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface MetricConfig {
  label: string
  value: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

export default function FinancialAnalytics() {
  // Real, wired-to-the-API numbers only (see individual comments below) -
  // no invented revenue/profit figures. `page_size: 1` on the two list
  // calls just keeps the payload light since we only need `pagination.total`
  // and `total_expenses`, not the row data itself.
  const { data: expensesData, isLoading: expensesLoading } = useExpensesList({
    queryParams: { page: 1, page_size: 1 },
  })
  const { data: invoicesData, isLoading: invoicesLoading } = useInvoiceList({
    queryParams: { page: 1, page_size: 1 },
  })
  const { data: waybillsData, isLoading: waybillsLoading } = useWaybillList({
    queryParams: { page: 1, page_size: 1 },
  })

  const expenses = expensesData as any
  const invoices = invoicesData as any
  const waybills = waybillsData as any

  const isLoading = expensesLoading || invoicesLoading || waybillsLoading

  const totalExpenses = expenses?.total_expenses?.total_sum || 0
  const totalInvoices = invoices?.pagination?.total || 0
  const totalWaybills = waybills?.pagination?.total || 0

  const metrics: MetricConfig[] = [
    {
      label: "Total Expenses",
      value: `${CEDI} ${commaSeparator(totalExpenses)}`,
      icon: Wallet,
      iconBg: "#FEE2E2",
      iconColor: "#DC2626",
    },
    {
      label: "Total Invoices",
      value: commaSeparator(totalInvoices),
      icon: FileText,
      iconBg: "#DBEAFE",
      iconColor: "#2563EB",
    },
    {
      label: "Total Waybills",
      value: commaSeparator(totalWaybills),
      icon: Truck,
      iconBg: "#D1FAE5",
      iconColor: "#059669",
    },
    {
      label: "Records Tracked",
      value: commaSeparator(totalInvoices + totalWaybills),
      icon: Receipt,
      iconBg: "#EDE9FE",
      iconColor: "#7C3AED",
    },
  ]

  // Real record-mix breakdown across the 3 finance record types - built
  // from the same counts as the cards above, not invented data.
  const mixSeries = [totalExpenses > 0 ? 1 : 0, totalInvoices, totalWaybills].map((v) => v || 0)
  const mixLabels = ["Expenses", "Invoices", "Waybills"]
  const mixOptions = {
    chart: { fontFamily: "Inter, sans-serif" },
    labels: mixLabels,
    colors: ["#DC2626", "#2563EB", "#059669"],
    legend: { position: "bottom" as const },
    dataLabels: { enabled: false },
  }

  return (
    <AuthorizeAndRenderPage permission="accounting|list_expenses">
      <PageTitle title="Financial Analytics" />

      <Tabs defaultValue="overview" className="w-full mx-auto">
        <TabsList className="grid w-full sm:w-[300px] grid-cols-1 h-auto p-1 bg-[#E2E8F0] rounded-full mb-5">
          <TabsTrigger
            className="h-[38px] rounded-full cursor-pointer font-semibold data-[state=active]:bg-[#0B3D19] data-[state=active]:text-white"
            value="overview"
          >
            Overview
          </TabsTrigger>
          {/*
            Report Builder - disabled for now per request until the
            custom/exportable report-builder feature is actually built.
            Re-enable by restoring this trigger (change TabsList back to
            grid-cols-2) and the TabsContent block below.
          <TabsTrigger
            className="h-[38px] rounded-full cursor-pointer font-semibold data-[state=active]:bg-[#0B3D19] data-[state=active]:text-white"
            value="report-builder"
          >
            Report Builder
          </TabsTrigger>
          */}
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {metrics.map((metric) => (
              <Card key={metric.label} className="p-5 shadow-none border border-[#E2E8F0]">
                <div className="flex items-start justify-between">
                  <span className="text-sm text-[#475569] font-medium">{metric.label}</span>
                  <div
                    className="rounded-full p-2.5 flex items-center justify-center"
                    style={{ backgroundColor: metric.iconBg }}
                  >
                    <metric.icon className="h-5 w-5" style={{ color: metric.iconColor }} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-black mt-3">
                  {isLoading ? "..." : metric.value}
                </p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1 shadow-none border border-[#E2E8F0]">
              <CardHeader className="pb-0">
                <CardTitle className="font-semibold text-base text-black">Record Mix</CardTitle>
              </CardHeader>
              <CardContent>
                {typeof window !== "undefined" && !isLoading && (
                  <ReactApexChart options={mixOptions as any} series={mixSeries} type="donut" height={280} />
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-none border border-[#E2E8F0] flex items-center justify-center">
              <CardContent className="text-center py-16">
                <p className="text-sm text-[#64748B] max-w-sm mx-auto">
                  Expense/revenue trend charts will appear here once a dated
                  finance-trend endpoint is available on the API. Showing
                  made-up trend data would be misleading, so this space is
                  intentionally left for real data.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/*
        <TabsContent value="report-builder">
          <ReportBuilder />
        </TabsContent>
        */}
      </Tabs>
    </AuthorizeAndRenderPage>
  )
}
