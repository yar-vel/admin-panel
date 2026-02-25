import { FC } from "react";
import { Metadata } from "next/types";
import { notFound } from "next/navigation";

import { IAppPage } from "@/app/types";
import { ListRolesPage } from "@/_pages/panel/roles/ListRolesPage";
import { rolesService } from "@/entities/role/service";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("roles"),
    description: t("roles"),
  };
};

const Page: FC<IAppPage> = async ({ searchParams }) => {
  const t = await getServerT();
  const { data } = await rolesService.getList(await searchParams);

  if (data) {
    return <ListRolesPage data={data} h1={t("roles")} />;
  }

  return notFound();
};
export default Page;
