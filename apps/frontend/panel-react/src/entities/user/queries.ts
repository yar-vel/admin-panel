import { queryOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";

import {
  IUser,
  TUserReqList,
  TUserResList,
} from "@workspace/shared";
import { getUser, getUserList } from "./api";
import { userKeys } from "./keys";

export const userQueryOptions = (id: IUser["id"], headers?: HeadersInit) =>
  queryOptions({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id, headers),
  });

export const useUserQuery = (...args: Parameters<typeof userQueryOptions>) =>
  useQuery(userQueryOptions(...args));

export const userListQueryOptions = (
  params?: TUserReqList,
  options?: Omit<UseQueryOptions<TUserResList>, "queryKey" | "queryFn">,
  headers?: HeadersInit,
) =>
  queryOptions({
    queryKey: userKeys.list(params),
    queryFn: () => getUserList(params, headers),
    ...options,
  });

export const useUserListQuery = (
  ...args: Parameters<typeof userListQueryOptions>
) => useQuery(userListQueryOptions(...args));
