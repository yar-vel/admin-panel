import { createApi } from "@reduxjs/toolkit/query/react";

import {
  IReqItems,
  IRights,
  IRole,
  IFetchUpdate,
  TRoleCreate,
  TRoleUpdate,
  TRoleResList,
  TRoleReqList,
} from "@ap/shared/dist/types";
import { baseQueryWithReauth } from "@/app/api/baseQueryWithReauth";
import { rolesService } from "./service";

export const rolesApi = createApi({
  reducerPath: "roles",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CountedEntities", "Entities", "Entity"],
  endpoints: (builder) => ({
    create: builder.mutation<IRole, TRoleCreate>({
      query: rolesService.createArgs,
      invalidatesTags: ["CountedEntities"],
    }),

    getOne: builder.query<IRole, IRole["id"]>({
      query: rolesService.getOneArgs,
      providesTags: ["Entity"],
    }),

    getList: builder.query<TRoleResList, TRoleReqList | void>({
      query: rolesService.getListArgs,
      providesTags: ["Entities"],
    }),

    update: builder.mutation<undefined, IFetchUpdate<TRoleUpdate, IRole["id"]>>(
      {
        query: rolesService.updateArgs,
        invalidatesTags: ["Entity"],
      },
    ),

    updateRights: builder.mutation<
      undefined,
      IFetchUpdate<IReqItems<IRights>, IRole["id"]>
    >({
      query: rolesService.updateRightsArgs,
      invalidatesTags: ["Entity"],
    }),

    delete: builder.mutation<undefined, IReqItems<IRole["id"]>>({
      query: rolesService.deleteArgs,
      invalidatesTags: ["CountedEntities"],
    }),
  }),
});
