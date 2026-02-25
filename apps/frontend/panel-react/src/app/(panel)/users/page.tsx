import { FC } from "react";
import { Metadata } from "next/types";
import { notFound } from "next/navigation";

import { IAppPage } from "@/app/types";
import { ListUsersPage } from "@/_pages/panel/users/ListUsersPage";
import { usersService } from "@/entities/user/service";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("users"),
    description: t("users"),
  };
};

const Page: FC<IAppPage> = async ({ searchParams }) => {
  const t = await getServerT();
  const { data } = await usersService.getList(await searchParams);

  if (data) {
    return <ListUsersPage data={data} h1={t("users")} />;
  }

  return notFound();
};
export default Page;
