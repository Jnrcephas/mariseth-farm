"use client"
import {ArchiveRestore, Calendar, FileSpreadsheet, FileText, GraduationCap, Headphones, LifeBuoy, MonitorStop, NotebookPen, ShoppingBasket, UserCircle } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import SidebarGroupMenus from "./SidebarGroupMenus"
import { useHasAccess } from "@/hooks/auth/useHasAccess"
import { BadgeCheck, Box, LayoutGrid, Leaf, MonitorCog, User } from "lucide-react";
import { routeTo } from "@/lib/constants"
import SupportModal from "./SupportModal"
import { useState } from "react"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathName = usePathname();
  const path = pathName?.split("/")

  const [supportModal, setSupportModal] = useState(false)

  const {hasAccess: list_farms} = useHasAccess("farm|list_farms")
  const {hasAccess: list_farmers} = useHasAccess("farmer|list_farmers")
  const {hasAccess: list_products} = useHasAccess("product|list_products")
  const {hasAccess: list_warehouses} = useHasAccess("warehouse|list_warehouses")
  const {hasAccess: list_inflow_orders} = useHasAccess("inflow_orders|list_inflow_orders")
  const {hasAccess: list_outflow_orders} = useHasAccess("outflow_orders|list_outflow_orders")
  const {hasAccess: list_credits} = useHasAccess("credit|list_credits")
  const {hasAccess: approve_inflow_delivery_inspection} = useHasAccess("inflow_orders|approve_inflow_delivery_inspection")
  const {hasAccess: approve_inflow_order} = useHasAccess("inflow_orders|approve_inflow_order")
  const {hasAccess: approve_deny_credit} = useHasAccess("credit|approve_deny_credit")
  const {hasAccess: list_admins} = useHasAccess("account_management|list_admins")
  const {hasAccess: list_groups_and_roles} = useHasAccess("account_management|list_groups_and_roles")
  const {hasAccess: create_custom_type} = useHasAccess("shared_custom_types|create_custom_type")
  const {hasAccess: list_invoices} = useHasAccess("accounting|list_invoices")
  const {hasAccess: list_waybills} = useHasAccess("accounting|list_waybills")
  const {hasAccess: list_expenses} = useHasAccess("accounting|list_expenses")
  const {hasAccess: list_departments} = useHasAccess("hr|list_departments")
  const {hasAccess: list_job_titles} = useHasAccess("hr|list_job_titles")
  const {hasAccess: list_employees} = useHasAccess("employee|list_employees")
  const {hasAccess: list_leave_requests} = useHasAccess("leave|list_leave_requests")
  const {hasAccess: list_leave_types} = useHasAccess("leave|list_leave_types")
  const {hasAccess: list_trainings} = useHasAccess("training|list_trainings")
  const {hasAccess: list_customers} = useHasAccess("customer|list_customers")
  const {hasAccess: list_outflow_approvals} = useHasAccess("outflow_approvals|list_outflow_approvals")
  const {hasAccess: list_inflow_history} = useHasAccess("audit_trail|list_inflow_history")
  const {hasAccess: list_outflow_history} = useHasAccess("audit_trail|list_outflow_history")
  const {hasAccess: list_input_credit_purchase} = useHasAccess("input_credit|list_input_credit_purchase")
  const {hasAccess: list_input_credit} = useHasAccess("input_credit|list_input_credit")
  const {hasAccess: list_credit_fulfill} = useHasAccess("credit|list_credit_fulfill")
  


  const menusData = {
    navMain: [
      {
          title: "Dashboard",
          url: routeTo.dashboard,
          isActive: true,
          slug: "dashboard",
          icon: LayoutGrid,
          hasAccess: (list_farms ||  list_farmers || list_products || list_warehouses || list_inflow_orders || list_outflow_orders || list_credits || list_admins || list_groups_and_roles || create_custom_type),
      },
      {
        title: "Farm Management",
        url: routeTo.farms,
        slug: "farm-management",
        icon: Leaf,
        hasAccess: (list_farms ||  list_farmers || list_products),
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
        title: "Audit Trails",
        url: routeTo.auditTrails,
        slug: "report",
        icon: NotebookPen,
        hasAccess: list_inflow_history || list_outflow_history,
      },
      {
          title: "System Settings",
          url: routeTo.systemSettings,
          slug: "system-settings",
          icon: MonitorCog,
          hasAccess: create_custom_type,
      },
      
    ],
  }

  const hrMenusData = {
    navMain: [
       {
        title: "Employee Management",
        url: routeTo.employeeProfiles,
        slug: "employee-management",
        icon: UserCircle,
        hasAccess: list_job_titles || list_departments || list_employees,
      },
      {
          title: "Leave Management",
          url: routeTo.leaveManagementLeaveRequests,
          isActive: true,
          slug: "leave-management",
          icon: Calendar,
          hasAccess: (list_leave_requests || list_leave_types),
      },
      {
        title: "Training",
        url: routeTo.training,
        slug: "training",
        isActive: true,
        icon: GraduationCap,
        hasAccess: list_trainings,
      }
    ],
  }

  const accountingMenusData = {
    navMain: [
       {
        title: "Expenses",
        url: routeTo.accountingExpenses,
        slug: "expenses",
        icon: ArchiveRestore,
        hasAccess: list_expenses,
      },
      {
          title: "Waybills",
          url: routeTo.accountingWaybills,
          items: null,
          isActive: true,
          slug: "waybills",
          icon: FileText,
          hasAccess: list_waybills,
      },
      {
        title: "Invoices",
        url: routeTo.accountingInvoices,
        slug: "invoices",
        isActive: true,
        icon: FileSpreadsheet,
        hasAccess: list_invoices,
      },
      {
        title: "Accounting",
        url: "https://meshsuites.manager.io/businesses",
        slug: "manager-io",
        isActive: false,
        icon: MonitorStop,
        hasAccess: true,
        blank: true
      },
    ],
  }


  return (
    <div>
    <Sidebar {...props}>
      <SidebarHeader className="bg-[#4A8D34] h-[57px] flex flex-col justify-center">
        <div className="px-1">
            <Image
                className="w-[120px]"
                src="/images/meriseth-farm-logo.svg"
                alt="meriseth logo"
                width={500}
                height={500}
                priority
            />
        </div>
        </SidebarHeader>
        {/* scrollbar-minimal-windows */}
      <SidebarContent className="gap-0  mt-3 overflow-y-auto "> 
        <SidebarGroupMenus menusData={menusData}/>
        {(list_job_titles || list_departments || 
          list_employees || list_leave_requests || 
          list_leave_types || list_trainings ) &&
        <SidebarGroupMenus menusData={hrMenusData}>
          HR MANAGEMENT
        </SidebarGroupMenus>}
        {(list_expenses || list_waybills || list_invoices) && 
        <SidebarGroupMenus menusData={accountingMenusData}>
          FINANCE
        </SidebarGroupMenus>}
        <SidebarGroup className="">
          <SidebarGroupLabel className="text-muted-foreground mb- font-bold !text-[#4A8D34] ">
            TECHNICAL SUPPORT
          </SidebarGroupLabel>
            <SidebarMenuButton
                className={`mb-2 px-5 group/label text-sm text-slate-500 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-row ${path.includes("report") && "font-bold !bg-[#D1FAE5] !text-[#4A8D34]"}`}
                asChild
                isActive={path.includes('report')}
            >    
              <Link
                  className=""
                  href={routeTo.help}
                  prefetch={true}
              >
                  <LifeBuoy/>
                  <span className="font-medium">Help</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton
                className={`px-5 group/label text-sm text-slate-500 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-row ${path.includes("report") && "font-bold !bg-[#D1FAE5] !text-[#4A8D34]"}`}
                asChild
                isActive={path.includes('support')}
            >    
              <Link
                  onClick={() => setSupportModal(true)}
                  className=""
                  href={"#"}
                  prefetch={true}
              >
                  <Headphones/>
                  <span className="font-medium">Support</span>
              </Link>
            </SidebarMenuButton>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-x-1 mt-5 justify-center">
            <h1 className="text-sm text-[#64748B]">Powered by</h1>{" "}
            <Image
                className="w-[100px]"
                src="/images/sales-forge-logo.jpeg"
                alt="meriseth logo"
                width={500}
                height={500}
                priority
            />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <SupportModal open={supportModal} setOpen={setSupportModal}/>
    </div>
  )
}
