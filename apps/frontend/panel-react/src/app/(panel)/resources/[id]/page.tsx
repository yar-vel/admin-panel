import { FC } from "react";
import { Metadata } from "next/types";
import { notFound } from "next/navigation";

import { IAppPage } from "@/app/types";
import { EditResourcePage } from "@/_pages/panel/resources/EditResourcePage";
import { resourcesService } from "@/entities/resource/service";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("resource"),
    description: t("resource"),
  };
};

const Page: FC<IAppPage> = async ({ params }) => {
  const t = await getServerT();
  const { id } = await params;

  if (id) {
    const { data } = await resourcesService.getOne(id);

    if (data) {
      return <EditResourcePage h1={t("resource")} data={data} />;
    }
  }

  return notFound();
};
export default Page;
