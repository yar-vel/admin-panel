"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";

import { PanelLayout } from "../PanelLayout";
import { TPage } from "@/_pages/types";
import { UserCreate } from "@/features/users/UserCreate";
import { ROUTES } from "@/shared/lib/constants";

export const CreateUserPage: FC<TPage> = ({ h1 }) => {
  const router = useRouter();

  return (
    <PanelLayout h1={h1}>
      <UserCreate onCreate={(data) => router.push(ROUTES.ui.user(data.id))} />
    </PanelLayout>
  );
};
