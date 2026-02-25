"use client";

import { FC } from "react";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { PanelLayout } from "../PanelLayout";
import { TPage } from "@/_pages/types";
import { IRole, IUser } from "@ap/shared/dist/types";
import { UserUpdate } from "@/features/users/UserUpdate";
import { UserRolesUpdate } from "@/features/users/UserRolesUpdate";
import { ROUTES } from "@/shared/lib/constants";

export const EditUserPage: FC<
  TPage<{
    user: IUser;
    roles?: IRole[] | null;
  }>
> = ({ h1, data }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <PanelLayout h1={h1}>
      <UserUpdate
        data={data.user}
        onDelete={() => router.push(ROUTES.ui.users)}
      />
      {data.roles && (
        <>
          <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 1 }}>
            {t("roles")}
          </Typography>
          <UserRolesUpdate user={data.user} roles={data.roles} />
        </>
      )}
    </PanelLayout>
  );
};
