import { FC } from "react";
import { Metadata } from "next/types";

import { CreateResourcePage } from "@/_pages/panel/resources/CreateResourcePage";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("newResource"),
    description: t("newResource"),
  };
};

const Page: FC = async () => {
  const t = await getServerT();

  return <CreateResourcePage h1={t("newResource")} />;
};
export default Page;
