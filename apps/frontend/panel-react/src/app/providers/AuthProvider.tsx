import { FC, PropsWithChildren } from "react";
import { cookies } from "next/headers";

import { IUser } from "@workspace/shared";
import { ProfileStoreProvider } from "./ProfileStoreProvider";
import { getProfile } from "@/entities/profile/api";
import { getServerHeaders } from "@/shared/api/getServerHeaders ";

export const AuthProvider: FC<PropsWithChildren> = async ({ children }) => {
  const cookiesList = await cookies();
  const accessToken = cookiesList.get("accessToken");
  const refreshToken = cookiesList.get("refreshToken");
  let profile: IUser | null = null;

  if (accessToken || refreshToken) {
    try {
      profile = await getProfile(await getServerHeaders());
    } catch {}
  }

  return (
    <ProfileStoreProvider profile={profile}>{children}</ProfileStoreProvider>
  );
};
