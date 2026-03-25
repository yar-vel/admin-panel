import { FC } from "react";
import { Metadata } from "next/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { EditUserPage } from "@/_pages/panel/users/EditUserPage";
import { getServerT } from "@/shared/config/i18n/server";
import { userQueryOptions } from "@/entities/user/queries";
import { handleServerError } from "@/shared/api/handleServerError";
import { roleListQueryOptions } from "@/entities/role/queries";
import { getServerHeaders } from "@/shared/api/getServerHeaders ";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getServerT();

  return {
    title: t("user"),
    description: t("user"),
  };
};

const Page: FC<PageProps<"/users/[id]">> = async ({ params }) => {
  const t = await getServerT();
  const { id } = await params;
  const queryClient = new QueryClient();
  const serverHeaders = await getServerHeaders();
  const [user, roles] = await handleServerError(() =>
    Promise.all([
      queryClient.ensureQueryData(userQueryOptions(id, serverHeaders)),
      queryClient.ensureQueryData(
        roleListQueryOptions(undefined, undefined, serverHeaders),
      ),
    ]),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditUserPage h1={t("user")} data={{ user, roles: roles.rows }} />
    </HydrationBoundary>
  );
};
export default Page;
