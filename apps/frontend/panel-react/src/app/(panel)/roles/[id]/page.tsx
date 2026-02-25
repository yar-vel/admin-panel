import { FC } from "react";
import { Metadata } from "next/types";
import { notFound } from "next/navigation";

import { IAppPage } from "@/app/types";
import { EditRolePage } from "@/_pages/panel/roles/EditRolePage";
import { rolesService } from "@/entities/role/service";
import { resourcesService } from "@/entities/resource/service";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("role"),
    description: t("role"),
  };
};

const Page: FC<IAppPage> = async ({ params }) => {
  const t = await getServerT();
  const { id } = await params;

  if (id) {
    const role = await rolesService.getOne(id);
    const resources = await resourcesService.getList();

    if (role.data) {
      return (
        <EditRolePage
          h1={t("role")}
          data={{ role: role.data, resources: resources.data?.rows }}
        />
      );
    }
  }

  return notFound();
};
export default Page;
