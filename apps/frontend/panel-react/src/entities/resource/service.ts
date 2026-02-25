import {
  IReqItems,
  IResource,
  IFetchUpdate,
  TResourceCreate,
  TResourceUpdate,
  TResourceReqList,
  TResourceResList,
} from "@ap/shared/dist/types";
import { IFetchArgs, IFetchRes } from "@/app/api/types";
import { serverFetch } from "@/app/api/serverFetch";
import { ROUTES } from "@/shared/lib/constants";

class ResourcesService {
  createArgs(payload: TResourceCreate): IFetchArgs {
    return {
      url: ROUTES.api.resources._,
      method: "POST",
      credentials: "include",
      body: payload,
    };
  }

  getOneArgs(payload: IResource["id"]): IFetchArgs {
    return {
      url: ROUTES.api.resources.resource(payload),
      method: "GET",
      credentials: "include",
    };
  }

  async getOne(payload: IResource["id"]): Promise<IFetchRes<IResource>> {
    return serverFetch<IResource>(this.getOneArgs(payload));
  }

  getListArgs(payload?: TResourceReqList): IFetchArgs {
    return {
      url: ROUTES.api.resources._,
      method: "GET",
      credentials: "include",
      params: payload as Record<string, unknown>,
    };
  }

  async getList(
    payload?: TResourceReqList,
  ): Promise<IFetchRes<TResourceResList>> {
    return serverFetch<TResourceResList>(this.getListArgs(payload));
  }

  updateArgs(
    payload: IFetchUpdate<TResourceUpdate, IResource["id"]>,
  ): IFetchArgs {
    return {
      url: ROUTES.api.resources.resource(payload.id),
      method: "PATCH",
      credentials: "include",
      body: payload.fields,
    };
  }

  deleteArgs(payload: IReqItems<IResource["id"]>): IFetchArgs {
    return {
      url: ROUTES.api.resources._,
      method: "DELETE",
      credentials: "include",
      body: payload,
    };
  }
}

export const resourcesService = new ResourcesService();
