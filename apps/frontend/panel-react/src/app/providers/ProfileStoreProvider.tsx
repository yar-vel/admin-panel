"use client";

import { FC, PropsWithChildren, useState } from "react";

import {
  createProfileStore,
  ProfileStoreContext,
} from "@/entities/profile/store";
import { IUser } from "@workspace/shared/dist/types";

export const ProfileStoreProvider: FC<
  PropsWithChildren<{ profile?: IUser | null }>
> = ({ children, profile }) => {
  const [store] = useState(() => {
    const storeInit = createProfileStore();

    if (profile) {
      storeInit.getState().setProfile(profile);
    }

    return storeInit;
  });

  return (
    <ProfileStoreContext.Provider value={store}>
      {children}
    </ProfileStoreContext.Provider>
  );
};
