import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useRights } from "@/shared/hooks/useRights";
import { getErrorText } from "@workspace/shared/dist/libs";
import { ResourceForm } from "@/entities/resource/ResourceForm";
import { IResource, TResourceCreate } from "@workspace/shared/dist/types";
import { useCreateResourceMutation } from "./mutations";
import { useAlertsStore } from "@/shared/model/useAlertsStore";
import { ROUTES } from "@/shared/lib/constants";

export const ResourceCreate: FC<{ onCreate?: (data: IResource) => void }> = ({
  onCreate,
}) => {
  const { t, i18n } = useTranslation();
  const createResource = useCreateResourceMutation();
  const rights = useRights(ROUTES.api.resources._);
  const addAlert = useAlertsStore((s) => s.addAlert);

  const handleCreate = (fields: TResourceCreate) => {
    createResource.mutate(fields, {
      onSuccess: (data) => {
        addAlert({ type: "success", text: t("success") });
        onCreate?.(data);
      },
      onError: (error) =>
        addAlert({
          type: "error",
          text: getErrorText(error, i18n.language),
        }),
    });
  };

  return (
    <ResourceForm
      onCreate={handleCreate}
      createDisabled={!rights.creating}
      createLoading={createResource.isPending || Boolean(createResource.data)}
    />
  );
};
