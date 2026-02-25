import { FC } from "react";
import { Metadata } from "next/types";

import { CreateRolePage } from "@/_pages/panel/roles/CreateRolePage";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("newRole"),
    description: t("newRole"),
  };
};

const Page: FC = async () => {
  const t = await getServerT();

  return <CreateRolePage h1={t("newRole")} />;
};
export default Page;
