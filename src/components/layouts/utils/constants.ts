import { BadgeCheck, Box, Calculator, Calendar, ChartColumnBig, GraduationCap, LayoutGrid, Leaf, MonitorCog, User, UserCircle } from "lucide-react";
import { routeTo } from "@/lib/constants";

export const menusData = {
    navMain: [
      {
          title: "Dashboard",
          url: routeTo.dashboard,
          items: null,
          isActive: true,
          slug: "dashboard",
          icon: LayoutGrid,
          hasAccess: false,
      },
      {
        title: "Farm Management",
        url: "#",
        slug: "farm-management",
        icon: Leaf,
        hasAccess: false,
        items: [
          {
            title: "Farms",
            url: routeTo.farms,
            slug: "farm-management",
            hasAccess: false,
          },
          {
            title: "Farmers",
            url: routeTo.farmers,
            slug: "farm-management",
            hasAccess: true,
          },
          {
            title: "Products",
            url: routeTo.products,
            slug: "farm-management",
            hasAccess: true,
          },
        ],
      },
      {
        title: "Supply Chain Management",
        url: "#",
        slug: "supply-chain-management",
        icon: Box,
        hasAccess: true,
        items: [
          {
            title: "Warehouses",
            url: routeTo.warehouses,
            slug: "supply-chain-management",
            hasAccess: true,
          },
          {
            title: "Inbound Orders",
            url: routeTo.inflowOrders,
            slug: "supply-chain-management",
            hasAccess: true,
          },
          {
            title: "Outbound Orders",
            url: routeTo.outflowOrders,
            slug: "supply-chain-management",
            hasAccess: true,
          },
          {
            title: "Credit Management",
            url: routeTo.creditManagement,
            slug: "supply-chain-management",
            hasAccess: true,
          },
        ],
      },
      {
        title: "Approvals",
        url: "#",
        slug: "approvals",
        icon: BadgeCheck,
        hasAccess: true,
        items: [
          {
            title: "Inbound",
            url: routeTo.inflowApprovals,
            slug: "approvals",
            hasAccess: true,
          },
          {
            title: "Outbound",
            url: routeTo.outflowApprovals,
            slug: "approvals",
            hasAccess: true,
          },
          {
            title: "Credit Request",
            url: routeTo.creditRequestApprovals,
            slug: "approvals",
            hasAccess: true,
          },
        ],
      },
      
      {
        title: "User Management",
        url: "#",
        slug: "user-management",
        icon: User,
        hasAccess: true,
        items: [
          {
            title: "User Accounts",
            url: routeTo.userAccount,
            slug: "user-management",
            hasAccess: true,
          },
          {
            title: "User Roles",
            url: routeTo.userRoles,
            slug: "user-management",
            hasAccess: true,
          }
        ],
      },
      {
        title: "Audit Trails",
        url: "#",
        slug: "report",
        icon: ChartColumnBig,
        hasAccess: true,
        // items: [
        //   {
        //     title: "Financial Report",
        //     url: "#",
        //     slug: "report",
        //     hasAccess: true,
        //   },
        //   {
        //     title: "Applications",
        //     url: "#",
        //     slug: "report",
        //     hasAccess: true,
        //   },
        //   {
        //     title: "Audit Trails",
        //     url: "#",
        //     slug: "report",
        //     hasAccess: true,
        //   }
        // ],
      },
      {
          title: "System Settings",
          url: routeTo.systemSettings,
          items: null,
          slug: "system-settings",
          icon: MonitorCog,
          hasAccess: true,
      },
      
    ],
  }

export const menusData2 = {
    navMain: [
       {
        title: "Employee Management",
        url: "#",
        slug: "employee-management",
        icon: UserCircle,
        hasAccess: true,
        items: [
          {
            title: "Employee Profiles",
            url: "#",
            slug: "employee-management",
            hasAccess: true,
          },
          {
            title: "Job Titles",
            url: "#",
            slug: "employee-management",
            hasAccess: true,
          },
          
        ],
      },
      {
          title: "Leave Management",
          url: "#",
          items: null,
          isActive: true,
          slug: "leave-management",
          icon: Calendar,
          hasAccess: true,
      },
      // {
      //   title: "Payroll Management",
      //   url: "#",
      //   slug: "payroll-management",
      //   icon: CreditCard,
      //   hasAccess: true,
      //   items: [
      //     {
      //       title: "Payroll Setup",
      //       url: "#",
      //       slug: "payroll-management",
      //       hasAccess: true,
      //     },
      //     {
      //       title: "Salaries",
      //       url: "#",
      //       slug: "payroll-management",
      //       hasAccess: true,
      //     },
      //     {
      //       title: "Allowances",
      //       url: "#",
      //       slug: "payroll-management",
      //       hasAccess: true,
      //     },
      //     {
      //       title: "Deductions",
      //       url: "#",
      //       slug: "payroll-management",
      //       hasAccess: true,
      //     },
      //   ],
      // },
      {
        title: "Training",
        url: "#",
        slug: "training",
        isActive: true,
        icon: GraduationCap,
        hasAccess: true,
      },
    ],
}

export const menusData3 = {
    navMain: [
     
      {
        title: "Accounting",
        url: "#",
        slug: "accounting",
        icon: Calculator,
        hasAccess: true,
        items: [
          {
            title: "Customers",
            url: routeTo.customers,
            slug: "accounting",
            hasAccess: true,
          }
        ],
      }
    ],
}