import { queryOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";

import {
  IResource,
  TResourceReqList,
  TResourceResList,
} from "@workspace/shared/dist/types";
import { getResource, getResourceList } from "./api";
import { resourceKeys } from "./keys";

export const resourceQueryOptions = (
  id: IResource["id"],
  headers?: HeadersInit,
) =>
  queryOptions({
    queryKey: resourceKeys.detail(id),
    queryFn: () => getResource(id, headers),
  });

export const useResourceQuery = (
  ...args: Parameters<typeof resourceQueryOptions>
) => useQuery(resourceQueryOptions(...args));

export const resourceListQueryOptions = (
  params?: TResourceReqList,
  options?: Omit<UseQueryOptions<TResourceResList>, "queryKey" | "queryFn">,
  headers?: HeadersInit,
) =>
  queryOptions({
    queryKey: resourceKeys.list(params),
    queryFn: () => getResourceList(params, headers),
    ...options,
  });

export const useResourceListQuery = (
  ...args: Parameters<typeof resourceListQueryOptions>
) => useQuery(resourceListQueryOptions(...args));
