import { createApi } from "@reduxjs/toolkit/query/react";

import {
  IReqItems,
  IFetchUpdate,
  IUser,
  IUsersRoles,
  TUserCreate,
  TUserUpdate,
  TUserResList,
  TUserReqList,
} from "@ap/shared/dist/types";
import { baseQueryWithReauth } from "@/app/api/baseQueryWithReauth";
import { usersService } from "./service";

export const usersApi = createApi({
  reducerPath: "users",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CountedEntities", "Entities", "Entity"],
  endpoints: (builder) => ({
    create: builder.mutation<IUser, TUserCreate>({
      query: usersService.createArgs,
      invalidatesTags: ["CountedEntities"],
    }),

    getOne: builder.query<IUser, IUser["id"]>({
      query: usersService.getOneArgs,
      providesTags: ["Entity"],
    }),

    getList: builder.query<TUserResList, TUserReqList | void>({
      query: usersService.getListArgs,
      providesTags: ["Entities"],
    }),

    update: builder.mutation<undefined, IFetchUpdate<TUserUpdate, IUser["id"]>>(
      {
        query: usersService.updateArgs,
        invalidatesTags: ["Entity"],
      },
    ),

    updateRoles: builder.mutation<
      undefined,
      IFetchUpdate<IReqItems<IUsersRoles>, IUser["id"]>
    >({
      query: usersService.updateRolesArgs,
      invalidatesTags: ["Entity"],
    }),

    delete: builder.mutation<undefined, IReqItems<IUser["id"]>>({
      query: usersService.deleteArgs,
      invalidatesTags: ["CountedEntities"],
    }),
  }),
});
