import { FC, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useRights } from "@/shared/hooks/useRights";
import { IUser, TUserUpdate } from "@workspace/shared/dist/types";
import { getErrorText, getUpdatedValues } from "@workspace/shared/dist/libs";
import { UserForm } from "@/entities/user/UserForm";
import { useDeleteUsersMutation, useUpdateUserMutation } from "./mutations";
import { useAlertsStore } from "@/shared/model/useAlertsStore";
import { ROUTES } from "@/shared/lib/constants";

export const UserUpdate: FC<{ data: IUser; onDelete?: () => void }> = ({
  data,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const updateUser = useUpdateUserMutation();
  const deleteUsers = useDeleteUsersMutation();
  const cachedData = useRef(data);
  const rights = useRights(ROUTES.api.users._);
  const addAlert = useAlertsStore((s) => s.addAlert);

  const handleUpdate = (fields: TUserUpdate) => {
    const updatedValues = getUpdatedValues<TUserUpdate>(
      cachedData.current,
      fields,
    );

    if (Object.keys(updatedValues).length === 0) {
      addAlert({ type: "warning", text: t("nothingToUpdate") });
      return;
    }

    updateUser.mutate(
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
    deleteUsers.mutate(
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
    <UserForm
      initialData={data}
      onUpdate={handleUpdate}
      updateDisabled={
        !rights.updating || deleteUsers.isPending || deleteUsers.isSuccess
      }
      updateLoading={updateUser.isPending}
      onDelete={handleDelete}
      deleteDisabled={
        !rights.deleting ||
        deleteUsers.isSuccess ||
        data.roles?.some((role) => role.admin)
      }
      deleteLoading={deleteUsers.isPending}
    />
  );
};
