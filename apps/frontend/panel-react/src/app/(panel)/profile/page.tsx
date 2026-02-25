import { FC } from "react";
import { Metadata } from "next/types";

import { ProfilePage } from "@/_pages/panel/ProfilePage";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("profile"),
    description: t("profile"),
  };
};

const Page: FC = async () => {
  const t = await getServerT();

  return <ProfilePage h1={t("profile")} />;
};
export default Page;
