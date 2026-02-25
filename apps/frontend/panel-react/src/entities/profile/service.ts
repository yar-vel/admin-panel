import { serverFetch } from "@/app/api/serverFetch";
import { IFetchArgs, IFetchRes } from "@/app/api/types";
import { ROUTES } from "@/shared/lib/constants";
import {
  IChangeEmailConfirm,
  IChangeEmailRequest,
  IReqItems,
  IUpdatePassword,
  IUser,
  TSessionExternal,
  TUserUpdate,
} from "@ap/shared/dist/types";

class ProfileService {
  getProfileArgs(): IFetchArgs {
    return {
      url: ROUTES.api.profile._,
      method: "GET",
      credentials: "include",
    };
  }

  async getProfile(): Promise<IFetchRes<IUser>> {
    return serverFetch<IUser>(this.getProfileArgs());
  }

  updateProfileArgs(payload: TUserUpdate): IFetchArgs {
    return {
      url: ROUTES.api.profile._,
      method: "PATCH",
      credentials: "include",
      body: payload,
    };
  }

  updatePasswordArgs(payload: IUpdatePassword): IFetchArgs {
    return {
      url: ROUTES.api.profile.updatePassword,
      method: "PATCH",
      credentials: "include",
      body: payload,
    };
  }

  changeEmailRequestArgs(payload: IChangeEmailRequest): IFetchArgs {
    return {
      url: ROUTES.api.profile.changeEmail,
      method: "POST",
      credentials: "include",
      body: payload,
    };
  }

  changeEmailConfirmArgs(payload: IChangeEmailConfirm): IFetchArgs {
    return {
      url: ROUTES.api.profile.changeEmail,
      method: "PATCH",
      credentials: "include",
      body: payload,
    };
  }

  getSessionsArgs(): IFetchArgs {
    return {
      url: ROUTES.api.profile.sessions,
      method: "GET",
      credentials: "include",
    };
  }

  deleteSessionsArgs(payload: IReqItems<TSessionExternal["id"]>): IFetchArgs {
    return {
      url: ROUTES.api.profile.sessions,
      method: "DELETE",
      credentials: "include",
      body: payload,
    };
  }
}

export const profileService = new ProfileService();
