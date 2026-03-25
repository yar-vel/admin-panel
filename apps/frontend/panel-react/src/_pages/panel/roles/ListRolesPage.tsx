"use client";

import { FC } from "react";

import { PanelLayout } from "@/widgets/layout/PanelLayout";
import { TPage } from "@/_pages/types";
import {
  IResListMeta,
  IRole,
  TRoleResList,
} from "@workspace/shared/dist/types";
import { RoleList } from "@/features/roles/RoleList";
import {
  createSearchParams,
  resListMetaToReq,
} from "@workspace/shared/dist/libs";

export const ListRolesPage: FC<TPage<TRoleResList>> = ({ h1, data }) => {
  const handleUpdate = (newMeta: IResListMeta<IRole>) => {
    const newParams = createSearchParams({
      data: resListMetaToReq<IRole>(newMeta),
      exclude: ["total"],
      searchParams: window.location.search,
    });
    window.history.replaceState(null, "", `?${newParams.toString()}`);
  };

  return (
    <PanelLayout h1={h1}>
      <RoleList initialMeta={data.meta} onMetaUpdate={handleUpdate} />
    </PanelLayout>
  );
};
