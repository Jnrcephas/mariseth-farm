"use client"

import Link from "next/link"
import { ArrowRight, Leaf, ClipboardList, UserCircle, Satellite } from "lucide-react"
import { routeTo } from "@/lib/constants"
import { useHasAccess } from "@/hooks/auth/useHasAccess"

interface QuickActionCardConfig {
  title: string
  href: string
  icon: React.ElementType
  bgColor: string
}

const QUICK_ACTION_CARDS: QuickActionCardConfig[] = [
  {
    title: "Farm Management",
    href: routeTo.farms,
    icon: Leaf,
    bgColor: "#0B3D19",
  },
  {
    title: "Accounting and Finance",
    href: routeTo.accountingExpenses,
    icon: ClipboardList,
    bgColor: "#79C044",
  },
  {
    title: "HR Management",
    href: routeTo.employeeProfiles,
    icon: UserCircle,
    bgColor: "#17A2A0",
  },
  {
    title: "Farm Monitoring",
    href: routeTo.farmMonitoringWeather,
    icon: Satellite,
    bgColor: "#1F2A54",
  },
]

export default function QuickActionsGrid() {
  return (
    <div className="mt-5">
      <h2 className="font-bold text-lg text-black mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_ACTION_CARDS.map((card) => (
          <QuickActionCard key={card.href} card={card} />
        ))}
      </div>
    </div>
  )
}

function QuickActionCard({ card }: { card: QuickActionCardConfig }) {
  // Only show a Quick Action card if the user actually has access to at
  // least one of the underlying sections it links to (reuses the same
  // permission checks the sidebar/tabs use, so this never dead-ends a user
  // on an Unauthorized screen).
  const { hasAccess: list_farms } = useHasAccess("farm|list_farms")
  const { hasAccess: list_farmers } = useHasAccess("farmer|list_farmers")
  const { hasAccess: list_products } = useHasAccess("product|list_products")
  const { hasAccess: list_expenses } = useHasAccess("accounting|list_expenses")
  const { hasAccess: list_waybills } = useHasAccess("accounting|list_waybills")
  const { hasAccess: list_invoices } = useHasAccess("accounting|list_invoices")
  const { hasAccess: list_employees } = useHasAccess("employee|list_employees")
  const { hasAccess: list_job_titles } = useHasAccess("hr|list_job_titles")
  const { hasAccess: list_departments } = useHasAccess("hr|list_departments")

  const accessByTitle: Record<string, boolean> = {
    "Farm Management": list_farms || list_farmers || list_products,
    "Accounting and Finance": list_expenses || list_waybills || list_invoices,
    "HR Management": list_employees || list_job_titles || list_departments,
    // No dedicated permission exists for Farm Monitoring yet (it's a
    // placeholder feature - see src/modules/FarmMonitoring/*), so it's
    // visible to everyone for now, matching the sidebar entry.
    "Farm Monitoring": true,
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
