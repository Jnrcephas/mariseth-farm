"use client"

import Link from "next/link"
import { ArrowRight, Leaf, Box, FileSpreadsheet, BadgeCheck } from "lucide-react"
import { routeTo } from "@/lib/constants"
import { useHasAccess } from "@/hooks/auth/useHasAccess"

interface ReportsQuickActionCardConfig {
  title: string
  href: string
  icon: React.ElementType
  bgColor: string
}

// PLACEHOLDER: there's no dedicated "reports and analysis" backend feature
// yet, so these cards link to the existing hub pages whose underlying data
// these reports would eventually be based on, rather than to invented
// destinations that don't exist. Swap these out once the real reports this
// page should show are defined.
const REPORTS_QUICK_ACTION_CARDS: ReportsQuickActionCardConfig[] = [
  {
    title: "Farm Reports",
    href: routeTo.farms,
    icon: Leaf,
    bgColor: "#0B3D19",
  },
  {
    title: "Supply Chain Reports",
    href: routeTo.warehouses,
    icon: Box,
    bgColor: "#79C044",
  },
  {
    title: "Financial Reports",
    href: routeTo.accountingExpenses,
    icon: FileSpreadsheet,
    bgColor: "#17A2A0",
  },
  {
    title: "Approval Reports",
    href: routeTo.inflowApprovals,
    icon: BadgeCheck,
    bgColor: "#1F2A54",
  },
]

export default function ReportsQuickActions() {
  return (
    <div className="mt-5">
      <h2 className="font-bold text-lg text-black mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORTS_QUICK_ACTION_CARDS.map((card) => (
          <ReportsQuickActionCard key={card.href} card={card} />
        ))}
      </div>
    </div>
  )
}

function ReportsQuickActionCard({ card }: { card: ReportsQuickActionCardConfig }) {
  const { hasAccess: list_farms } = useHasAccess("farm|list_farms")
  const { hasAccess: list_farmers } = useHasAccess("farmer|list_farmers")
  const { hasAccess: list_products } = useHasAccess("product|list_products")
  const { hasAccess: list_warehouses } = useHasAccess("warehouse|list_warehouses")
  const { hasAccess: list_inflow_orders } = useHasAccess("inflow_orders|list_inflow_orders")
  const { hasAccess: list_outflow_orders } = useHasAccess("outflow_orders|list_outflow_orders")
  const { hasAccess: list_expenses } = useHasAccess("accounting|list_expenses")
  const { hasAccess: list_waybills } = useHasAccess("accounting|list_waybills")
  const { hasAccess: list_invoices } = useHasAccess("accounting|list_invoices")
  const { hasAccess: approve_inflow_order } = useHasAccess("inflow_orders|approve_inflow_order")
  const { hasAccess: list_outflow_approvals } = useHasAccess("outflow_approvals|list_outflow_approvals")

  const accessByTitle: Record<string, boolean> = {
    "Farm Reports": list_farms || list_farmers || list_products,
    "Supply Chain Reports": list_warehouses || list_inflow_orders || list_outflow_orders,
    "Financial Reports": list_expenses || list_waybills || list_invoices,
    "Approval Reports": approve_inflow_order || list_outflow_approvals,
  }

  if (!accessByTitle[card.title]) return null

  const Icon = card.icon

  return (
    <Link
      href={card.href}
      style={{ backgroundColor: card.bgColor }}
      className="group flex flex-col justify-between rounded-2xl p-6 h-[140px] text-white transition-transform hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
    >
      <Icon className="h-7 w-7" />
      <div className="flex items-end justify-between gap-2">
        <span className="text-lg font-semibold leading-snug">{card.title}</span>
        <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}