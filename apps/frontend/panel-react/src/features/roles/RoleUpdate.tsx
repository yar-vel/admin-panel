import { FC, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useRights } from "@/shared/hooks/useRights";
import {
  getErrorText,
  getUpdatedValues,
  IRole,
  TRoleUpdate,
} from "@workspace/shared";
import { RoleForm } from "@/entities/role/RoleForm";
import { ROUTES } from "@workspace/shared";
import { useDeleteRolesMutation, useUpdateRoleMutation } from "./mutations";
import { useAlertsStore } from "@/shared/model/useAlertsStore";

export const RoleUpdate: FC<{ data: IRole; onDelete?: () => void }> = ({
  data,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const updateRole = useUpdateRoleMutation();
  const deleteRoles = useDeleteRolesMutation();
  const cachedData = useRef(data);
  const rights = useRights(ROUTES.api.roles._);
  const addAlert = useAlertsStore((s) => s.addAlert);

  const handleUpdate = (fields: TRoleUpdate) => {
    const updatedValues = getUpdatedValues<TRoleUpdate>(
      cachedData.current,
      fields,
    );

    if (Object.keys(updatedValues).length === 0) {
      addAlert({ type: "warning", text: t("nothingToUpdate") });
      return;
    }

    updateRole.mutate(
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
    deleteRoles.mutate(
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
    <RoleForm
      initialData={data}
      onUpdate={handleUpdate}
      updateDisabled={
        !rights.updating ||
        data.default ||
        deleteRoles.isPending ||
        deleteRoles.isSuccess
      }
      updateLoading={updateRole.isPending}
      onDelete={handleDelete}
      deleteDisabled={!rights.deleting || deleteRoles.isSuccess || data.default}
      deleteLoading={deleteRoles.isPending}
    />
  );
};
