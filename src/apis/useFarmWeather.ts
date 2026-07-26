import * as reactQuery from "@tanstack/react-query";
import { adminApiFetch } from "./adminApiFetcher";
import { useAdminApiContext, AdminApiContext } from "./adminApiContext";

// NOTE: this hook is hand-written rather than generated, because the
// weather endpoint (GET /api/v1/weather/{farm_id}) isn't in openapi.json
// yet. Once the backend adds it to the OpenAPI spec and the client is
// regenerated (see openapi-codegen.config.ts), this can be deleted in
// favor of the generated equivalent - just make sure to update the one
// call site (src/modules/FarmMonitoring/Weather.tsx) to match.

export interface FarmWeatherResponse {
  farm_id: number;
  location?: { name?: string; region?: string };
  current: {
    temperature_c: number;
    condition: string;
    humidity: number;
    wind_kph: number;
    rainfall_mm: number;
  };
  alerts?: Array<{ headline: string; severity: string }>;
  last_updated: string;
}

// The backend requires a farm to have a `boundary` (GeoJSON Polygon) set
// before it can return weather for it - see the farm creation payload's
// new `boundary` field. This error shape lets the UI distinguish "no
// boundary set" from a generic failure so it can prompt the user to set
// one, rather than just showing a blank error.
export type FarmWeatherError =
  | { status: 400 | 404; payload: { boundary?: string[]; detail?: string } }
  | { status: "unknown"; payload: string };

type FarmWeatherVariables = {
  pathParams: { farm_id: number | string };
} & AdminApiContext["fetcherOptions"];

export const fetchFarmWeather = (
  variables: FarmWeatherVariables,
  signal?: AbortSignal,
) =>
  adminApiFetch<FarmWeatherResponse, FarmWeatherError, undefined, {}, {}, { farm_id: number | string }>(
    { url: "/weather/{farm_id}", method: "get", ...variables, signal },
  );

export const useFarmWeather = <TData = FarmWeatherResponse,>(
  variables: FarmWeatherVariables,
  options?: Omit<
    reactQuery.UseQueryOptions<FarmWeatherResponse, FarmWeatherError, TData>,
    "queryKey" | "queryFn"
  >,
) => {
  const { fetcherOptions } = useAdminApiContext();
  return reactQuery.useQuery<FarmWeatherResponse, FarmWeatherError, TData>({
    queryKey: ["farmWeather", variables.pathParams.farm_id],
    queryFn: ({ signal }) =>
      fetchFarmWeather({ ...fetcherOptions, ...variables }, signal),
    ...options,
  });
};
