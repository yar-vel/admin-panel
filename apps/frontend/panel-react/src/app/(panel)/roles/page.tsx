import { FC } from "react";
import { Metadata } from "next/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { ListRolesPage } from "@/_pages/panel/roles/ListRolesPage";
import { getServerT } from "@/shared/config/i18n/server";
import { handleServerError } from "@/shared/api/handleServerError";
import { roleListQueryOptions } from "@/entities/role/queries";
import { getServerHeaders } from "@/shared/api/getServerHeaders ";
import { roleReqListSchema } from "@workspace/shared";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("roles"),
    description: t("roles"),
  };
};

const Page: FC<PageProps<"/roles">> = async ({ searchParams }) => {
  const t = await getServerT();
  const queryClient = new QueryClient();
  const params = roleReqListSchema.parse({
    ...(await searchParams),
    reqCount: true,
  });
  const data = await handleServerError(async () =>
    queryClient.ensureQueryData(
      roleListQueryOptions(params, undefined, await getServerHeaders()),
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListRolesPage h1={t("roles")} data={data} />
    </HydrationBoundary>
  );
};
export default Page;
