import * as reactQuery from "@tanstack/react-query";
import { adminApiFetch } from "./adminApiFetcher";
import { useAdminApiContext, AdminApiContext } from "./adminApiContext";

// NOTE: hand-written rather than generated, same reason as useFarmWeather.ts -
// this endpoint isn't in openapi.json yet. Delete in favor of the generated
// equivalent once the backend adds it (update the call site,
// src/modules/AuditTrails/LoginLogoutAuditTrails.tsx, to match).
//
// GET /api/v1/audit-trail - login/logout activity log, distinct from the
// existing /audit-trail/inflow and /audit-trail/outflow inventory history
// endpoints already wired up in this module.

export interface LoginLogoutAuditTrailUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  user_type: string;
}

export interface LoginLogoutAuditTrailEntry {
  id: number;
  created_by: LoginLogoutAuditTrailUser;
  date_created: string;
  date_modified: string;
  date_deleted: string | null;
  is_active: boolean;
  type: "LOGIN" | "LOGOUT" | string;
  data: unknown;
  data_id: number | null;
  deleted_by: number | null;
  organization: number;
}

export type LoginLogoutAuditTrailFilters = {
  page?: number;
  page_size?: number;
  query?: string;
  type?: "LOGIN" | "LOGOUT" | string;
  start_date?: string;
  end_date?: string;
};

export type LoginLogoutAuditTrailListResponse = {
  export_response?: unknown;
  results?: LoginLogoutAuditTrailEntry[];
  pagination?: {
    total: number;
    page: number;
    pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
};

type LoginLogoutAuditTrailVariables = {
  queryParams?: LoginLogoutAuditTrailFilters;
} & AdminApiContext["fetcherOptions"];

export const fetchLoginLogoutAuditTrail = (
  variables: LoginLogoutAuditTrailVariables,
  signal?: AbortSignal,
) =>
  adminApiFetch<
    LoginLogoutAuditTrailListResponse,
    any,
    undefined,
    {},
    LoginLogoutAuditTrailFilters,
    {}
  >({
    url: "/audit-trail",
    method: "get",
    ...variables,
    signal,
  });

export const useLoginLogoutAuditTrail = (
  variables: LoginLogoutAuditTrailVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<LoginLogoutAuditTrailListResponse, any>,
    "queryKey" | "queryFn"
  >,
) => {
  const { fetcherOptions } = useAdminApiContext();
  return reactQuery.useQuery<LoginLogoutAuditTrailListResponse, any>({
    queryKey: ["audit-trail", "login-logout", variables.queryParams],
    queryFn: ({ signal }) =>
      fetchLoginLogoutAuditTrail({ ...fetcherOptions, ...variables }, signal),
    ...options,
  });
};
