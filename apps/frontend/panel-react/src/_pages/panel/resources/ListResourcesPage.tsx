"use client";

import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PanelLayout } from "../PanelLayout";
import { TPage } from "@/_pages/types";
import {
  IResListMeta,
  IResource,
  TResourceResList,
} from "@ap/shared/dist/types";
import { ResourceList } from "@/features/resources/ResourceList";
import { createSearchParams, resListMetaToReq } from "@ap/shared/dist/libs";

export const ListResourcesPage: FC<TPage<TResourceResList>> = ({
  h1,
  data,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateHandler = (newMeta: IResListMeta<IResource>) => {
    const newParams = createSearchParams({
      data: resListMetaToReq<IResource>(newMeta),
      exclude: ["total"],
      searchParams,
    });
    router.push(`?${newParams.toString()}`);
  };

  return (
    <PanelLayout h1={h1}>
      <ResourceList
        initialRows={data.rows}
        initialMeta={data.meta}
        onMetaUpdate={updateHandler}
      />
    </PanelLayout>
  );
};
