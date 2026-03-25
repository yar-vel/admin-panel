import { FC, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useRights } from "@/shared/hooks/useRights";
import { IResource, TResourceUpdate } from "@workspace/shared/dist/types";
import { getErrorText, getUpdatedValues } from "@workspace/shared/dist/libs";
import { ResourceForm } from "@/entities/resource/ResourceForm";
import { ROUTES } from "@/shared/lib/constants";
import {
  useDeleteResourcesMutation,
  useUpdateResourceMutation,
} from "./mutations";
import { useAlertsStore } from "@/shared/model/useAlertsStore";

export const ResourceUpdate: FC<{ data: IResource; onDelete?: () => void }> = ({
  data,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const updateResource = useUpdateResourceMutation();
  const deleteResources = useDeleteResourcesMutation();
  const cachedData = useRef(data);
  const rights = useRights(ROUTES.api.resources._);
  const addAlert = useAlertsStore((s) => s.addAlert);

  const handleUpdate = (fields: TResourceUpdate) => {
    const updatedValues = getUpdatedValues<TResourceUpdate>(
      cachedData.current,
      fields,
    );

    if (Object.keys(updatedValues).length === 0) {
      addAlert({ type: "warning", text: t("nothingToUpdate") });
      return;
    }

    updateResource.mutate(
      { id: data.id, fields: updatedValues },
      {
        onSuccess: () => {
          addAlert({ type: "success", text: t("success") });
          cachedData.current = { ...cachedData.current, ...updatedValues };
        },
        onError: (error) =>
          addAlert({ type: "error", text: getErrorText(error, i18n.language) }),
      },
    );
  };

  const handleDelete = () => {
    deleteResources.mutate(
      { items: [data.id] },
      {
        onSuccess: () => {
          addAlert({ type: "success", text: t("success") });
          onDelete?.();
        },
        onError: (error) =>
          addAlert({ type: "error", text: getErrorText(error, i18n.language) }),
      },
    );
  };

  return (
    <ResourceForm
      initialData={data}
      onUpdate={handleUpdate}
      updateDisabled={
        !rights.updating ||
        data.default ||
        deleteResources.isPending ||
        deleteResources.isSuccess
      }
      updateLoading={updateResource.isPending}
      onDelete={handleDelete}
      deleteDisabled={
        !rights.deleting || deleteResources.isSuccess || data.default
      }
      deleteLoading={deleteResources.isPending}
    />
  );
};
