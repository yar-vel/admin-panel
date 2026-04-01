import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { createContext, useContext } from "react";

import { IUser } from "@workspace/shared";

export interface IProfileState {
  profile: IUser | null;
  isProfileChecked: boolean;
}

export interface IProfileActions {
  setProfile: (profile: IUser | null, isProfileChecked?: boolean) => void;
}

export type TProfileStore = IProfileState & IProfileActions;

export const defaultInitState: IProfileState = {
  profile: null,
  isProfileChecked: false,
};

export const createProfileStore = (initState = defaultInitState) => {
  return createStore<TProfileStore>()((set) => ({
    ...initState,
    setProfile: (profile, isProfileChecked = true) =>
      set({ profile, isProfileChecked }),
  }));
};

export const ProfileStoreContext = createContext<
  ReturnType<typeof createProfileStore> | undefined
>(undefined);

export const useProfileStore = <T>(
  selector: (store: TProfileStore) => T,
): T => {
  const profileStoreContext = useContext(ProfileStoreContext);

  if (!profileStoreContext) {
    throw new Error(`useProfileStore must be used within ProfileStoreProvider`);
  }

  return useStore(profileStoreContext, selector);
};
