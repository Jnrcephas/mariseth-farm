import { permType } from "@/hooks/auth/useHasAccess";
import { routeTo } from "./constants";

export interface ActionTabConfig {
  label: string;

  href?: string;
  permission?: permType;

  external?: boolean;

  onClick?: () => void;
}


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


export const HR_MANAGEMENT_TABS: ActionTabConfig[] = [
  { label: "Employee Profiles", href: routeTo.employeeProfiles, permission: "employee|list_employees" },
  { label: "Job Titles", href: routeTo.employeeJobTitles, permission: "hr|list_job_titles" },
  { label: "Departments", href: routeTo.employeeDepartments, permission: "hr|list_departments" },
  { label: "Leave Requests", href: routeTo.leaveManagementLeaveRequests, permission: "leave|list_leave_requests" },
  { label: "Leave Types", href: routeTo.leaveManagementLeaveRequestTypes, permission: "leave|list_leave_types" },
  { label: "Training", href: routeTo.training, permission: "training|list_trainings" },
];


export const FINANCE_TABS: ActionTabConfig[] = [
  { label: "Analytics", href: routeTo.accountingAnalytics, permission: "accounting|list_expenses" },
  { label: "Expenses", href: routeTo.accountingExpenses, permission: "accounting|list_expenses" },
  { label: "Waybills", href: routeTo.accountingWaybills, permission: "accounting|list_waybills" },
  { label: "Invoices", href: routeTo.accountingInvoices, permission: "accounting|list_invoices" },
  { label: "Accounting", href: "https://meshsuites.manager.io/businesses", external: true },
];

export const FARM_MONITORING_TABS: ActionTabConfig[] = [
  { label: "Weather Dashboard", href: routeTo.farmMonitoringWeather },
  { label: "Soil Health", href: routeTo.farmMonitoringSoilHealth },
  { label: "Satelite View", href: routeTo.farmMonitoringCropHealth },
  { label: "Geofencing", href: routeTo.farmMonitoringPestDisease },
  { label: "Farm Alerts", href: routeTo.farmMonitoringFarmAlerts },
];