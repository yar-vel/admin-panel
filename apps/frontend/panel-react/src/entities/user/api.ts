import { fetchWithAuth } from "@/shared/api/fetchWithAuth";
import { ROUTES } from "@/shared/lib/constants";
import {
  TUserCreate,
  IUser,
  TUserReqList,
  TUserResList,
  IFetchUpdate,
  TUserUpdate,
  IReqItems,
  IUsersRoles,
} from "@workspace/shared/dist/types";

export const createUser = async (payload: TUserCreate): Promise<IUser> => {
  const response = await fetchWithAuth(ROUTES.api.users._, {
    method: "POST",
    credentials: "include",
    body: payload,
  });

  return response.json();
};

export const getUser = async (
  id: IUser["id"],
  headers?: HeadersInit,
): Promise<IUser> => {
  const response = await fetchWithAuth(ROUTES.api.users.user(id), {
    method: "GET",
    credentials: "include",
    headers,
  });

  return response.json();
};

export const getUserList = async (
  params?: TUserReqList,
  headers?: HeadersInit,
): Promise<TUserResList> => {
  const response = await fetchWithAuth(ROUTES.api.users._, {
    method: "GET",
    credentials: "include",
    params,
    headers,
  });

  return response.json();
};

export const updateUser = async ({
  id,
  fields,
}: IFetchUpdate<TUserUpdate, IUser["id"]>): Promise<void> => {
  await fetchWithAuth(ROUTES.api.users.user(id), {
    method: "PATCH",
    credentials: "include",
    body: fields,
  });
};

export const updateUserRoles = async ({
  id,
  fields,
}: IFetchUpdate<IReqItems<IUsersRoles>, IUser["id"]>): Promise<void> => {
  await fetchWithAuth(ROUTES.api.users.userRoles(id), {
    method: "PATCH",
    credentials: "include",
    body: fields,
  });
};

export const deleteUsers = async (
  payload: IReqItems<IUser["id"]>,
): Promise<void> => {
  await fetchWithAuth(ROUTES.api.users._, {
    method: "DELETE",
    credentials: "include",
    body: payload,
  });
};
