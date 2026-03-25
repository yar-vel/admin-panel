import { FC } from "react";
import { Metadata } from "next/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { ListResourcesPage } from "@/_pages/panel/resources/ListResourcesPage";
import { getServerT } from "@/shared/config/i18n/server";
import { resourceListQueryOptions } from "@/entities/resource/queries";
import { handleServerError } from "@/shared/api/handleServerError";
import { getServerHeaders } from "@/shared/api/getServerHeaders ";
import { resourceReqListSchema } from "@workspace/shared/dist/schemas";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("resources"),
    description: t("resources"),
  };
};

const Page: FC<PageProps<"/resources">> = async ({ searchParams }) => {
  const t = await getServerT();
  const queryClient = new QueryClient();
  const params = resourceReqListSchema.parse({
    ...(await searchParams),
    reqCount: true,
  });
  const data = await handleServerError(async () =>
    queryClient.ensureQueryData(
      resourceListQueryOptions(params, undefined, await getServerHeaders()),
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListResourcesPage h1={t("resources")} data={data} />
    </HydrationBoundary>
  );
};
export default Page;
