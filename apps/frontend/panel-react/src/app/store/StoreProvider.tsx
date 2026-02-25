"use client";

import { FC, PropsWithChildren, useRef } from "react";
import { Provider } from "react-redux";

import { AppStore, makeStore } from "@/app/store/store";
import { setProfile } from "@/app/store/main/main";

export const StoreProvider: FC<
  PropsWithChildren & { profileJson?: string | null }
> = ({ children, profileJson }) => {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();

    if (profileJson) {
      try {
        storeRef.current.dispatch(
          setProfile(JSON.parse(decodeURIComponent(profileJson))),
        );
      } catch {}
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
