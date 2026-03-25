"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";

import { PanelLayout } from "@/widgets/layout/PanelLayout";
import { TPage } from "@/_pages/types";
import { IResource } from "@workspace/shared/dist/types";
import { ResourceUpdate } from "@/features/resources/ResourceUpdate";
import { ROUTES } from "@/shared/lib/constants";

export const EditResourcePage: FC<TPage<IResource>> = ({ h1, data }) => {
  const router = useRouter();

  return (
    <PanelLayout h1={h1}>
      <ResourceUpdate
        data={data}
        onDelete={() => router.push(ROUTES.ui.resources)}
      />
    </PanelLayout>
  );
};
