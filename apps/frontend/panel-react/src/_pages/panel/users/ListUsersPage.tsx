"use client";

import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PanelLayout } from "../PanelLayout";
import { TPage } from "@/_pages/types";
import { IResListMeta, IUser, TUserResList } from "@ap/shared/dist/types";
import { UserList } from "@/features/users/UserList";
import { createSearchParams, resListMetaToReq } from "@ap/shared/dist/libs";

export const ListUsersPage: FC<TPage<TUserResList>> = ({ h1, data }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateHandler = (newMeta: IResListMeta<IUser>) => {
    const newParams = createSearchParams({
      data: resListMetaToReq<IUser>(newMeta),
      exclude: ["total"],
      searchParams,
    });
    router.push(`?${newParams.toString()}`);
  };

  return (
    <PanelLayout h1={h1}>
      <UserList
        initialRows={data.rows}
        initialMeta={data.meta}
        onMetaUpdate={updateHandler}
      />
    </PanelLayout>
  );
};
