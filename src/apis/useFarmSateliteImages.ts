import * as reactQuery from "@tanstack/react-query";
import { AdminApiContext, useAdminApiContext } from "@/apis/adminApiContext";
import { adminApiFetch } from "@/apis/adminApiFetcher";

// NOTE: hand-written rather than generated, same reason as useFarmWeather.ts -
// this endpoint isn't in openapi.json yet.
//
// GET /api/v1/agro-monitoring/{farm_id}/satellite-images?days=30
//
// Unlike weather/soil_quality on the same viewset, this one DOES require
// the farm to have a boundary/polygon registered - the backend returns a
// 400 with {"message": "Could not find farm polygon"} if it doesn't.
// Source: bulk-upload-and-satellite-imagery.md

export interface SatelliteImageUrlSet {
  truecolor?: string;
  falsecolor?: string;
  ndvi?: string;
  evi?: string;
  evi2?: string;
  nri?: string;
  dswi?: string;
  ndwi?: string;
}

export type SatelliteImageIndex = keyof SatelliteImageUrlSet;

export interface FarmSatelliteImage {
  id: number;
  date_created: string;
  date_modified: string;
  date_deleted: string | null;
  is_active: boolean;
  provider: string | null;
  day_key: string;
  dt: string;
  source: string;
  cloud_coverage: number;
  data_coverage: number;
  sun_elevation: number;
  sun_azimuth: number;
  image_urls: SatelliteImageUrlSet;
  tile_urls: SatelliteImageUrlSet;
  stats_urls: SatelliteImageUrlSet;
  data_urls: SatelliteImageUrlSet;
  response: unknown;
  created_by: number | null;
  deleted_by: number | null;
  farm: number | null;
}

export type FarmSatelliteImagesError =
  | { status: 400; payload: { message: string } }
  | { status: "unknown"; payload: string };

type FarmSatelliteImagesVariables = {
  pathParams: { farm_id: number | string };
  queryParams?: { days?: number };
} & AdminApiContext["fetcherOptions"];

export const fetchFarmSatelliteImages = async (
  variables: FarmSatelliteImagesVariables,
  signal?: AbortSignal,
) => {
  // The backend wraps this endpoint's payload in { results: [...] } (same
  // as the paginated list endpoints), it does NOT return a bare array like
  // this hook originally assumed. Unwrap it here so every consumer of this
  // hook can keep treating the data as FarmSatelliteImage[].
  const response = await adminApiFetch<
    { results: FarmSatelliteImage[] },
    FarmSatelliteImagesError,
    undefined,
    {},
    { days?: number },
    { farm_id: number | string }
  >(
    { url: "/agro-monitoring/{farm_id}/satellite-images", method: "get", ...variables, signal },
  );
  return response.results;
};

export const useFarmSatelliteImages = <TData = FarmSatelliteImage[]>(
  variables: Omit<FarmSatelliteImagesVariables, keyof AdminApiContext["fetcherOptions"]> & {
    queryParams?: FarmSatelliteImagesVariables["queryParams"];
  },
  options?: Omit<
    reactQuery.UseQueryOptions<FarmSatelliteImage[], FarmSatelliteImagesError, TData>,
    "queryKey" | "queryFn"
  >,
) => {
  const { fetcherOptions, queryOptions } = useAdminApiContext(options);
  return reactQuery.useQuery<FarmSatelliteImage[], FarmSatelliteImagesError, TData>({
    queryKey: [
      "agro-monitoring",
      variables.pathParams.farm_id,
      "satellite-images",
      variables.queryParams?.days ?? 30,
    ],
    queryFn: ({ signal }) =>
      fetchFarmSatelliteImages({ ...fetcherOptions, ...variables }, signal),
    staleTime: 5 * 60 * 1000,
    ...queryOptions,
    ...options,
  });
};