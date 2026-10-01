"use client";

import * as reactQuery from "@tanstack/react-query";
import { AdminApiContext, useAdminApiContext } from "./adminApiContext";
import { adminApiFetch } from "./adminApiFetcher";

/**
 * Hand-written hooks for `/farm-management/projects`.
 *
 * The generated client (`adminApiComponents.ts`) doesn't contain these
 * endpoints yet. Once the backend swagger is regenerated
 * (`yarn generate-apis`) these can be swapped for the generated hooks.
 *
 *   GET  /farm-management/projects   -> list projects
 *   POST /farm-management/projects   -> create a project  { name: string }
 */

export type Project = {
  id: number;
  name: string;
};

export type ProjectListQueryParams = {
  query?: string;
  page?: number;
  page_size?: number;
};

// The list endpoint may be paginated ({ results, pagination }) like the other
// farm-management lists, or a plain array. Both shapes are handled.
export type ProjectListResponse =
  | Project[]
  | {
      results?: Project[];
      pagination?: {
        total?: number;
        page?: number;
        pages?: number;
        has_next?: boolean;
        has_previous?: boolean;
      };
    };

export type ProjectCreateBody = {
  name: string;
};

export const PROJECTS_QUERY_KEY = ["farm-management", "projects"] as const;

export const normalizeProjects = (data?: ProjectListResponse): Project[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : (data.results ?? []);
};

export const fetchProjectList = (
  variables: { queryParams?: ProjectListQueryParams } & AdminApiContext["fetcherOptions"],
  signal?: AbortSignal,
) =>
  adminApiFetch<ProjectListResponse, any, undefined, {}, ProjectListQueryParams, {}>({
    url: "/farm-management/projects",
    method: "get",
    ...variables,
    signal,
  });

export const fetchProjectCreate = (
  variables: { body: ProjectCreateBody } & AdminApiContext["fetcherOptions"],
  signal?: AbortSignal,
) =>
  adminApiFetch<Project, any, ProjectCreateBody, {}, {}, {}>({
    url: "/farm-management/projects",
    method: "post",
    ...variables,
    signal,
  });

export const useProjectList = (
  variables: { queryParams?: ProjectListQueryParams },
  options?: Omit<
    reactQuery.UseQueryOptions<ProjectListResponse, any>,
    "queryKey" | "queryFn"
  >,
) => {
  const { queryOptions, fetcherOptions } = useAdminApiContext(options);
  return reactQuery.useQuery<ProjectListResponse, any>({
    queryKey: [...PROJECTS_QUERY_KEY, variables.queryParams],
    queryFn: ({ signal }) =>
      fetchProjectList({ ...fetcherOptions, ...variables }, signal),
    ...queryOptions,
    ...options,
  });
};

export const useProjectCreate = (
  options?: Omit<
    reactQuery.UseMutationOptions<Project, any, { body: ProjectCreateBody }>,
    "mutationFn"
  >,
) => {
  const { fetcherOptions } = useAdminApiContext();
  const queryClient = reactQuery.useQueryClient();
  return reactQuery.useMutation<Project, any, { body: ProjectCreateBody }>({
    mutationFn: (variables) =>
      fetchProjectCreate({ ...fetcherOptions, ...variables }),
    ...options,
    onSuccess: (...args) => {
      // Make every open project dropdown pick up the new project.
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      return options?.onSuccess?.(...args);
    },
  });
};
