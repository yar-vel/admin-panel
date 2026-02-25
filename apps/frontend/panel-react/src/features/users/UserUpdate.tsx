import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useRights } from "@/shared/hooks/useRights";
import { useAppDispatch } from "@/app/store/hooks";
import { addAlert } from "@/app/store/main/main";
import { IUser, TUserUpdate } from "@ap/shared/dist/types";
import { getErrorText, getUpdatedValues } from "@ap/shared/dist/libs";
import { UserForm } from "@/entities/user/UserForm";
import { usersApi } from "@/entities/user/api";
import { ROUTES } from "@/shared/lib/constants";

export const UserUpdate: FC<{ data: IUser; onDelete?: () => void }> = ({
  data,
  onDelete,
}) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const [update, updateReq] = usersApi.useUpdateMutation();
  const [destroy, deleteReq] = usersApi.useDeleteMutation();
  const [cachedData, setCachedData] = useState<IUser>(data);
  const rights = useRights(ROUTES.api.users._);

  const updateHandler = (fields: TUserUpdate) => {
    const updatedValues = getUpdatedValues<TUserUpdate>(cachedData, fields);

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
    <UserForm
      initialData={data}
      onUpdate={(fields) => updateHandler(fields)}
      updateDisabled={
        !rights.updating || deleteReq.isLoading || deleteReq.isSuccess
      }
      updateLoading={updateReq.isLoading}
      onDelete={() => destroy({ items: [data.id] })}
      deleteDisabled={
        !rights.deleting ||
        deleteReq.isSuccess ||
        data.roles?.some((role) => role.admin)
      }
      deleteLoading={deleteReq.isLoading}
    />
  );
};
