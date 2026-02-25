import { FC } from "react";
import { Metadata } from "next/types";
import { notFound } from "next/navigation";

import { IAppPage } from "@/app/types";
import { ListResourcesPage } from "@/_pages/panel/resources/ListResourcesPage";
import { resourcesService } from "@/entities/resource/service";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("resources"),
    description: t("resources"),
  };
};

const Page: FC<IAppPage> = async ({ searchParams }) => {
  const t = await getServerT();
  const { data } = await resourcesService.getList(await searchParams);

  if (data) {
    return <ListResourcesPage data={data} h1={t("resources")} />;
  }

  return notFound();
};
export default Page;
