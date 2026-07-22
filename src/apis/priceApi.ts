"use client";

import * as reactQuery from "@tanstack/react-query";
import { AdminApiContext, useAdminApiContext } from "./adminApiContext";
import { adminApiFetch } from "./adminApiFetcher";

export type PriceHistoryFilters = {
  page?: number;
  page_size?: number;
  product?: string;
  currency?: string;
};

export type PriceHistoryListVariables = {
  queryParams?: PriceHistoryFilters;
} & AdminApiContext["fetcherOptions"];

export type PriceUpdateVariables = {
  body: {
    price_list: {
      product: string;
      price: number;
    }[];
  };
} & AdminApiContext["fetcherOptions"];

export type PriceHistoryListResponse = {
  export_response?: string | null;
  results?: any[];
  pagination?: {
    total: number;
    page: number;
    pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
};

export const fetchPriceHistory = (
  variables: PriceHistoryListVariables,
  signal?: AbortSignal,
) =>
  adminApiFetch<PriceHistoryListResponse, any, undefined, {}, PriceHistoryFilters, {}>({
    url: "/prices",
    method: "get",
    ...variables,
    signal,
  });

export const usePriceHistory = (
  variables: PriceHistoryListVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<PriceHistoryListResponse, any>,
    "queryKey" | "queryFn"
  >,
) => {
  const { queryOptions, fetcherOptions } = useAdminApiContext(options);
  return reactQuery.useQuery<PriceHistoryListResponse, any>({
    queryKey: ["prices", variables.queryParams],
    queryFn: ({ signal }) =>
      fetchPriceHistory({ ...fetcherOptions, ...variables }, signal),
    ...queryOptions,
    ...options,
  });
};

export const updatePrices = (
  variables: PriceUpdateVariables,
  signal?: AbortSignal,
) =>
  adminApiFetch<any, any, { price_list: { product: string; price: number }[] }, {}, {}, {}>({
    url: "/prices",
    method: "post",
    ...variables,
    signal,
  });

export const useUpdatePrices = (
  options?: Omit<
    reactQuery.UseMutationOptions<any, any, PriceUpdateVariables>,
    "mutationFn"
  >,
) => {
  const { fetcherOptions } = useAdminApiContext();
  return reactQuery.useMutation<any, any, PriceUpdateVariables>({
    mutationFn: (variables) => updatePrices({ ...fetcherOptions, ...variables }),
    ...options,
  });
};
