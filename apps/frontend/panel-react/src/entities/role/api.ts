import { fetchWithAuth } from "@/shared/api/fetchWithAuth";
import { ROUTES } from "@/shared/lib/constants";
import {
  IFetchUpdate,
  IReqItems,
  IRights,
  IRole,
  TRoleCreate,
  TRoleReqList,
  TRoleResList,
  TRoleUpdate,
} from "@workspace/shared/dist/types";

export const createRole = async (payload: TRoleCreate): Promise<IRole> => {
  const response = await fetchWithAuth(ROUTES.api.roles._, {
    method: "POST",
    credentials: "include",
    body: payload,
  });

  return response.json();
};

export const getRole = async (
  id: IRole["id"],
  headers?: HeadersInit,
): Promise<IRole> => {
  const response = await fetchWithAuth(ROUTES.api.roles.role(id), {
    method: "GET",
    credentials: "include",
    headers,
  });

  return response.json();
};

export const getRoleList = async (
  params?: TRoleReqList,
  headers?: HeadersInit,
): Promise<TRoleResList> => {
  const response = await fetchWithAuth(ROUTES.api.roles._, {
    method: "GET",
    credentials: "include",
    params,
    headers,
  });

  return response.json();
};

export const updateRole = async ({
  id,
  fields,
}: IFetchUpdate<TRoleUpdate, IRole["id"]>): Promise<void> => {
  await fetchWithAuth(ROUTES.api.roles.role(id), {
    method: "PATCH",
    credentials: "include",
    body: fields,
  });
};

export const updateRoleRights = async ({
  id,
  fields,
}: IFetchUpdate<IReqItems<IRights>, IRole["id"]>): Promise<void> => {
  await fetchWithAuth(ROUTES.api.roles.roleRights(id), {
    method: "PATCH",
    credentials: "include",
    body: fields,
  });
};

export const deleteRoles = async (
  payload: IReqItems<IRole["id"]>,
): Promise<void> => {
  await fetchWithAuth(ROUTES.api.roles._, {
    method: "DELETE",
    credentials: "include",
    body: payload,
  });
};
