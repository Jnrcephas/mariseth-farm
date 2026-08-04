import * as reactQuery from "@tanstack/react-query";
import { adminApiFetch } from "./adminApiFetcher";
import { useAdminApiContext, AdminApiContext } from "./adminApiContext";

// NOTE: this hook is hand-written rather than generated, because the
// weather endpoint isn't in openapi.json yet. Once the backend adds it to
// the OpenAPI spec and the client is regenerated (see
// openapi-codegen.config.ts), this can be deleted in favor of the generated
// equivalent - just make sure to update the one call site
// (src/modules/FarmMonitoring/Weather.tsx) to match.
//
// GET /api/v1/agro-monitoring/{farm_id}/weather - real payload confirmed by
// backend, raw OpenWeather-style reading (temps in Kelvin, wind in m/s).

export interface FarmWeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface FarmWeatherResponse {
  id: number;
  date_created: string;
  date_modified: string;
  date_deleted: string | null;
  is_active: boolean;
  provider: string | null;
  hour_key: string;
  lat: number;
  lon: number;
  sunrise: string | null;
  sunset: string | null;
  temp: number;
  temp_max: number;
  temp_min: number;
  pressure: number;
  humidity: number;
  dew_point: number | null;
  uvi: number | null;
  clouds: number;
  visibility: number | null;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number | null;
  weather: FarmWeatherCondition[];
  created_by: number | null;
  deleted_by: number | null;
  farm: number | null;
}

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
    { url: "/agro-monitoring/{farm_id}/weather", method: "get", ...variables, signal },
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

// OpenWeather-style readings come back in Kelvin - convert for display.
export const kelvinToCelsius = (kelvin: number) => kelvin - 273.15;

// wind_speed comes back in m/s - convert for display.
export const mpsToKph = (mps: number) => mps * 3.6;
