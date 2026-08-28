"use client";

// NOTE: hand-written rather than generated, same reason as harvestRequestApi.ts -
// the extension request endpoints aren't in openapi.json yet. Once the backend
// adds them to the OpenAPI spec and the client is regenerated, this file can
// be deleted in favor of the generated equivalent - just update the call
// sites under src/modules/Approvals/ExtensionRequests to match.
//
// See apps/farm/docs/EXTENSION_REQUESTS.md (backend) for the full contract.
// Two things called out there that affect this integration:
// - Review currently 500s server-side (ExtensionRequestViewSet.patch
//   references a `product` field ExtensionRequest doesn't have), so
//   approve/reject will fail until that's fixed backend-side even though
//   the request/response shape here is correct.
// - `export=true` on the list endpoint currently returns Harvest Request
//   data instead of Extension Request data, so export is intentionally not
//   wired up on this page yet.

import * as reactQuery from "@tanstack/react-query";
import { AdminApiContext, useAdminApiContext } from "./adminApiContext";
import { adminApiFetch } from "./adminApiFetcher";
import type * as Schemas from "./adminApiSchemas";

export interface ExtensionRequestReviewer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  user_type: string;
}

export interface ExtensionRequest {
  id: number;
  phone_number: string;
  farmer: Schemas.Farmer | null;
  reason: string | null;
  reviewed_by: ExtensionRequestReviewer | null;
  created_by: ExtensionRequestReviewer | null;
  status: "pending" | "approved" | "rejected" | string;
  request_channel: string;
  reviewed_at: string | null;
  comments: string | null;
  date_created: string;
}

export type ExtensionRequestFilters = {
  page?: number;
  page_size?: number;
  query?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
};

export type ExtensionRequestListVariables = {
  queryParams?: ExtensionRequestFilters;
} & AdminApiContext["fetcherOptions"];

export type ExtensionRequestReadVariables = {
  pathParams: {
    id: number;
  };
} & AdminApiContext["fetcherOptions"];

export type ExtensionRequestReviewVariables = {
  pathParams: {
    id: number;
  };
  body: {
    review_action: "approve" | "reject";
    comments: string;
  };
} & AdminApiContext["fetcherOptions"];

export type ExtensionRequestListResponse = {
  results?: ExtensionRequest[];
  pagination?: {
    total: number;
    page: number;
    pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
};

export const fetchExtensionRequests = (
  variables: ExtensionRequestListVariables,
  signal?: AbortSignal,
) =>
  adminApiFetch<
    ExtensionRequestListResponse,
    any,
    undefined,
    {},
    ExtensionRequestFilters,
    {}
  >({
    url: "/farm-management/farmer/requests/extension",
    method: "get",
    ...variables,
    signal,
  });

export const useExtensionRequests = (
  variables: ExtensionRequestListVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<ExtensionRequestListResponse, any>,
    "queryKey" | "queryFn"
  >,
) => {
  const { queryOptions, fetcherOptions } = useAdminApiContext(options);
  return reactQuery.useQuery<ExtensionRequestListResponse, any>({
    queryKey: ["farm-management", "farmer", "requests", "extension", variables.queryParams],
    queryFn: ({ signal }) =>
      fetchExtensionRequests({ ...fetcherOptions, ...variables }, signal),
    ...queryOptions,
    ...options,
  });
};

export const fetchExtensionRequestRead = (
  variables: ExtensionRequestReadVariables,
  signal?: AbortSignal,
) =>
  adminApiFetch<ExtensionRequest, any, undefined, {}, {}, { id: number }>({
    url: "/farm-management/farmer/requests/extension/{id}",
    method: "get",
    ...variables,
    signal,
  });

export const useExtensionRequestRead = (
  variables: ExtensionRequestReadVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<ExtensionRequest, any>,
    "queryKey" | "queryFn"
  >,
) => {
  const { queryOptions, fetcherOptions } = useAdminApiContext(options);
  return reactQuery.useQuery<ExtensionRequest, any>({
    queryKey: ["farm-management", "farmer", "requests", "extension", variables.pathParams.id],
    queryFn: ({ signal }) =>
      fetchExtensionRequestRead({ ...fetcherOptions, ...variables }, signal),
    ...queryOptions,
    ...options,
  });
};

// Single endpoint handles both approve and reject via `review_action`, same
// shape as Harvest Requests' review endpoint - see
// PUT /farm-management/farmer/requests/extension/{id}/review
// body: { "review_action": "approve" | "reject", "comments": "" }
// (note: `comments`, plural - unlike Harvest Requests' `comment`)
export const reviewExtensionRequest = (
  variables: ExtensionRequestReviewVariables,
  signal?: AbortSignal,
) =>
  adminApiFetch<
    ExtensionRequest,
    any,
    { review_action: "approve" | "reject"; comments: string },
    {},
    {},
    { id: number }
  >({
    url: "/farm-management/farmer/requests/extension/{id}/review",
    method: "put",
    ...variables,
    signal,
  });

export const useReviewExtensionRequest = (
  options?: Omit<
    reactQuery.UseMutationOptions<ExtensionRequest, any, ExtensionRequestReviewVariables>,
    "mutationFn"
  >,
) => {
  const { fetcherOptions } = useAdminApiContext();
  return reactQuery.useMutation<ExtensionRequest, any, ExtensionRequestReviewVariables>({
    mutationFn: (variables) =>
      reviewExtensionRequest({ ...fetcherOptions, ...variables }),
    ...options,
  });
};
