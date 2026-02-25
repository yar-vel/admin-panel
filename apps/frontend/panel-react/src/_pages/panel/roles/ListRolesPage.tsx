"use client";

import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PanelLayout } from "../PanelLayout";
import { IResListMeta, IRole, TRoleResList } from "@ap/shared/dist/types";
import { RoleList } from "@/features/roles/RoleList";
import { TPage } from "@/_pages/types";
import { createSearchParams, resListMetaToReq } from "@ap/shared/dist/libs";

export const ListRolesPage: FC<TPage<TRoleResList>> = ({ h1, data }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateHandler = (newMeta: IResListMeta<IRole>) => {
    const newParams = createSearchParams({
      data: resListMetaToReq<IRole>(newMeta),
      exclude: ["total"],
      searchParams,
    });
    router.push(`?${newParams.toString()}`);
  };

  return (
    <PanelLayout h1={h1}>
      <RoleList
        initialRows={data.rows}
        initialMeta={data.meta}
        onMetaUpdate={updateHandler}
      />
    </PanelLayout>
  );
};
