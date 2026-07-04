import { permType } from "@/hooks/auth/useHasAccess";
import { routeTo } from "./constants";

export interface ActionTabConfig {
  label: string;
  href: string;
  permission?: permType;
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

export const EMPLOYEE_MANAGEMENT_TABS: ActionTabConfig[] = [
  { label: "Employee Profiles", href: routeTo.employeeProfiles, permission: "employee|list_employees" },
  { label: "Job Titles", href: routeTo.employeeJobTitles, permission: "hr|list_job_titles" },
  { label: "Departments", href: routeTo.employeeDepartments, permission: "hr|list_departments" },
];

export const LEAVE_MANAGEMENT_TABS: ActionTabConfig[] = [
  { label: "Leave Requests", href: routeTo.leaveManagementLeaveRequests, permission: "leave|list_leave_requests" },
  { label: "Leave Types", href: routeTo.leaveManagementLeaveRequestTypes, permission: "leave|list_leave_types" },
];
