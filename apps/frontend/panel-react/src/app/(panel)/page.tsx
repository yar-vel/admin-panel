import { FC } from "react";
import { Metadata } from "next/types";

import { HomePage } from "@/_pages/panel/HomePage";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("home"),
    description: t("home"),
  };
};

const Page: FC = async () => {
  const t = await getServerT();

  return <HomePage h1={t("home")} />;
};
export default Page;
