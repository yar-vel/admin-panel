import {
  IReqItems,
  IRights,
  IRole,
  TRoleCreate,
  TRoleUpdate,
  TRoleReqList,
  TRoleResList,
  IFetchUpdate,
} from "@ap/shared/dist/types";
import { IFetchArgs, IFetchRes } from "@/app/api/types";
import { serverFetch } from "@/app/api/serverFetch";
import { ROUTES } from "@/shared/lib/constants";

class RolesService {
  createArgs(payload: TRoleCreate): IFetchArgs {
    return {
      url: ROUTES.api.roles._,
      method: "POST",
      credentials: "include",
      body: payload,
    };
  }

  getOneArgs(payload: IRole["id"]): IFetchArgs {
    return {
      url: ROUTES.api.roles.role(payload),
      method: "GET",
      credentials: "include",
    };
  }

  async getOne(payload: IRole["id"]): Promise<IFetchRes<IRole>> {
    return serverFetch<IRole>(this.getOneArgs(payload));
  }

  getListArgs(payload?: TRoleReqList): IFetchArgs {
    return {
      url: ROUTES.api.roles._,
      method: "GET",
      credentials: "include",
      params: payload as Record<string, unknown>,
    };
  }

  async getList(payload?: TRoleReqList): Promise<IFetchRes<TRoleResList>> {
    return serverFetch<TRoleResList>(this.getListArgs(payload));
  }

  updateArgs(payload: IFetchUpdate<TRoleUpdate, IRole["id"]>): IFetchArgs {
    return {
      url: ROUTES.api.roles.role(payload.id),
      method: "PATCH",
      credentials: "include",
      body: payload.fields,
    };
  }

  updateRightsArgs(
    payload: IFetchUpdate<IReqItems<IRights>, IRole["id"]>,
  ): IFetchArgs {
    return {
      url: ROUTES.api.roles.roleRights(payload.id),
      method: "PATCH",
      credentials: "include",
      body: payload.fields,
    };
  }

  deleteArgs(payload: IReqItems<IRole["id"]>): IFetchArgs {
    return {
      url: ROUTES.api.roles._,
      method: "DELETE",
      credentials: "include",
      body: payload,
    };
  }
}

export const rolesService = new RolesService();
