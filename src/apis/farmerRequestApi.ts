"use client";

import * as reactQuery from "@tanstack/react-query";
import { AdminApiContext, useAdminApiContext } from "./adminApiContext";
import { adminApiFetch } from "./adminApiFetcher";
import type * as Schemas from "./adminApiSchemas";

export type FarmerRegistrationRequestFilters = {
  page?: number;
  page_size?: number;
  query?: string;
  region?: string;
  district?: string;
  status?: string;
};

export type FarmerRegistrationRequestListVariables = {
  queryParams?: FarmerRegistrationRequestFilters;
} & AdminApiContext["fetcherOptions"];

export type FarmerRegistrationRequestRejectVariables = {
  pathParams: {
    id: number;
  };
  body: {
    comments: string;
  };
} & AdminApiContext["fetcherOptions"];

export type FarmerRegistrationRequestReadVariables = {
  pathParams: {
    id: number;
  };
} & AdminApiContext["fetcherOptions"];

export type FarmerRegistrationRequestListResponse = {
  results?: any[];
  pagination?: {
    total: number;
    page: number;
    pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
};

export const fetchFarmerRegistrationRequests = (
  variables: FarmerRegistrationRequestListVariables,
  signal?: AbortSignal,
) =>
  adminApiFetch<
    FarmerRegistrationRequestListResponse,
    any,
    undefined,
    {},
    FarmerRegistrationRequestFilters,
    {}
  >({
    url: "/farm-management/farmer/requests",
    method: "get",
    ...variables,
    signal,
  });

export const useFarmerRegistrationRequests = (
  variables: FarmerRegistrationRequestListVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<FarmerRegistrationRequestListResponse, any>,
    "queryKey" | "queryFn"
  >,
) => {
  const { queryOptions, fetcherOptions } = useAdminApiContext(options);
  return reactQuery.useQuery<FarmerRegistrationRequestListResponse, any>({
    queryKey: ["farm-management", "farmer", "requests", variables.queryParams],
    queryFn: ({ signal }) =>
      fetchFarmerRegistrationRequests(
        { ...fetcherOptions, ...variables },
        signal,
      ),
    ...queryOptions,
    ...options,
  });
};

export const fetchFarmerRegistrationRequestRead = (
  variables: FarmerRegistrationRequestReadVariables,
  signal?: AbortSignal,
) =>
  adminApiFetch<Schemas.Farmer, any, undefined, {}, {}, { id: number }>({
    url: "/farm-management/farmer/requests/{id}",
    method: "get",
    ...variables,
    signal,
  });

export const useFarmerRegistrationRequestRead = (
  variables: FarmerRegistrationRequestReadVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<Schemas.Farmer, any>,
    "queryKey" | "queryFn"
  >,
) => {
  const { queryOptions, fetcherOptions } = useAdminApiContext(options);
  return reactQuery.useQuery<Schemas.Farmer, any>({
    queryKey: ["farm-management", "farmer", "requests", variables.pathParams.id],
    queryFn: ({ signal }) =>
      fetchFarmerRegistrationRequestRead(
        { ...fetcherOptions, ...variables },
        signal,
      ),
    ...queryOptions,
    ...options,
  });
};

export const rejectFarmerRegistrationRequest = (
  variables: FarmerRegistrationRequestRejectVariables,
  signal?: AbortSignal,
) =>
  adminApiFetch<any, any, { comments: string }, {}, {}, { id: number }>({
    url: "/farm-management/farmer/requests/{id}/reject",
    method: "put",
    ...variables,
    signal,
  });

export const useRejectFarmerRegistrationRequest = (
  options?: Omit<
    reactQuery.UseMutationOptions<
      any,
      any,
      FarmerRegistrationRequestRejectVariables
    >,
    "mutationFn"
  >,
) => {
  const { fetcherOptions } = useAdminApiContext();
  return reactQuery.useMutation<
    any,
    any,
    FarmerRegistrationRequestRejectVariables
  >({
    mutationFn: (variables) =>
      rejectFarmerRegistrationRequest({ ...fetcherOptions, ...variables }),
    ...options,
  });
};
