import { Metadata } from "next/types";
import { FC } from "react";

import { GoogleAuthorizationPage } from "@/_pages/auth/GoogleAuthorizationPage";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("signInWithGoogle"),
    description: t("signInWithGoogle"),
  };
};

const Page: FC = async () => {
  const t = await getServerT();

  return <GoogleAuthorizationPage h1={t("signInWithGoogle")} />;
};
export default Page;
