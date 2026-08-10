"use client";

import { AdminApiContext, useAdminApiContext } from "@/apis/adminApiContext";
import { adminApiFetch } from "@/apis/adminApiFetcher";
// NOTE: hand-written rather than generated, same reason as harvestRequestApi.ts -
// these endpoints aren't in openapi.json yet. Once the backend adds them to
// the OpenAPI spec and the client is regenerated, this file can be deleted
// in favor of the generated equivalent - just update the call sites under
// src/modules/SupplyChainManagement to match.
//
// Source: bulk-upload-and-satellite-imagery.md
//   GET  /api/v1/inflow/upload-template
//   POST /api/v1/inflow/bulk-upload   (multipart/form-data, field "file")
//   GET  /api/v1/outflow/upload-template
//   POST /api/v1/outflow/bulk-upload  (multipart/form-data, field "file")

import * as reactQuery from "@tanstack/react-query";

export type BulkUploadOrderType = "inflow" | "outflow";

export interface BulkUploadCreatedOrder {
  order_reference: string;
  order_id: string;
  id: number;
}

export interface BulkUploadFailedOrder {
  order_reference: string;
  // Excel row numbers (1-indexed, header is row 1) - show these directly
  // so the user can jump straight to the bad row in their spreadsheet.
  rows: number[];
  errors: string[];
}

export interface BulkUploadResponse {
  created_count: number;
  failed_count: number;
  created: BulkUploadCreatedOrder[];
  failed: BulkUploadFailedOrder[];
}

// The two failure shapes the endpoint can return instead of the normal
// created/failed body: a single top-level error string (bad file format,
// missing required columns, or no file sent at all), or a generic wrapper
// for anything else (auth/permission errors etc).
export type BulkUploadError =
  | { status: 400; payload: { error: string } }
  | { status: 403; payload: { error?: string; detail?: string } }
  | { status: "unknown"; payload: string };

type UploadTemplateVariables = AdminApiContext["fetcherOptions"];

const fetchInflowTemplate = (variables: UploadTemplateVariables, signal?: AbortSignal) =>
  adminApiFetch<Blob, BulkUploadError, undefined, {}, {}, {}>(
    { url: "/inflow/upload-template", method: "get", ...variables, signal }
  );

const fetchOutflowTemplate = (variables: UploadTemplateVariables, signal?: AbortSignal) =>
  adminApiFetch<Blob, BulkUploadError, undefined, {}, {}, {}>(
    { url: "/outflow/upload-template", method: "get", ...variables, signal }
  );

type BulkUploadVariables = {
  body: FormData;
} & AdminApiContext["fetcherOptions"];

const uploadInflowBulk = (variables: BulkUploadVariables, signal?: AbortSignal) =>
  adminApiFetch<BulkUploadResponse, BulkUploadError, FormData, {}, {}, {}>(
    {
      url: "/inflow/bulk-upload",
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
      ...variables,
      signal,
    }
  );

const uploadOutflowBulk = (variables: BulkUploadVariables, signal?: AbortSignal) =>
  adminApiFetch<BulkUploadResponse, BulkUploadError, FormData, {}, {}, {}>(
    {
      url: "/outflow/bulk-upload",
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
      ...variables,
      signal,
    }
  );

// Triggers a browser "Save As" for a blob response - used for both
// template downloads.
function saveBlobAsFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Downloads and saves the template in one call - most call sites just want
// "download this when the button is clicked" rather than the raw blob.
export const useDownloadOrderTemplate = (
  type: BulkUploadOrderType,
  options?: Omit<
    reactQuery.UseMutationOptions<Blob, BulkUploadError, void>,
    "mutationFn"
  >,
) => {
  const { fetcherOptions } = useAdminApiContext();
  return reactQuery.useMutation<Blob, BulkUploadError, void>({
    mutationFn: async () => {
      const blob =
        type === "inflow"
          ? await fetchInflowTemplate(fetcherOptions)
          : await fetchOutflowTemplate(fetcherOptions);
      saveBlobAsFile(
        blob,
        type === "inflow" ? "inbound_orders_template.xlsx" : "outbound_orders_template.xlsx"
      );
      return blob;
    },
    ...options,
  });
};

export const useBulkUploadOrders = (
  type: BulkUploadOrderType,
  options?: Omit<
    reactQuery.UseMutationOptions<BulkUploadResponse, BulkUploadError, File>,
    "mutationFn"
  >,
) => {
  const { fetcherOptions } = useAdminApiContext();
  return reactQuery.useMutation<BulkUploadResponse, BulkUploadError, File>({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const variables = { ...fetcherOptions, body: formData };
      return type === "inflow"
        ? uploadInflowBulk(variables)
        : uploadOutflowBulk(variables);
    },
    ...options,
  });
};