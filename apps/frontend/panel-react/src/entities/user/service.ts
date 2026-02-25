import {
  IResList,
  IReqItems,
  IFetchUpdate,
  IUser,
  IUsersRoles,
  TUserCreate,
  TUserUpdate,
  TUserReqList,
  TUserResList,
} from "@ap/shared/dist/types";
import { IFetchArgs, IFetchRes } from "@/app/api/types";
import { serverFetch } from "@/app/api/serverFetch";
import { ROUTES } from "@/shared/lib/constants";

class UsersService {
  createArgs(payload: TUserCreate): IFetchArgs {
    return {
      url: ROUTES.api.users._,
      method: "POST",
      credentials: "include",
      body: payload,
    };
  }

  getOneArgs(payload: IUser["id"]): IFetchArgs {
    return {
      url: ROUTES.api.users.user(payload),
      method: "GET",
      credentials: "include",
    };
  }

  async getOne(payload: IUser["id"]): Promise<IFetchRes<IUser>> {
    return serverFetch<IUser>(this.getOneArgs(payload));
  }

  getListArgs(payload?: TUserReqList): IFetchArgs {
    return {
      url: ROUTES.api.users._,
      method: "GET",
      credentials: "include",
      params: payload as Record<string, unknown>,
    };
  }

  async getList(payload?: TUserReqList): Promise<IFetchRes<TUserResList>> {
    return serverFetch<IResList<IUser>>(this.getListArgs(payload));
  }

  updateArgs(payload: IFetchUpdate<TUserUpdate, IUser["id"]>): IFetchArgs {
    return {
      url: ROUTES.api.users.user(payload.id),
      method: "PATCH",
      credentials: "include",
      body: payload.fields,
    };
  }

  updateRolesArgs(
    payload: IFetchUpdate<IReqItems<IUsersRoles>, IUser["id"]>,
  ): IFetchArgs {
    return {
      url: ROUTES.api.users.userRoles(payload.id),
      method: "PATCH",
      credentials: "include",
      body: payload.fields,
    };
  }

  deleteArgs(payload: IReqItems<IUser["id"]>): IFetchArgs {
    return {
      url: ROUTES.api.users._,
      method: "DELETE",
      credentials: "include",
      body: payload,
    };
  }
}

export const usersService = new UsersService();
