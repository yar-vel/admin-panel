"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";

import { PanelLayout } from "../PanelLayout";
import { TPage } from "@/_pages/types";
import { RoleCreate } from "@/features/roles/RoleCreate";
import { ROUTES } from "@/shared/lib/constants";

export const CreateRolePage: FC<TPage> = ({ h1 }) => {
  const router = useRouter();

  return (
    <PanelLayout h1={h1}>
      <RoleCreate onCreate={(data) => router.push(ROUTES.ui.role(data.id))} />
    </PanelLayout>
  );
};
