import { FC } from "react";
import { Metadata } from "next/types";
import { notFound } from "next/navigation";

import { IAppPage } from "@/app/types";
import { EditUserPage } from "@/_pages/panel/users/EditUserPage";
import { usersService } from "@/entities/user/service";
import { rolesService } from "@/entities/role/service";
import { getServerT } from "@/shared/config/i18n/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("user"),
    description: t("user"),
  };
};

const Page: FC<IAppPage> = async ({ params }) => {
  const t = await getServerT();
  const { id } = await params;

  if (id) {
    const user = await usersService.getOne(id);
    const roles = await rolesService.getList();

    if (user.data) {
      return (
        <EditUserPage
          h1={t("user")}
          data={{ user: user.data, roles: roles.data?.rows }}
        />
      );
    }
  }

  return notFound();
};
export default Page;
