import { FC } from "react";
import { Metadata } from "next/types";

import { CreateUserPage } from "@/_pages/panel/users/CreateUserPage";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("newUser"),
    description: t("newUser"),
  };
};

const Page: FC = async () => {
  const t = await getServerT();

  return <CreateUserPage h1={t("newUser")} />;
};
export default Page;
