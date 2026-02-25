import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useRights } from "@/shared/hooks/useRights";
import { useAppDispatch } from "@/app/store/hooks";
import { addAlert } from "@/app/store/main/main";
import { IRole, TRoleUpdate } from "@ap/shared/dist/types";
import { getErrorText, getUpdatedValues } from "@ap/shared/dist/libs";
import { RoleForm } from "@/entities/role/RoleForm";
import { rolesApi } from "@/entities/role/api";
import { ROUTES } from "@/shared/lib/constants";

export const RoleUpdate: FC<{ data: IRole; onDelete?: () => void }> = ({
  data,
  onDelete,
}) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const [update, updateReq] = rolesApi.useUpdateMutation();
  const [destroy, deleteReq] = rolesApi.useDeleteMutation();
  const [cachedData, setCachedData] = useState<IRole>(data);
  const rights = useRights(ROUTES.api.roles._);

  const updateHandler = (fields: TRoleUpdate) => {
    const updatedValues = getUpdatedValues<TRoleUpdate>(cachedData, fields);

    if (Object.keys(updatedValues).length > 0) {
      update({ id: data.id, fields: updatedValues });
    } else {
      dispatch(addAlert({ type: "warning", text: t("nothingToUpdate") }));
    }
  };

  useEffect(() => {
    if (updateReq.isSuccess) {
      dispatch(addAlert({ type: "success", text: t("success") }));
      setCachedData((prev) => ({ ...prev, ...updateReq.originalArgs?.fields }));
    }
  }, [updateReq.isSuccess, updateReq.originalArgs, dispatch, t]);

  useEffect(() => {
    if (updateReq.error) {
      dispatch(
        addAlert({
          type: "error",
          text: getErrorText(updateReq.error, i18n.language),
        }),
      );
    }
  }, [updateReq.error, dispatch, i18n]);

  useEffect(() => {
    if (deleteReq.isSuccess) {
      dispatch(addAlert({ type: "success", text: t("success") }));
      onDelete?.();
    }
  }, [deleteReq.isSuccess, dispatch, onDelete, t]);

  useEffect(() => {
    if (deleteReq.error) {
      dispatch(
        addAlert({
          type: "error",
          text: getErrorText(deleteReq.error, i18n.language),
        }),
      );
    }
  }, [deleteReq.error, dispatch, i18n]);

  return (
    <RoleForm
      initialData={data}
      onUpdate={(fields) => updateHandler(fields)}
      updateDisabled={
        !rights.updating ||
        data.default ||
        deleteReq.isLoading ||
        deleteReq.isSuccess
      }
      updateLoading={updateReq.isLoading}
      onDelete={() => destroy({ items: [data.id] })}
      deleteDisabled={!rights.deleting || deleteReq.isSuccess || data.default}
      deleteLoading={deleteReq.isLoading}
    />
  );
};
