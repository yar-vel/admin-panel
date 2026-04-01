import { FC } from "react";
import { Metadata } from "next/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { ListUsersPage } from "@/_pages/panel/users/ListUsersPage";
import { getServerT } from "@/shared/config/i18n/server";
import { handleServerError } from "@/shared/api/handleServerError";
import { userListQueryOptions } from "@/entities/user/queries";
import { getServerHeaders } from "@/shared/api/getServerHeaders ";
import { userReqListSchema } from "@workspace/shared";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("users"),
    description: t("users"),
  };
};

const Page: FC<PageProps<"/users">> = async ({ searchParams }) => {
  const t = await getServerT();
  const queryClient = new QueryClient();
  const params = userReqListSchema.parse({
    ...(await searchParams),
    reqCount: true,
  });
  const data = await handleServerError(async () =>
    queryClient.ensureQueryData(
      userListQueryOptions(params, undefined, await getServerHeaders()),
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListUsersPage h1={t("users")} data={data} />
    </HydrationBoundary>
  );
};
export default Page;
