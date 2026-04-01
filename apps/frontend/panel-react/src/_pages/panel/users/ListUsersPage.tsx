"use client";

import { FC } from "react";

import { PanelLayout } from "@/widgets/layout/PanelLayout";
import { TPage } from "@/_pages/types";
import {
  createSearchParams,
  resListMetaToReq,
  IResListMeta,
  IUser,
  TUserResList,
} from "@workspace/shared";
import { UserList } from "@/features/users/UserList";

export const ListUsersPage: FC<TPage<TUserResList>> = ({ h1, data }) => {
  const handleUpdate = (newMeta: IResListMeta<IUser>) => {
    const newParams = createSearchParams({
      data: resListMetaToReq<IUser>(newMeta),
      exclude: ["total"],
      searchParams: window.location.search,
    });
    window.history.replaceState(null, "", `?${newParams.toString()}`);
  };

  return (
    <PanelLayout h1={h1}>
      <UserList initialMeta={data.meta} onMetaUpdate={handleUpdate} />
    </PanelLayout>
  );
};
