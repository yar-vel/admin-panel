import { fetchWithAuth } from "@/shared/api/fetchWithAuth";
import { ROUTES } from "@/shared/lib/constants";
import {
  IChangeEmailConfirm,
  IChangeEmailRequest,
  IReqItems,
  IUpdatePassword,
  IUser,
  TSessionExternal,
  TUserUpdate,
} from "@workspace/shared/dist/types";

export const getProfile = async (headers?: HeadersInit): Promise<IUser> => {
  const response = await fetchWithAuth(ROUTES.api.profile._, {
    method: "GET",
    credentials: "include",
    headers,
  });

  return response.json();
};

export const updateProfile = async (payload: TUserUpdate): Promise<void> => {
  await fetchWithAuth(ROUTES.api.profile._, {
    method: "PATCH",
    credentials: "include",
    body: payload,
  });
};

export const updatePassword = async (
  payload: IUpdatePassword,
): Promise<void> => {
  await fetchWithAuth(ROUTES.api.profile.updatePassword, {
    method: "PATCH",
    credentials: "include",
    body: payload,
  });
};

export const changeEmailRequest = async (
  payload: IChangeEmailRequest,
): Promise<void> => {
  await fetchWithAuth(ROUTES.api.profile.changeEmail, {
    method: "POST",
    credentials: "include",
    body: payload,
  });
};

export const changeEmailConfirm = async (
  payload: IChangeEmailConfirm,
): Promise<void> => {
  await fetchWithAuth(ROUTES.api.profile.changeEmail, {
    method: "PATCH",
    credentials: "include",
    body: payload,
  });
};

export const getSessions = async (
  headers?: HeadersInit,
): Promise<TSessionExternal[]> => {
  const response = await fetchWithAuth(ROUTES.api.profile.sessions, {
    method: "GET",
    credentials: "include",
    headers,
  });

  return response.json();
};

export const deleteSessions = async (
  payload: IReqItems<TSessionExternal["id"]>,
): Promise<void> => {
  await fetchWithAuth(ROUTES.api.profile.sessions, {
    method: "DELETE",
    credentials: "include",
    body: payload,
  });
};
