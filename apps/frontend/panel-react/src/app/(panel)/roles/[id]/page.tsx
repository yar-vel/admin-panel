import { FC } from "react";
import { Metadata } from "next/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { EditRolePage } from "@/_pages/panel/roles/EditRolePage";
import { getServerT } from "@/shared/config/i18n/server";
import { handleServerError } from "@/shared/api/handleServerError";
import { roleQueryOptions } from "@/entities/role/queries";
import { resourceListQueryOptions } from "@/entities/resource/queries";
import { getServerHeaders } from "@/shared/api/getServerHeaders ";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("role"),
    description: t("role"),
  };
};

const Page: FC<PageProps<"/roles/[id]">> = async ({ params }) => {
  const t = await getServerT();
  const { id } = await params;
  const queryClient = new QueryClient();
  const serverHeaders = await getServerHeaders();
  const [role, resources] = await handleServerError(() =>
    Promise.all([
      queryClient.ensureQueryData(roleQueryOptions(id, serverHeaders)),
      queryClient.ensureQueryData(
        resourceListQueryOptions(undefined, undefined, serverHeaders),
      ),
    ]),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditRolePage h1={t("role")} data={{ role, resources: resources.rows }} />
    </HydrationBoundary>
  );
};
export default Page;
