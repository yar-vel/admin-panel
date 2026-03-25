"use client";

import { FC } from "react";

import { PanelLayout } from "@/widgets/layout/PanelLayout";
import { TPage } from "@/_pages/types";
import {
  IResListMeta,
  IResource,
  TResourceResList,
} from "@workspace/shared/dist/types";
import { ResourceList } from "@/features/resources/ResourceList";
import {
  createSearchParams,
  resListMetaToReq,
} from "@workspace/shared/dist/libs";

export const ListResourcesPage: FC<TPage<TResourceResList>> = ({
  h1,
  data,
}) => {
  const handleUpdate = (newMeta: IResListMeta<IResource>) => {
    const newParams = createSearchParams({
      data: resListMetaToReq<IResource>(newMeta),
      exclude: ["reqCount"],
      searchParams: window.location.search,
    });
    window.history.replaceState(null, "", `?${newParams.toString()}`);
  };

  return (
    <PanelLayout h1={h1}>
      <ResourceList initialMeta={data.meta} onMetaUpdate={handleUpdate} />
    </PanelLayout>
  );
};
