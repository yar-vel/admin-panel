import { fetchWithAuth } from "@/shared/api/fetchWithAuth";
import { ROUTES } from "@/shared/lib/constants";
import {
  IFetchUpdate,
  IReqItems,
  IResource,
  TResourceCreate,
  TResourceReqList,
  TResourceResList,
  TResourceUpdate,
} from "@workspace/shared/dist/types";

export const createResource = async (
  payload: TResourceCreate,
): Promise<IResource> => {
  const response = await fetchWithAuth(ROUTES.api.resources._, {
    method: "POST",
    credentials: "include",
    body: payload,
  });

  return response.json();
};

export const getResource = async (
  id: IResource["id"],
  headers?: HeadersInit,
): Promise<IResource> => {
  const response = await fetchWithAuth(ROUTES.api.resources.resource(id), {
    method: "GET",
    credentials: "include",
    headers,
  });

  return response.json();
};

export const getResourceList = async (
  params?: TResourceReqList,
  headers?: HeadersInit,
): Promise<TResourceResList> => {
  const response = await fetchWithAuth(ROUTES.api.resources._, {
    method: "GET",
    credentials: "include",
    params,
    headers,
  });

  return response.json();
};

export const updateResource = async ({
  id,
  fields,
}: IFetchUpdate<TResourceUpdate, IResource["id"]>): Promise<void> => {
  await fetchWithAuth(ROUTES.api.resources.resource(id), {
    method: "PATCH",
    credentials: "include",
    body: fields,
  });
};

export const deleteResources = async (
  payload: IReqItems<IResource["id"]>,
): Promise<void> => {
  await fetchWithAuth(ROUTES.api.resources._, {
    method: "DELETE",
    credentials: "include",
    body: payload,
  });
};
