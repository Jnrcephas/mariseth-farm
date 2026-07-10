import { permType } from "@/hooks/auth/useHasAccess";
import { routeTo } from "./constants";

export interface ActionTabConfig {
  label: string;
  // Optional because a tab can instead be given an `onClick` (e.g. a
  // "Support" tab that opens a modal rather than navigating anywhere).
  href?: string;
  permission?: permType;
  // Opens in a new tab via a plain <a>, instead of a Next.js client-side
  // <Link> transition. Used for the "Accounting" tab, which points at an
  // external manager.io URL rather than a route inside this app.
  external?: boolean;
  // If provided, this tab renders as a <button> that runs this instead of
  // navigating. Used for "Support" on the Help page, since Support is a
  // modal, not its own route.
  onClick?: () => void;
}

// Each of these mirrors what used to be an expandable sidebar sub-menu.
// They're now rendered as a row of "Actions" tabs at the top of the relevant
// hub pages instead, per the new flat-sidebar navigation structure.

export const FARM_MANAGEMENT_TABS: ActionTabConfig[] = [
  { label: "Farms", href: routeTo.farms, permission: "farm|list_farms" },
  { label: "Farmers", href: routeTo.farmers, permission: "farmer|list_farmers" },
  { label: "Products", href: routeTo.products, permission: "product|list_products" },
];

export const SUPPLY_CHAIN_MANAGEMENT_TABS: ActionTabConfig[] = [
  { label: "Warehouses", href: routeTo.warehouses, permission: "warehouse|list_warehouses" },
  { label: "Inbound Orders", href: routeTo.inflowOrders, permission: "inflow_orders|list_inflow_orders" },
  { label: "Outbound Orders", href: routeTo.outflowOrders, permission: "outflow_orders|list_outflow_orders" },
  { label: "Customers", href: routeTo.customers, permission: "customer|list_customers" },
];

export const CREDIT_MANAGEMENT_TABS: ActionTabConfig[] = [
  { label: "Credits", href: routeTo.creditManagement, permission: "credit|list_credits" },
  { label: "Input Credit Procurement", href: routeTo.inputCreditProcurement, permission: "input_credit|list_input_credit_purchase" },
  { label: "Input Credits", href: routeTo.inputCreditManagement, permission: "input_credit|list_input_credit" },
];

export const APPROVALS_TABS: ActionTabConfig[] = [
  { label: "Inbound", href: routeTo.inflowApprovals, permission: "inflow_orders|approve_inflow_order" },
  { label: "Outbound", href: routeTo.outflowApprovals, permission: "outflow_approvals|list_outflow_approvals" },
  { label: "Credit Request", href: routeTo.creditRequestApprovals, permission: "credit|approve_deny_credit" },
  { label: "Warehouse Credit", href: routeTo.creditWarehouseApprovals, permission: "credit|list_credit_fulfill" },
  { label: "Farmer Registration Requests", href: routeTo.farmerRegistrationRequests, permission: "farmer|list_farmers" },
];

export const USER_MANAGEMENT_TABS: ActionTabConfig[] = [
  { label: "User Accounts", href: routeTo.userAccount, permission: "account_management|list_admins" },
  { label: "User Roles", href: routeTo.userRoles, permission: "account_management|list_groups_and_roles" },
];

// Replaces the old separate EMPLOYEE_MANAGEMENT_TABS + LEAVE_MANAGEMENT_TABS.
// "HR Management" is now a single flat sidebar item (see AppSidebar.tsx)
// that lands on Employee Profiles by default; all of Employee Management,
// Leave Management, and Training are now just tabs on that one hub instead
// of 3 separate sidebar entries.
export const HR_MANAGEMENT_TABS: ActionTabConfig[] = [
  { label: "Employee Profiles", href: routeTo.employeeProfiles, permission: "employee|list_employees" },
  { label: "Job Titles", href: routeTo.employeeJobTitles, permission: "hr|list_job_titles" },
  { label: "Departments", href: routeTo.employeeDepartments, permission: "hr|list_departments" },
  { label: "Leave Requests", href: routeTo.leaveManagementLeaveRequests, permission: "leave|list_leave_requests" },
  { label: "Leave Types", href: routeTo.leaveManagementLeaveRequestTypes, permission: "leave|list_leave_types" },
  { label: "Training", href: routeTo.training, permission: "training|list_trainings" },
];

// Replaces the old flat Expenses / Waybills / Invoices / Accounting sidebar
// items. "Finance & Accounting" is now one sidebar item landing on
// Expenses by default, with these as tabs.
// "Farm Monitoring" is a new sidebar item on its own (not merged with
// anything else). PLACEHOLDER: there's no real weather/sensor/alerts
// backend integration yet - each of these 5 pages renders clearly-marked
// illustrative content until a real data source (IoT sensors, a weather
// API, etc.) is wired up. See src/modules/FarmMonitoring/*.
export const FARM_MONITORING_TABS: ActionTabConfig[] = [
  { label: "Weather", href: routeTo.farmMonitoringWeather },
  { label: "Farm Alerts", href: routeTo.farmMonitoringFarmAlerts },
  { label: "Soil Health", href: routeTo.farmMonitoringSoilHealth },
  { label: "Crop Health", href: routeTo.farmMonitoringCropHealth },
  { label: "Pest & Disease", href: routeTo.farmMonitoringPestDisease },
];

export const FINANCE_TABS: ActionTabConfig[] = [
  { label: "Expenses", href: routeTo.accountingExpenses, permission: "accounting|list_expenses" },
  { label: "Waybills", href: routeTo.accountingWaybills, permission: "accounting|list_waybills" },
  { label: "Invoices", href: routeTo.accountingInvoices, permission: "accounting|list_invoices" },
  { label: "Accounting", href: "https://meshsuites.manager.io/businesses", external: true },
];
