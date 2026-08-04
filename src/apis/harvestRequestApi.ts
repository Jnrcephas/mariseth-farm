"use client";

// NOTE: hand-written rather than generated, same reason as farmerRequestApi.ts -
// the harvest request endpoints aren't in openapi.json yet. Once the backend
// adds them to the OpenAPI spec and the client is regenerated, this file can
// be deleted in favor of the generated equivalent - just update the call
// sites under src/modules/Approvals/HarvestRequests to match.

import * as reactQuery from "@tanstack/react-query";
import { AdminApiContext, useAdminApiContext } from "./adminApiContext";
import { adminApiFetch } from "./adminApiFetcher";

export interface HarvestRequestProduct {
  id: number;
  product_id: string;
  name: string;
  type: string;
  status: string;
  color: string;
  price: string;
}

export interface HarvestRequestReviewer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  user_type: string;
}

export interface HarvestRequest {
  id: number;
  phone_number: string;
  product: HarvestRequestProduct | null;
  quantity: number | null;
  reviewed_by: HarvestRequestReviewer | null;
  created_by: HarvestRequestReviewer | null;
  status: "pending" | "approved" | "rejected" | string;
  request_channel: string;
  reviewed_at: string | null;
  comments: string | null;
  date_created: string;
  reason: string | null;
}

export type HarvestRequestFilters = {
  page?: number;
  page_size?: number;
  query?: string;
  status?: string;
};

export type HarvestRequestListVariables = {
  queryParams?: HarvestRequestFilters;
} & AdminApiContext["fetcherOptions"];

export type HarvestRequestReadVariables = {
  pathParams: {
    id: number;
  };
} & AdminApiContext["fetcherOptions"];

export type HarvestRequestReviewVariables = {
  pathParams: {
    id: number;
  };
  body: {
    review_action: "approve" | "reject";
    comment: string;
  };
} & AdminApiContext["fetcherOptions"];

export type HarvestRequestListResponse = {
  results?: HarvestRequest[];
  pagination?: {
    total: number;
    page: number;
    pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
};

export const fetchHarvestRequests = (
  variables: HarvestRequestListVariables,
  signal?: AbortSignal,
) =>
  adminApiFetch<
    HarvestRequestListResponse,
    any,
    undefined,
    {},
    HarvestRequestFilters,
    {}
  >({
    url: "/farm-management/farmer/requests/harvest",
    method: "get",
    ...variables,
    signal,
  });

export const useHarvestRequests = (
  variables: HarvestRequestListVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<HarvestRequestListResponse, any>,
    "queryKey" | "queryFn"
  >,
) => {
  const { queryOptions, fetcherOptions } = useAdminApiContext(options);
  return reactQuery.useQuery<HarvestRequestListResponse, any>({
    queryKey: ["farm-management", "farmer", "requests", "harvest", variables.queryParams],
    queryFn: ({ signal }) =>
      fetchHarvestRequests({ ...fetcherOptions, ...variables }, signal),
    ...queryOptions,
    ...options,
  });
};

export const fetchHarvestRequestRead = (
  variables: HarvestRequestReadVariables,
  signal?: AbortSignal,
) =>
  adminApiFetch<HarvestRequest, any, undefined, {}, {}, { id: number }>({
    url: "/farm-management/farmer/requests/harvest/{id}",
    method: "get",
    ...variables,
    signal,
  });

export const useHarvestRequestRead = (
  variables: HarvestRequestReadVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<HarvestRequest, any>,
    "queryKey" | "queryFn"
  >,
) => {
  const { queryOptions, fetcherOptions } = useAdminApiContext(options);
  return reactQuery.useQuery<HarvestRequest, any>({
    queryKey: ["farm-management", "farmer", "requests", "harvest", variables.pathParams.id],
    queryFn: ({ signal }) =>
      fetchHarvestRequestRead({ ...fetcherOptions, ...variables }, signal),
    ...queryOptions,
    ...options,
  });
};

// Single endpoint handles both approve and reject via `review_action`,
// unlike the separate approve/reject endpoints on farmer registration
// requests - see backend's WhatsApp message re:
// PUT /farm-management/farmer/requests/harvest/{id}/review
// body: { "review_action": "approve" | "reject", "comment": "" }
export const reviewHarvestRequest = (
  variables: HarvestRequestReviewVariables,
  signal?: AbortSignal,
) =>
  adminApiFetch<
    HarvestRequest,
    any,
    { review_action: "approve" | "reject"; comment: string },
    {},
    {},
    { id: number }
  >({
    url: "/farm-management/farmer/requests/harvest/{id}/review",
    method: "put",
    ...variables,
    signal,
  });

export const useReviewHarvestRequest = (
  options?: Omit<
    reactQuery.UseMutationOptions<HarvestRequest, any, HarvestRequestReviewVariables>,
    "mutationFn"
  >,
) => {
  const { fetcherOptions } = useAdminApiContext();
  return reactQuery.useMutation<HarvestRequest, any, HarvestRequestReviewVariables>({
    mutationFn: (variables) =>
      reviewHarvestRequest({ ...fetcherOptions, ...variables }),
    ...options,
  });
};
