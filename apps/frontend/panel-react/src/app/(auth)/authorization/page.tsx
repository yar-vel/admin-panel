import { Metadata } from "next/types";
import { FC } from "react";

import { AuthorizationPage } from "@/_pages/auth/AuthorizationPage";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("signIn"),
    description: t("signIn"),
  };
};

const Page: FC = async () => {
  const t = await getServerT();

  return <AuthorizationPage h1={t("signIn")} />;
};
export default Page;
