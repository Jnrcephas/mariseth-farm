"use client"
import { BarChart3, FileSpreadsheet, LifeBuoy, NotebookPen, ShoppingBasket, UserCircle } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import SidebarGroupMenus from "./SidebarGroupMenus"
import { useHasAccess } from "@/hooks/auth/useHasAccess"
import { BadgeCheck, Box, LayoutGrid, Leaf, MonitorCog, User } from "lucide-react";
import { routeTo } from "@/lib/constants"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { hasAccess: list_farms } = useHasAccess("farm|list_farms")
  const { hasAccess: list_farmers } = useHasAccess("farmer|list_farmers")
  const { hasAccess: list_products } = useHasAccess("product|list_products")
  const { hasAccess: list_warehouses } = useHasAccess("warehouse|list_warehouses")
  const { hasAccess: list_inflow_orders } = useHasAccess("inflow_orders|list_inflow_orders")
  const { hasAccess: list_outflow_orders } = useHasAccess("outflow_orders|list_outflow_orders")
  const { hasAccess: list_credits } = useHasAccess("credit|list_credits")
  const { hasAccess: approve_inflow_delivery_inspection } = useHasAccess("inflow_orders|approve_inflow_delivery_inspection")
  const { hasAccess: approve_inflow_order } = useHasAccess("inflow_orders|approve_inflow_order")
  const { hasAccess: approve_deny_credit } = useHasAccess("credit|approve_deny_credit")
  const { hasAccess: list_admins } = useHasAccess("account_management|list_admins")
  const { hasAccess: list_groups_and_roles } = useHasAccess("account_management|list_groups_and_roles")
  const { hasAccess: create_custom_type } = useHasAccess("shared_custom_types|create_custom_type")
  const { hasAccess: list_invoices } = useHasAccess("accounting|list_invoices")
  const { hasAccess: list_waybills } = useHasAccess("accounting|list_waybills")
  const { hasAccess: list_expenses } = useHasAccess("accounting|list_expenses")
  const { hasAccess: list_departments } = useHasAccess("hr|list_departments")
  const { hasAccess: list_job_titles } = useHasAccess("hr|list_job_titles")
  const { hasAccess: list_employees } = useHasAccess("employee|list_employees")
  const { hasAccess: list_leave_requests } = useHasAccess("leave|list_leave_requests")
  const { hasAccess: list_leave_types } = useHasAccess("leave|list_leave_types")
  const { hasAccess: list_trainings } = useHasAccess("training|list_trainings")
  const { hasAccess: list_customers } = useHasAccess("customer|list_customers")
  const { hasAccess: list_outflow_approvals } = useHasAccess("outflow_approvals|list_outflow_approvals")
  const { hasAccess: list_inflow_history } = useHasAccess("audit_trail|list_inflow_history")
  const { hasAccess: list_outflow_history } = useHasAccess("audit_trail|list_outflow_history")
  const { hasAccess: list_input_credit_purchase } = useHasAccess("input_credit|list_input_credit_purchase")
  const { hasAccess: list_input_credit } = useHasAccess("input_credit|list_input_credit")
  const { hasAccess: list_credit_fulfill } = useHasAccess("credit|list_credit_fulfill")



  const menusData = {
    navMain: [
      {
        title: "Dashboard",
        url: routeTo.dashboard,
        isActive: true,
        slug: "dashboard",
        icon: LayoutGrid,
        hasAccess: (list_farms || list_farmers || list_products || list_warehouses || list_inflow_orders || list_outflow_orders || list_credits || list_admins || list_groups_and_roles || create_custom_type),
      },
      {
        title: "Farm Management",
        url: routeTo.farms,
        slug: "farm-management",
        icon: Leaf,
        hasAccess: (list_farms || list_farmers || list_products),
      },
      {
        title: "Supply Chain Management",
        url: routeTo.warehouses,
        slug: "supply-chain-management",
        icon: Box,
        hasAccess: (list_warehouses || list_inflow_orders || list_outflow_orders || list_credits || list_customers),
      },
      {
        title: "Credit Management",
        url: routeTo.creditManagement,
        slug: "credit-management",
        icon: ShoppingBasket,
        hasAccess: (list_credits || list_input_credit_purchase || list_input_credit),
      },
      {
        title: "Approvals",
        url: routeTo.inflowApprovals,
        slug: "approvals",
        icon: BadgeCheck,
        hasAccess: (approve_inflow_order || approve_inflow_delivery_inspection || approve_deny_credit || list_outflow_approvals || list_farmers || list_credit_fulfill),
      },
      {
        title: "User Management",
        url: routeTo.userAccount,
        slug: "user-management",
        icon: User,
        hasAccess: (list_admins || list_groups_and_roles),
      },
      {
        title: "HR Management",
        url: routeTo.employeeProfiles,
        slug: ["employee-management", "leave-management", "training"],
        icon: UserCircle,
        hasAccess: (list_job_titles || list_departments || list_employees || list_leave_requests || list_leave_types || list_trainings),
      },
      {
        title: "Finance & Accounting",
        url: routeTo.accountingExpenses,
        slug: "accounting",
        icon: FileSpreadsheet,
        hasAccess: (list_expenses || list_waybills || list_invoices),
      },
      {
        title: "Audit Trails",
        url: routeTo.auditTrails,
        slug: "report",
        icon: NotebookPen,
        hasAccess: list_inflow_history || list_outflow_history,
      },
      {
        title: "Reports and analysis",
        url: routeTo.reportsAndAnalysis,
        slug: "reports-and-analysis",
        icon: BarChart3,
        hasAccess: list_inflow_history || list_outflow_history,
      },
      {
        title: "System Settings",
        url: routeTo.systemSettings,
        slug: "system-settings",
        icon: MonitorCog,
        hasAccess: create_custom_type,
      },
      {
        // Help + Support used to be two separate items in their own
        // "TECHNICAL SUPPORT" sidebar group. Now it's one flat item landing
        // on the Help page, with Help/Support as Quick Action tabs there
        // (Support opens the same modal as before, just triggered from the
        // Help page's tabs instead of the sidebar - see
        // src/app/app/help/page.tsx).
        title: "Technical Support",
        url: routeTo.help,
        slug: "help",
        icon: LifeBuoy,
        hasAccess: true,
      },

    ],
  }


  return (
    <div>
      <Sidebar {...props}>
        <SidebarHeader className="bg-[#ffffff] h-[85px] flex flex-col justify-center">
          <div className="px-1">
            <Image
              className="w-[150px]"
              src="/images/meriseth-farm-logo 1.png"
              alt="meriseth logo"
              width={500}
              height={500}
              priority
            />
          </div>
        </SidebarHeader>
        {/* scrollbar-minimal-windows */}
        <SidebarContent className="gap-0  mt-3 overflow-y-auto ">
          <SidebarGroupMenus menusData={menusData} />
        </SidebarContent>
        <SidebarFooter className="p-4">
          <div className="flex items-center gap-x-1 mt-5 justify-center">
            {/* <h1 className="text-sm text-[#64748B]">Powered by</h1>{" "} */}
            {/* <Image
              className="w-[100px]"
              src="/images/sales-forge-logo.jpeg"
              alt="meriseth logo"
              width={500}
              height={500}
              priority
            /> */}
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </div>
  )
}