import { Metadata } from "next/types";
import { FC } from "react";

import { SignUpPage } from "@/_pages/auth/SignUpPage";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("signUp"),
    description: t("signUp"),
  };
};

const Page: FC<PageProps<"/sign-up">> = async () => {
  const t = await getServerT();

  return <SignUpPage h1={t("signUp")} />;
};
export default Page;
