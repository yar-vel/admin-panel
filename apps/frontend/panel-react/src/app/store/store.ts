import { configureStore } from "@reduxjs/toolkit";

import mainSlice, { mainSliceName } from "./main/main";
import { authMiddleware } from "./authMiddleware";
import { authApi } from "@/entities/auth/api";
import { profileApi } from "@/entities/profile/api";
import { usersApi } from "@/entities/user/api";
import { rolesApi } from "@/entities/role/api";
import { resourcesApi } from "@/entities/resource/api";

export const makeStore = () =>
  configureStore({
    reducer: {
      [mainSliceName]: mainSlice,
      [authApi.reducerPath]: authApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [usersApi.reducerPath]: usersApi.reducer,
      [rolesApi.reducerPath]: rolesApi.reducer,
      [resourcesApi.reducerPath]: resourcesApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware()
        .concat(authApi.middleware)
        .concat(profileApi.middleware)
        .concat(usersApi.middleware)
        .concat(rolesApi.middleware)
        .concat(resourcesApi.middleware)
        .concat(authMiddleware.middleware);
    },
    devTools: false,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
