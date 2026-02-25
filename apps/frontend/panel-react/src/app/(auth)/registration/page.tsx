import { Metadata } from "next/types";
import { FC } from "react";

import { RegistrationPage } from "@/_pages/auth/RegistrationPage";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("signUp"),
    description: t("signUp"),
  };
};

const Page: FC = async () => {
  const t = await getServerT();

  return <RegistrationPage h1={t("signUp")} />;
};
export default Page;
