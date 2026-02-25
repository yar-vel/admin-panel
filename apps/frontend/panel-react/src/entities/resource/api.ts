import { createApi } from "@reduxjs/toolkit/query/react";

import {
  IReqItems,
  IResource,
  IFetchUpdate,
  TResourceCreate,
  TResourceUpdate,
  TResourceResList,
  TResourceReqList,
} from "@ap/shared/dist/types";
import { baseQueryWithReauth } from "@/app/api/baseQueryWithReauth";
import { resourcesService } from "./service";

export const resourcesApi = createApi({
  reducerPath: "resources",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CountedEntities", "Entities", "Entity"],
  endpoints: (builder) => ({
    create: builder.mutation<IResource, TResourceCreate>({
      query: resourcesService.createArgs,
      invalidatesTags: ["CountedEntities"],
    }),

    getOne: builder.query<IResource, IResource["id"]>({
      query: resourcesService.getOneArgs,
      providesTags: ["Entity"],
    }),

    getList: builder.query<TResourceResList, TResourceReqList | void>({
      query: resourcesService.getListArgs,
      providesTags: ["Entities"],
    }),

    update: builder.mutation<
      undefined,
      IFetchUpdate<TResourceUpdate, IResource["id"]>
    >({
      query: resourcesService.updateArgs,
      invalidatesTags: ["Entity"],
    }),

    delete: builder.mutation<undefined, IReqItems<IResource["id"]>>({
      query: resourcesService.deleteArgs,
      invalidatesTags: ["CountedEntities"],
    }),
  }),
});
