import { queryOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";

import {
  IRole,
  TRoleReqList,
  TRoleResList,
} from "@workspace/shared/dist/types";
import { getRole, getRoleList } from "./api";
import { roleKeys } from "./keys";

export const roleQueryOptions = (id: IRole["id"], headers?: HeadersInit) =>
  queryOptions({
    queryKey: roleKeys.detail(id),
    queryFn: () => getRole(id, headers),
  });

export const useRoleQuery = (...args: Parameters<typeof roleQueryOptions>) =>
  useQuery(roleQueryOptions(...args));

export const roleListQueryOptions = (
  params?: TRoleReqList,
  options?: Omit<UseQueryOptions<TRoleResList>, "queryKey" | "queryFn">,
  headers?: HeadersInit,
) =>
  queryOptions({
    queryKey: roleKeys.list(params),
    queryFn: () => getRoleList(params, headers),
    ...options,
  });

export const useRoleListQuery = (
  ...args: Parameters<typeof roleListQueryOptions>
) => useQuery(roleListQueryOptions(...args));
