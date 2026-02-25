"use client";

import { FC } from "react";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

import { PanelLayout } from "../PanelLayout";
import { TPage } from "@/_pages/types";
import { IResource, IRole } from "@ap/shared/dist/types";
import { RoleUpdate } from "@/features/roles/RoleUpdate";
import { useRouter } from "next/navigation";
import { RoleRightsUpdate } from "@/features/roles/RoleRightsUpdate";
import { ROUTES } from "@/shared/lib/constants";

export const EditRolePage: FC<
  TPage<{
    role: IRole;
    resources?: IResource[] | null;
  }>
> = ({ h1, data }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <PanelLayout h1={h1}>
      <RoleUpdate
        data={data.role}
        onDelete={() => router.push(ROUTES.ui.roles)}
      />
      {data.resources && (
        <>
          <Typography component="h2" variant="h6" sx={{ mt: 3, mb: 1 }}>
            {t("resources")}
          </Typography>
          <RoleRightsUpdate role={data.role} resources={data.resources} />
        </>
      )}
    </PanelLayout>
  );
};
