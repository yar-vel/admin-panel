import { Metadata } from "next/types";
import { FC } from "react";

import { ForgotPasswordPage } from "@/_pages/auth/ForgotPasswordPage";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("forgotPassword"),
    description: t("forgotPassword"),
  };
};

const Page: FC = async () => {
  const t = await getServerT();

  return <ForgotPasswordPage h1={t("forgotPassword")} />;
};
export default Page;
