import * as reactQuery from "@tanstack/react-query";
import { adminApiFetch } from "./adminApiFetcher";
import { useAdminApiContext, AdminApiContext } from "./adminApiContext";

// NOTE: hand-written rather than generated, same reason as useFarmWeather.ts -
// this endpoint isn't in openapi.json yet. Delete in favor of the generated
// equivalent once the backend adds it to the OpenAPI spec (update the one
// call site, src/modules/FarmMonitoring/SoilAirQuality.tsx, to match).
//
// GET /api/v1/agro-monitoring/{farm_id}/soil_quality - real payload
// confirmed by backend. No air-quality (AQI) or soil-pH data is provided by
// this endpoint - only topsoil/subsoil temperature (Kelvin) and moisture.

export interface FarmSoilQualityResponse {
  id: number;
  date_created: string;
  date_modified: string;
  date_deleted: string | null;
  is_active: boolean;
  provider: string | null;
  hour_key: string;
  dt: string;
  t10: number; // temperature at 10cm depth (subsoil), Kelvin
  moisture: number; // 0-1 fraction
  t0: number; // surface temperature (topsoil), Kelvin
  response: unknown;
  created_by: number | null;
  deleted_by: number | null;
  farm: number | null;
}

export type FarmSoilQualityError =
  | { status: 400 | 404; payload: { detail?: string } }
  | { status: "unknown"; payload: string };

type FarmSoilQualityVariables = {
  pathParams: { farm_id: number | string };
} & AdminApiContext["fetcherOptions"];

export const fetchFarmSoilQuality = (
  variables: FarmSoilQualityVariables,
  signal?: AbortSignal,
) =>
  adminApiFetch<FarmSoilQualityResponse, FarmSoilQualityError, undefined, {}, {}, { farm_id: number | string }>(
    { url: "/agro-monitoring/{farm_id}/soil_quality", method: "get", ...variables, signal },
  );

export const useFarmSoilQuality = <TData = FarmSoilQualityResponse,>(
  variables: FarmSoilQualityVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<FarmSoilQualityResponse, FarmSoilQualityError, TData>,
    "queryKey" | "queryFn"
  >,
) => {
  const { fetcherOptions } = useAdminApiContext();
  return reactQuery.useQuery<FarmSoilQualityResponse, FarmSoilQualityError, TData>({
    queryKey: ["farmSoilQuality", variables.pathParams.farm_id],
    queryFn: ({ signal }) =>
      fetchFarmSoilQuality({ ...fetcherOptions, ...variables }, signal),
    ...options,
  });
};
