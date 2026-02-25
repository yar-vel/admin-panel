import { createApi } from "@reduxjs/toolkit/query/react";

import {
  IChangeEmailConfirm,
  IChangeEmailRequest,
  IReqItems,
  IUpdatePassword,
  IUser,
  TSessionExternal,
  TUserUpdate,
} from "@ap/shared/dist/types";
import { profileService } from "./service";
import { baseQueryWithReauth } from "@/app/api/baseQueryWithReauth";

export const profileApi = createApi({
  reducerPath: "profile",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getProfile: builder.query<IUser, void>({
      query: profileService.getProfileArgs,
    }),

    updateProfile: builder.mutation<undefined, TUserUpdate>({
      query: profileService.updateProfileArgs,
    }),

    updatePassword: builder.mutation<undefined, IUpdatePassword>({
      query: profileService.updatePasswordArgs,
    }),

    changeEmailRequest: builder.mutation<undefined, IChangeEmailRequest>({
      query: profileService.changeEmailRequestArgs,
    }),

    changeEmailConfirm: builder.mutation<undefined, IChangeEmailConfirm>({
      query: profileService.changeEmailConfirmArgs,
    }),

    getSessions: builder.query<TSessionExternal[], void>({
      query: profileService.getSessionsArgs,
    }),

    deleteSessions: builder.mutation<
      undefined,
      IReqItems<TSessionExternal["id"]>
    >({
      query: profileService.deleteSessionsArgs,
    }),
  }),
});
