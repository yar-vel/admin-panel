import { Metadata } from "next/types";
import { FC } from "react";

import { SignInGooglePage } from "@/_pages/auth/SignInGooglePage";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("signInWithGoogle"),
    description: t("signInWithGoogle"),
  };
};

const Page: FC<PageProps<"/sign-in/google">> = async () => {
  const t = await getServerT();

  return <SignInGooglePage h1={t("signInWithGoogle")} />;
};
export default Page;
