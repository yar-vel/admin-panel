import { FC } from "react";
import { Metadata } from "next/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { EditResourcePage } from "@/_pages/panel/resources/EditResourcePage";
import { getServerT } from "@/shared/config/i18n/server";
import { handleServerError } from "@/shared/api/handleServerError";
import { resourceQueryOptions } from "@/entities/resource/queries";
import { getServerHeaders } from "@/shared/api/getServerHeaders ";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("resource"),
    description: t("resource"),
  };
};

const Page: FC<PageProps<"/resources/[id]">> = async ({ params }) => {
  const t = await getServerT();
  const { id } = await params;
  const queryClient = new QueryClient();
  const data = await handleServerError(async () =>
    queryClient.ensureQueryData(
      resourceQueryOptions(id, await getServerHeaders()),
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditResourcePage h1={t("resource")} data={data} />
    </HydrationBoundary>
  );
};
export default Page;
