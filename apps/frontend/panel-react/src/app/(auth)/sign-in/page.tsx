import { Metadata } from "next/types";
import { FC } from "react";

import { SignInPage } from "@/_pages/auth/SignInPage";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("signIn"),
    description: t("signIn"),
  };
};

const Page: FC<PageProps<"/sign-in">> = async () => {
  const t = await getServerT();

  return <SignInPage h1={t("signIn")} />;
};
export default Page;
